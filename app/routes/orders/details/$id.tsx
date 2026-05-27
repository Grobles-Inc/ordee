import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orders/details/$id")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { id } = Route.useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p className="text-muted-foreground">Order ID: {id}</p>
    </div>
  );
}
