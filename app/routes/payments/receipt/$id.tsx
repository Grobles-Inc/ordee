import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments/receipt/$id")({
  component: PaymentReceiptPage,
});

function PaymentReceiptPage() {
  const { id } = Route.useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payment Receipt</h1>
      <p className="text-muted-foreground">Payment ID: {id}</p>
    </div>
  );
}
