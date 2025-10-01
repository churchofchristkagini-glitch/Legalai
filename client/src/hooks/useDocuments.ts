```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt';
  file_url: string;
  file_size: number | null;
  content: string | null;
  metadata: any;
  uploaded_by: string;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error fetching documents',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setDocuments(data || []);
    setLoading(false);
  }, [user, toast]);

  const uploadDocument = useCallback(async (
    title: string,
    documentType: 'pdf' | 'docx' | 'txt',
    textContent: string,
    file?: File | null
  ) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to upload documents.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // 1. Insert document metadata into the 'documents' table
      const { data: newDocument, error: insertError } = await supabase
        .from('documents')
        .insert({
          title,
          type: documentType,
          file_url: file ? `supabase-storage-placeholder/${file.name}` : 'text-input', // Placeholder for now
          file_size: file ? file.size : textContent.length,
          uploaded_by: user.id,
          is_public: false, // Default to private
          tags: [],
          metadata: {
            original_filename: file?.name,
            mime_type: file?.type,
          },
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Call the RAG ingestion Edge Function
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rag-ingestion`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const ingestionResponse = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          documentId: newDocument.id,
          content: textContent,
          metadata: {
            title: newDocument.title,
            type: newDocument.type,
            uploaded_by: newDocument.uploaded_by,
          },
        }),
      });

      if (!ingestionResponse.ok) {
        const errorData = await ingestionResponse.json();
        throw new Error(errorData.error || 'Failed to ingest document via Edge Function');
      }

      toast({
        title: 'Document uploaded and processed',
        description: `${title} has been successfully added to your knowledge base.`,
      });

      // Refresh documents list
      await fetchDocuments();
      return true;

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Document upload failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  }, [user, toast, fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    uploading,
    fetchDocuments,
    uploadDocument,
  };
}
```