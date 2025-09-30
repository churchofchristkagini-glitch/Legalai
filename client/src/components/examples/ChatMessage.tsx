import { ChatMessage } from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="p-4 space-y-4 max-w-4xl">
      <ChatMessage
        role="user"
        content="What are the key principles from Donoghue v Stevenson as applied in Nigerian law?"
      />
      <ChatMessage
        role="assistant"
        content="The principles from Donoghue v Stevenson regarding negligence and duty of care have been widely adopted in Nigerian jurisprudence. The Nigerian Supreme Court has applied these principles in several landmark cases..."
        citations={[
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
        ]}
      />
    </div>
  );
}
