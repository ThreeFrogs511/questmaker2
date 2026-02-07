import { Card, Button } from 'pixel-retroui';

export default function ConfirmDeletePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card
        bg="#000000"
        textColor="#ffffff"
        borderColor="#ffffff"
        className="w-full max-w-md border border-white p-6"
      >
        <h1 className="text-2xl font-bold mb-2">Confirm deletion</h1>
        <p className="text-sm mb-6">This action cannot be undone.</p>

        <div className="border border-white p-4 mb-6 space-y-3">
          <p className="text-sm">
            You are about to permanently delete your account. All your data will be lost.
          </p>
          <div>
            <span className="text-sm font-bold">Account: </span>
            <span className="text-sm">nicolas@example.com</span>
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
            Delete permanently
          </Button>
        </div>
      </Card>
    </div>
  );
}