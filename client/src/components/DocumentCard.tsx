import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MoreVertical, Download, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  title: string;
  type: string;
  uploadDate: string;
  size: string;
}

export function DocumentCard({ title, type, uploadDate, size }: DocumentCardProps) {
  return (
    <Card className="p-4 hover-elevate transition-all" data-testid={`card-document-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground">
            {type} • {uploadDate} • {size}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-document-menu">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem data-testid="menu-download">
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-share">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
