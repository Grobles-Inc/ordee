import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { UserList } from "./components/user-list";
import { AddUserDialog } from "./components/add-user-dialog";
import { DeleteUserDialog } from "./components/delete-user-dialog";
import { useAccountsStore } from "./stores/accounts";
import { useUsersByTenant, useCreateAccount, useDisableAccount } from "./api/queries";
import { useAuth } from "~/hooks/use-auth";
import type { CreateUserFormValues } from "./api/schemas";
import type { Account } from "./api/types";

export function AccountsFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;
  const userId = profile?.id;

  const {
    isAddUserDialogOpen,
    isDeleteDialogOpen,
    accountToDelete,
    openAddUserDialog,
    closeAddUserDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = useAccountsStore();

  const { data: users = [], isLoading } = useUsersByTenant(
    tenantId ?? "",
    userId ?? ""
  );

  const createUser = useCreateAccount();
  const disableUser = useDisableAccount();

  function handleAddUser(data: CreateUserFormValues) {
    if (!tenantId) return;

    createUser.mutate(
      {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        idTenant: tenantId,
      },
      {
        onSuccess: () => closeAddUserDialog(),
      }
    );
  }

  function handleDeleteUser() {
    if (!accountToDelete) return;

    disableUser.mutate(accountToDelete, {
      onSuccess: () => closeDeleteDialog(),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button onClick={openAddUserDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserList
        users={users}
        onDelete={(user) => openDeleteDialog(user.id)}
        isLoading={isLoading}
      />

      <AddUserDialog
        open={isAddUserDialogOpen}
        onOpenChange={closeAddUserDialog}
        onSubmit={handleAddUser}
        isLoading={createUser.isPending}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={closeDeleteDialog}
        user={users.find((u) => u.id === accountToDelete) ?? null}
        onConfirm={handleDeleteUser}
        isLoading={disableUser.isPending}
      />
    </div>
  );
}

export { UserList } from "./components/user-list";
export { AddUserDialog } from "./components/add-user-dialog";
export { DeleteUserDialog } from "./components/delete-user-dialog";
export { useAccountsStore } from "./stores/accounts";
export * from "./api/queries";
export * from "./api/types";
export * from "./api/schemas";
