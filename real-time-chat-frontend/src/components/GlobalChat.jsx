import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export default function GlobalChat({ username, message, messageList, typingStatus, handleTyping, handleSend }) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <h3 className="font-semibold text-lg">🌍 Global Chat</h3>
        <ScrollArea className="h-48 border rounded p-2 space-y-1 bg-gray-50">
          {messageList.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm p-2 rounded shadow-sm ${
                msg.sender === username ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              <strong>{msg.sender}</strong> <span className="text-xs text-gray-400">({msg.timestamp})</span>: {msg.message}
            </div>
          ))}
          {typingStatus && <em className="text-gray-500">{typingStatus}</em>}
        </ScrollArea>
        <div className="flex gap-2">
          <Input value={message} onChange={handleTyping} placeholder="Type a message..." className="flex-grow" />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
