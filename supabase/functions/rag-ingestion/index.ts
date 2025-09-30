import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DocumentChunk {
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
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

    const { documentId, content, metadata } = await req.json()

    if (!documentId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: documentId, content' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Chunk the document content
    const chunks = chunkDocument(content, metadata)
    
    // Generate embeddings for each chunk
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await generateEmbedding(chunk.content)
        return { ...chunk, embedding }
      })
    )

    // Store chunks with embeddings in the database
    const { data, error } = await supabase
      .from('document_chunks')
      .insert(
        chunksWithEmbeddings.map(chunk => ({
          document_id: documentId,
          content: chunk.content,
          metadata: chunk.metadata,
          embedding: chunk.embedding
        }))
      )

    if (error) {
      throw error
    }

    // Update the main document record
    await supabase
      .from('documents')
      .update({ 
        content: content.substring(0, 1000) + '...', // Store preview
        metadata: { ...metadata, chunks_count: chunks.length, processed: true }
      })
      .eq('id', documentId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        chunks_processed: chunks.length,
        document_id: documentId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('RAG ingestion error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function chunkDocument(content: string, metadata: Record<string, any>): DocumentChunk[] {
  const chunks: DocumentChunk[] = []
  const chunkSize = 1000 // characters
  const overlap = 200 // character overlap between chunks

  for (let i = 0; i < content.length; i += chunkSize - overlap) {
    const chunk = content.slice(i, i + chunkSize)
    chunks.push({
      content: chunk,
      metadata: {
        ...metadata,
        chunk_index: Math.floor(i / (chunkSize - overlap)),
        start_char: i,
        end_char: Math.min(i + chunkSize, content.length)
      }
    })
  }

  return chunks
}

async function generateEmbedding(text: string): Promise<number[]> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002',
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}