import { ChatInput } from '../ChatInput';

export default function ChatInputExample() {
  return (
    <div className="p-4 min-h-[200px] flex items-end">
      <ChatInput onSend={(msg) => console.log('Sending:', msg)} />
    </div>
  );
}
