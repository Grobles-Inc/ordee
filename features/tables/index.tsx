import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { TableGrid } from "./components/table-grid";
import { TableStats } from "./components/table-stats";
import { TableFormDialog } from "./components/table-form-dialog";
import { DeleteTableDialog } from "./components/delete-table-dialog";
import { useTablesStore } from "./stores/tables";
import {
  useTablesWithCurrentOrder,
  useCreateTable,
  useUpdateTable,
  useUpdateTableStatus,
  useDisableTable,
  useEnableTable,
  useDeleteTable,
} from "./api/queries";
import { useAuth } from "~/hooks/use-auth";
import { getTableStats } from "./api/services";
import type { TableFormValues } from "./api/schemas";
import type { Table, TableWithOrderInfo } from "./api/types";
import { useState } from "react";

export function TablesFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const {
    selectedTableId,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    tableToDelete,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = useTablesStore();

  const [tableToEdit, setTableToEdit] = useState<TableWithOrderInfo | null>(
    null
  );

  const { data: tables = [], isLoading } = useTablesWithCurrentOrder(
    tenantId ?? ""
  );

  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const updateStatus = useUpdateTableStatus();
  const disableTable = useDisableTable();
  const enableTable = useEnableTable();
  const deleteTable = useDeleteTable();

  const stats = getTableStats(tables);
  const existingNumbers = tables.map((t) => t.number);

  function handleAdd(data: TableFormValues) {
    if (!tenantId) return;

    createTable.mutate(
      {
        number: data.number,
        idTenant: tenantId,
      },
      {
        onSuccess: () => closeAddDialog(),
      }
    );
  }

  function handleEdit(data: TableFormValues) {
    if (!selectedTableId) return;

    updateTable.mutate(
      { id: selectedTableId, data: { number: data.number } },
      {
        onSuccess: () => {
          closeEditDialog();
          setTableToEdit(null);
        },
      }
    );
  }

  function handleToggleStatus(table: TableWithOrderInfo) {
    updateStatus.mutate({ id: table.id, status: !table.status });
  }

  function handleDisable(table: TableWithOrderInfo) {
    disableTable.mutate(table.id);
  }

  function handleEnable(table: TableWithOrderInfo) {
    enableTable.mutate(table.id);
  }

  function handleDelete() {
    if (!tableToDelete) return;
    deleteTable.mutate(tableToDelete, {
      onSuccess: () => closeDeleteDialog(),
    });
  }

  function handleOpenEdit(table: TableWithOrderInfo) {
    setTableToEdit(table);
    openEditDialog(table.id);
  }

  const tableForDelete = tables.find((t) => t.id === tableToDelete);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tables</h1>
          <p className="text-muted-foreground">
            Manage your restaurant tables
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      <TableStats {...stats} />

      <TableGrid
        tables={tables}
        onEdit={handleOpenEdit}
        onDelete={(table) => openDeleteDialog(table.id)}
        onToggleStatus={handleToggleStatus}
        onDisable={handleDisable}
        onEnable={handleEnable}
        isLoading={isLoading}
      />

      <TableFormDialog
        open={isAddDialogOpen}
        onOpenChange={closeAddDialog}
        onSubmit={handleAdd}
        existingNumbers={existingNumbers}
        isLoading={createTable.isPending}
      />

      <TableFormDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
            setTableToEdit(null);
          }
        }}
        onSubmit={handleEdit}
        table={tableToEdit}
        isLoading={updateTable.isPending}
      />

      <DeleteTableDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        table={tableForDelete ?? null}
        onConfirm={handleDelete}
        isLoading={deleteTable.isPending}
        isOccupied={tableForDelete?.status ?? false}
      />
    </div>
  );
}

export { TableCard } from "./components/table-card";
export { TableGrid } from "./components/table-grid";
export { TableStats } from "./components/table-stats";
export { TableFormDialog } from "./components/table-form-dialog";
export { DeleteTableDialog } from "./components/delete-table-dialog";
export { useTablesStore } from "./stores/tables";
export * from "./api/queries";
export * from "./api/types";
export * from "./api/schemas";
