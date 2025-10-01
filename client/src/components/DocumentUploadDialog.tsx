import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader as Loader2, CloudUpload as UploadCloud } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentUploadDialog({ isOpen, onClose }: DocumentUploadDialogProps) {
  const { uploading, uploadDocument } = useDocuments();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [documentType, setDocumentType] = useState<'pdf' | 'docx' | 'txt'>('txt');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.')); // Pre-fill title from filename
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf' || fileExtension === 'docx' || fileExtension === 'txt') {
        setDocumentType(fileExtension as 'pdf' | 'docx' | 'txt');
      } else {
        setDocumentType('txt'); // Default to txt for unknown types
      }

      // Read file content if it's a text file
      if (selectedFile.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setTextContent(event.target?.result as string);
        };
        reader.readAsText(selectedFile);
      } else {
        setTextContent(''); // Clear text content for non-text files
      }
    } else {
      setFile(null);
      setTextContent('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || (!file && !textContent)) {
      // Handle validation error
      return;
    }

    const success = await uploadDocument(title, documentType, textContent, file);
    if (success) {
      setTitle('');
      setFile(null);
      setTextContent('');
      setDocumentType('txt');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Add a legal document to your knowledge base. Only text content will be processed for AI queries.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
              data-testid="input-document-title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentType" className="text-right">
              Type
            </Label>
            <Select value={documentType} onValueChange={(value: 'pdf' | 'docx' | 'txt') => setDocumentType(value)}>
              <SelectTrigger className="col-span-3" data-testid="select-document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
              data-testid="input-document-file"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="textContent" className="text-right pt-2">
              Text Content
            </Label>
            <Textarea
              id="textContent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste document text here, or upload a .txt file."
              className="col-span-3 min-h-[150px]"
              data-testid="textarea-document-content"
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-upload">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={uploading} data-testid="button-upload-document">
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}