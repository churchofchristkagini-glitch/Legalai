import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, maxResults = 10 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Try multiple search providers in order of preference
    let results: SearchResult[] = []

    // Try Tavily first (best for legal research)
    try {
      results = await searchWithTavily(query, maxResults)
    } catch (error) {
      console.log('Tavily search failed:', error.message)
    }

    // Fallback to SerpAPI if Tavily fails
    if (results.length === 0) {
      try {
        results = await searchWithSerpAPI(query, maxResults)
      } catch (error) {
        console.log('SerpAPI search failed:', error.message)
      }
    }

    // Fallback to Bing if both fail
    if (results.length === 0) {
      try {
        results = await searchWithBing(query, maxResults)
      } catch (error) {
        console.log('Bing search failed:', error.message)
      }
    }

    return new Response(
      JSON.stringify({ 
        results,
        query,
        total: results.length,
        sources_used: results.map(r => r.source)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function searchWithTavily(query: string, maxResults: number): Promise<SearchResult[]> {
  const apiKey = Deno.env.get('TAVILY_API_KEY')
  if (!apiKey) {
    throw new Error('Tavily API key not configured')
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: `${query} Nigerian law legal`,
      search_depth: 'advanced',
      include_domains: ['lawpavilion.com', 'lawnigeria.com', 'nigerianlawguru.com'],
      max_results: maxResults
    })
  })

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.statusText}`)
  }

  const data = await response.json()
  
  return data.results.map((result: any) => ({
    title: result.title,
    url: result.url,
    snippet: result.content,
    source: 'tavily'
  }))
}

async function searchWithSerpAPI(query: string, maxResults: number): Promise<SearchResult[]> {
  const apiKey = Deno.env.get('SERPAPI_KEY')
  if (!apiKey) {
    throw new Error('SerpAPI key not configured')
  }

  const params = new URLSearchParams({
    engine: 'google',
    q: `${query} Nigerian law legal`,
    api_key: apiKey,
    num: maxResults.toString(),
    gl: 'ng', // Nigeria
    hl: 'en'
  })

  const response = await fetch(`https://serpapi.com/search?${params}`)

  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.statusText}`)
  }

  const data = await response.json()
  
  return (data.organic_results || []).map((result: any) => ({
    title: result.title,
    url: result.link,
    snippet: result.snippet,
    source: 'serpapi'
  }))
}

async function searchWithBing(query: string, maxResults: number): Promise<SearchResult[]> {
  const apiKey = Deno.env.get('BING_SEARCH_API_KEY')
  if (!apiKey) {
    throw new Error('Bing Search API key not configured')
  }

  const params = new URLSearchParams({
    q: `${query} Nigerian law legal`,
    count: maxResults.toString(),
    mkt: 'en-NG',
    safeSearch: 'Moderate'
  })

  const response = await fetch(`https://api.bing.microsoft.com/v7.0/search?${params}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey
    }
  })

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.statusText}`)
  }

  const data = await response.json()
  
  return (data.webPages?.value || []).map((result: any) => ({
    title: result.name,
    url: result.url,
    snippet: result.snippet,
    source: 'bing'
  }))
}