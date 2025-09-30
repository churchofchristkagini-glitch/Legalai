/*
  # Add Document Chunks Table for RAG Pipeline

  1. New Table
    - `document_chunks` - Stores chunked document content with embeddings for vector search

  2. Security
    - Enable RLS with appropriate policies
    - Index for vector similarity search

  3. Features
    - Vector embeddings for semantic search
    - Chunk metadata for context
    - Relationship to parent documents
*/

-- Create document_chunks table for RAG pipeline
CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  embedding vector(1536),
  chunk_index integer,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_document_chunks_chunk_index ON document_chunks(document_id, chunk_index);

-- Enable Row Level Security
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_chunks table
CREATE POLICY "Users can read chunks of public documents"
  ON document_chunks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE id = document_chunks.document_id 
      AND is_public = true
    )
  );

CREATE POLICY "Users can read chunks of own documents"
  ON document_chunks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE id = document_chunks.document_id 
      AND uploaded_by = auth.uid()
    )
  );

CREATE POLICY "System can insert document chunks"
  ON document_chunks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE id = document_chunks.document_id 
      AND (uploaded_by = auth.uid() OR EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

CREATE POLICY "Admins can manage all document chunks"
  ON document_chunks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function for similarity search
CREATE OR REPLACE FUNCTION search_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.78,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;