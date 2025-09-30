import { DocumentCard } from '../DocumentCard';

export default function DocumentCardExample() {
  return (
    <div className="p-4 max-w-md">
      <DocumentCard
        title="Constitution of Nigeria 1999"
        type="PDF"
        uploadDate="Jan 15, 2024"
        size="2.4 MB"
      />
    </div>
  );
}
