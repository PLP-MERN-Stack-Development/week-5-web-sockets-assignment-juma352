import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivateChat({
  username,
  onlineUsers,
  recipient,
  setRecipient,
  message,
  handleTyping,
  sendPrivateMessage,
  privateMessages,
}) {
  const recipients = onlineUsers.filter((user) => user !== username);

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <h3 className="font-semibold text-lg">🔐 Private Chat</h3>

        <select
          className="w-full border rounded px-2 py-1 mb-4"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        >
          <option value="">-- Select Recipient --</option>
          {recipients.map((user, idx) => (
            <option key={idx} value={user}>
              {user}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <Input value={message} onChange={handleTyping} placeholder="Type private message..." className="flex-grow" />
          <Button onClick={sendPrivateMessage}>Send</Button>
        </div>

        <ScrollArea className="h-48 border rounded p-2 text-sm bg-gray-50">
          {privateMessages.map((pm, idx) => (
            <div key={idx} className="mb-1">
              [{pm.timestamp}] <strong>{pm.sender}</strong>: {pm.message}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
