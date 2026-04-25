import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={
            isOwn
              ? { backgroundColor: '#C5A55A', color: 'white', borderBottomRightRadius: '4px' }
              : { backgroundColor: 'white', color: '#1A1A1A', border: '1px solid #E5E1D8', borderBottomLeftRadius: '4px' }
          }
        >
          {message.text}
        </div>
        <span className="text-xs px-1" style={{ color: '#9CA3AF' }}>{time}</span>
      </div>
    </div>
  );
}
