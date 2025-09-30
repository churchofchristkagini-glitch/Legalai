import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: Array<{
    caseName: string
    year: string
    court: string
    url?: string
  }>
  metadata?: any
  created_at: string
}

export interface ChatSession {
  id: string
  title: string | null
  created_at: string
  updated_at: string
}

export function useChat() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // Load chat sessions
  const loadSessions = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error loading sessions:', error)
      return
    }

    setSessions(data || [])
  }, [user])

  // Load messages for a session
  const loadMessages = useCallback(async (sessionId: string) => {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading messages:', error)
      setLoading(false)
      return
    }

    const formattedMessages: ChatMessage[] = (data || []).map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.message,
      sources: msg.sources || [],
      metadata: msg.metadata,
      created_at: msg.created_at
    }))

    setMessages(formattedMessages)
    setLoading(false)
  }, [user])

  // Create new chat session
  const createSession = useCallback(async (title?: string) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: title || null,
        metadata: {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating session:', error)
      return null
    }

    const newSession = data as ChatSession
    setSessions(prev => [newSession, ...prev])
    setCurrentSession(newSession)
    setMessages([])
    
    return newSession
  }, [user])

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !currentSession || sending) return

    setSending(true)

    try {
      // Add user message to database
      const { data: userMessage, error: userError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          message: content,
          role: 'user',
          sources: [],
          metadata: {}
        })
        .select()
        .single()

      if (userError) throw userError

      // Add user message to UI immediately
      const newUserMessage: ChatMessage = {
        id: userMessage.id,
        role: 'user',
        content: content,
        created_at: userMessage.created_at
      }
      setMessages(prev => [...prev, newUserMessage])

      // Update session title if it's the first message
      if (messages.length === 0) {
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content
        await supabase
          .from('chat_sessions')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', currentSession.id)
        
        setCurrentSession(prev => prev ? { ...prev, title } : null)
        setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, title } : s))
      }

      // Call AI service (mock for now)
      const aiResponse = await generateAIResponse(content)

      // Add AI response to database
      const { data: aiMessage, error: aiError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          message: aiResponse.content,
          role: 'assistant',
          sources: aiResponse.sources || [],
          metadata: aiResponse.metadata || {}
        })
        .select()
        .single()

      if (aiError) throw aiError

      // Add AI message to UI
      const newAIMessage: ChatMessage = {
        id: aiMessage.id,
        role: 'assistant',
        content: aiResponse.content,
        sources: aiResponse.sources,
        metadata: aiResponse.metadata,
        created_at: aiMessage.created_at
      }
      setMessages(prev => [...prev, newAIMessage])

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }, [user, currentSession, sending, messages.length])

  // Switch to a different session
  const switchSession = useCallback(async (session: ChatSession) => {
    setCurrentSession(session)
    await loadMessages(session.id)
  }, [loadMessages])

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting session:', error)
      return
    }

    setSessions(prev => prev.filter(s => s.id !== sessionId))
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null)
      setMessages([])
    }
  }, [user, currentSession])

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user, loadSessions])

  return {
    sessions,
    currentSession,
    messages,
    loading,
    sending,
    createSession,
    switchSession,
    deleteSession,
    sendMessage,
    loadSessions
  }
}

// Mock AI response generator (replace with actual OpenAI integration)
async function generateAIResponse(userMessage: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  const responses = [
    {
      content: "I understand your question about Nigerian law. Based on the legal precedents and statutes in our database, here's what I found...",
      sources: [
        {
          caseName: "FRN v. Osahon",
          year: "2006",
          court: "Supreme Court"
        }
      ]
    },
    {
      content: "This is an interesting legal question. Let me search through the relevant Nigerian cases and statutes to provide you with accurate information...",
      sources: [
        {
          caseName: "Adeyemi v. Lan & Baker (Nig) Ltd",
          year: "2008",
          court: "Supreme Court"
        },
        {
          caseName: "Registered Trustees of APC v. INEC",
          year: "2020",
          court: "Court of Appeal"
        }
      ]
    }
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}