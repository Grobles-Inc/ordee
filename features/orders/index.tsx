import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus, Search } from "lucide-react";
import { OrderList } from "./components/order-list";
import { OrderDetails } from "./components/order-details";
import { CreateOrderDialog } from "./components/create-order-dialog";
import { AddItemsDialog } from "./components/add-items-dialog";
import { DeleteOrderDialog } from "./components/delete-order-dialog";
import { useOrdersStore } from "./stores/orders";
import {
  useOrdersByTenant,
  useCreateOrder,
  useAddItemsToOrder,
  useUpdateOrderServed,
  useUpdateOrderPaid,
  useDeleteOrder,
} from "./api/queries";
import { useMealsByTenant } from "~/features/meals/api/queries";
import { useTablesByTenant } from "~/features/tables/api/queries";
import { useAuth } from "~/hooks/use-auth";
import { filterOrdersByStatus, filterOrdersBySearch } from "./api/services";
import type { OrderWithDetails } from "./api/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function OrdersFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;
  const userId = profile?.id;

  const {
    isCreateDialogOpen,
    isAddItemsDialogOpen,
    isDeleteDialogOpen,
    orderToDelete,
    statusFilter,
    searchQuery,
    openCreateDialog,
    closeCreateDialog,
    openAddItemsDialog,
    closeAddItemsDialog,
    openDeleteDialog,
    closeDeleteDialog,
    setStatusFilter,
    setSearchQuery,
    cart,
    clearCart,
  } = useOrdersStore();

  const [viewingOrder, setViewingOrder] = useState<OrderWithDetails | null>(
    null
  );

  const { data: orders = [], isLoading } = useOrdersByTenant(tenantId ?? "");
  const { data: meals = [] } = useMealsByTenant(tenantId ?? "");
  const { data: tables = [] } = useTablesByTenant(tenantId ?? "");

  const createOrder = useCreateOrder();
  const addItems = useAddItemsToOrder();
  const updateServed = useUpdateOrderServed();
  const updatePaid = useUpdateOrderPaid();
  const deleteOrder = useDeleteOrder();

  const filteredOrders = filterOrdersBySearch(
    filterOrdersByStatus(orders, statusFilter),
    searchQuery
  );

  function handleCreateOrder(idTable: string, toGo: boolean) {
    if (!userId || !tenantId) return;

    createOrder.mutate(
      {
        data: { idTable, items: cart, toGo },
        userId,
        tenantId,
      },
      {
        onSuccess: () => closeCreateDialog(),
      }
    );
  }

  function handleAddItems() {
    if (!viewingOrder) return;

    addItems.mutate(
      {
        orderId: viewingOrder.id,
        items: cart.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          closeAddItemsDialog();
          clearCart();
        },
      }
    );
  }

  function handleToggleServed(order: OrderWithDetails) {
    updateServed.mutate({ id: order.id, served: !order.served });
  }

  function handleTogglePaid(order: OrderWithDetails) {
    updatePaid.mutate({ id: order.id, paid: !order.paid });
  }

  function handleDelete() {
    if (!orderToDelete) return;
    deleteOrder.mutate(orderToDelete, {
      onSuccess: () => closeDeleteDialog(),
    });
  }

  function handleOpenAddItems(order: OrderWithDetails) {
    setViewingOrder(order);
    openAddItemsDialog(order.id);
  }

  const orderForDelete = orders.find((o) => o.id === orderToDelete);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage restaurant orders
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="served">Served</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrderList
        orders={filteredOrders}
        onView={setViewingOrder}
        onMarkServed={handleToggleServed}
        onMarkPaid={handleTogglePaid}
        onAddItems={handleOpenAddItems}
        onDelete={(order) => openDeleteDialog(order.id)}
        isLoading={isLoading}
      />

      <CreateOrderDialog
        open={isCreateDialogOpen}
        onOpenChange={closeCreateDialog}
        onSubmit={handleCreateOrder}
        meals={meals}
        tables={tables}
        isLoading={createOrder.isPending}
      />

      <AddItemsDialog
        open={isAddItemsDialogOpen}
        onOpenChange={closeAddItemsDialog}
        onSubmit={handleAddItems}
        meals={meals}
        isLoading={addItems.isPending}
      />

      <DeleteOrderDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        order={orderForDelete ?? null}
        onConfirm={handleDelete}
        isLoading={deleteOrder.isPending}
      />

      <Dialog
        open={!!viewingOrder && !isAddItemsDialogOpen}
        onOpenChange={(open) => {
          if (!open) setViewingOrder(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {viewingOrder && <OrderDetails order={viewingOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { OrderCard } from "./components/order-card";
export { OrderList } from "./components/order-list";
export { OrderDetails } from "./components/order-details";
export { CartSummary } from "./components/cart-summary";
export { MealSelector } from "./components/meal-selector";
export { CreateOrderDialog } from "./components/create-order-dialog";
export { AddItemsDialog } from "./components/add-items-dialog";
export { DeleteOrderDialog } from "./components/delete-order-dialog";
export { useOrdersStore } from "./stores/orders";
export * from "./api/queries";
export * from "./api/types";
export * from "./api/schemas";
