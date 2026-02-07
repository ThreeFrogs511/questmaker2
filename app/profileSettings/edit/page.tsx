import { Card, Button } from 'pixel-retroui';

export default function ConfirmEditPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card
        bg="#000000"
        textColor="#ffffff"
        borderColor="#ffffff"
        className="w-full max-w-md border border-white p-6"
      >
        <h1 className="text-2xl font-bold mb-2">Confirm changes</h1>
        <p className="text-sm mb-6">Review your modifications before saving.</p>

        <div className="border border-white p-4 mb-6 space-y-2">
          <div>
            <span className="text-sm">Email: nicolas@example.com</span>
          </div>
          <div>
            <span className="text-sm">Password: ••••••••</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            bg="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            bg="#000000"
            textColor="#ffffff"
            borderColor="#ffffff"
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
}