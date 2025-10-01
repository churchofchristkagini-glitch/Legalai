import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ChatRequest {
  query: string
  sessionId: string
  userId: string
}

interface DocumentChunk {
  id: string
  content: string
  metadata: any
  document_id: string
}

interface Citation {
  caseName: string
  year: string
  court: string
  url?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { query, sessionId, userId }: ChatRequest = await req.json()

    if (!query || !sessionId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: query, sessionId, userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Processing query:', query)

    // Step 1: Generate embedding for the user's query
    const queryEmbedding = await generateEmbedding(query, openaiApiKey)

    // Step 2: Perform vector similarity search
    const relevantChunks = await performVectorSearch(supabase, queryEmbedding)

    // Step 3: Generate AI response with context
    const aiResponse = await generateAIResponse(query, relevantChunks, openaiApiKey)

    // Step 4: Extract citations from the response and relevant chunks
    const citations = extractCitations(relevantChunks)

    return new Response(
      JSON.stringify({
        content: aiResponse,
        sources: citations,
        metadata: {
          chunks_used: relevantChunks.length,
          query_processed: true
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('AI Chat error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        content: "I apologize, but I'm experiencing technical difficulties. Please try again later.",
        sources: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002',
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI Embedding API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

async function performVectorSearch(supabase: any, queryEmbedding: number[]): Promise<DocumentChunk[]> {
  // Convert embedding array to string format for PostgreSQL
  const embeddingString = `[${queryEmbedding.join(',')}]`

  // For now, fallback to text search since vector search function may not be set up yet
  // TODO: Implement proper vector search once pgvector extension and RPC function are configured
  return await performTextSearch(supabase, queryEmbedding)
}

async function performTextSearch(supabase: any, queryEmbedding: number[]): Promise<DocumentChunk[]> {
  // Fallback text search when vector search is not available
  const { data, error } = await supabase
    .from('document_chunks')
    .select(`
      id,
      content,
      metadata,
      document_id,
      documents!inner(title, type, metadata)
    `)
    .textSearch('content', 'Nigerian | law | legal | case | court | statute')
    .limit(5)

  if (error) {
    console.error('Text search error:', error)
    return []
  }

  return data || []
}

async function generateAIResponse(query: string, chunks: DocumentChunk[], apiKey: string): Promise<string> {
  // Construct context from relevant chunks
  const context = chunks.map((chunk, index) => 
    `[Document ${index + 1}]: ${chunk.content}`
  ).join('\n\n')

  const systemPrompt = `You are NaijaLaw AI, an expert legal assistant specializing in Nigerian law. You have access to a comprehensive database of Nigerian legal documents, cases, and statutes.

Your role is to:
1. Provide accurate, well-researched answers about Nigerian law
2. Cite relevant cases and statutes when applicable
3. Explain legal concepts clearly for legal professionals
4. Always base your responses on the provided context when available
5. If you cannot find relevant information in the context, clearly state this limitation

Context from Nigerian legal documents:
${context}

Guidelines:
- Always prioritize accuracy over completeness
- Use proper legal citation format for Nigerian cases
- Explain the reasoning behind legal principles
- Distinguish between binding precedents and persuasive authorities
- Consider the hierarchy of Nigerian courts when discussing precedents`

  const userPrompt = `Question: ${query}

Please provide a comprehensive answer based on the Nigerian legal documents provided in the context. If the context doesn't contain sufficient information to fully answer the question, please indicate what additional research might be needed.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI Chat API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

function extractCitations(chunks: DocumentChunk[]): Citation[] {
  const citations: Citation[] = []
  
  chunks.forEach(chunk => {
    if (chunk.metadata) {
      // Extract case information from metadata
      const caseName = chunk.metadata.case_name || chunk.metadata.title || 'Unknown Case'
      const year = chunk.metadata.year || chunk.metadata.date || 'Unknown Year'
      const court = chunk.metadata.court || 'Unknown Court'
      const url = chunk.metadata.url || chunk.metadata.source_url

      // Avoid duplicate citations
      const existingCitation = citations.find(c => 
        c.caseName === caseName && c.year === year && c.court === court
      )

      if (!existingCitation) {
        citations.push({
          caseName,
          year,
          court,
          url
        })
      }
    }
  })

  // If no citations found from metadata, create generic ones
  if (citations.length === 0 && chunks.length > 0) {
    citations.push({
      caseName: "Nigerian Legal Database",
      year: new Date().getFullYear().toString(),
      court: "Legal Research Database"
    })
  }

  return citations
}