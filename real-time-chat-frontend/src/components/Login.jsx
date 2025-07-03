import { Input } from '@/components/ui/input';

export default function Login({ setUsername }) {
  return (
    <div className="max-w-sm mx-auto text-center">
      <h1 className="text-xl font-semibold mb-4">Enter your name to start chatting</h1>
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value.trim())}
      />
    </div>
  );
}
