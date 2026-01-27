"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { useVaultStore } from "@/lib/store";
import { TypeBadge } from "./type-badge";
import type { TypeDefinition } from "@/lib/types/account";
import { isEmailAccount, isApiKeyAccount } from "@/lib/types/account";
import { TypeDialog } from "./type-dialog";
import { DeleteDialog } from "./delete-dialog";

interface TypeItemProps {
  type: TypeDefinition;
  onEdit: () => void;
  onDelete: () => void;
}

function TypeItem({ type, onEdit, onDelete }: TypeItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <TypeBadge type={type.id} />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-xs" onClick={onEdit}>
          <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

export function SettingsSheet() {
  const {
    accounts,
    loginTypes,
    apiProviders,
    addLoginType,
    updateLoginType,
    deleteLoginType,
    addApiProvider,
    updateApiProvider,
    deleteApiProvider,
  } = useVaultStore();

  const [addLoginDialogOpen, setAddLoginDialogOpen] = useState(false);
  const [addApiDialogOpen, setAddApiDialogOpen] = useState(false);
  const [editingLoginType, setEditingLoginType] = useState<TypeDefinition | null>(null);
  const [editingApiProvider, setEditingApiProvider] = useState<TypeDefinition | null>(null);
  const [deletingLoginType, setDeletingLoginType] = useState<TypeDefinition | null>(null);
  const [deletingApiProvider, setDeletingApiProvider] = useState<TypeDefinition | null>(null);

  const getLoginTypeUsageCount = (typeId: string): number => {
    return accounts.filter((acc) => isEmailAccount(acc) && acc.type === typeId).length;
  };

  const getApiProviderUsageCount = (providerId: string): number => {
    return accounts.filter((acc) => isApiKeyAccount(acc) && acc.provider === providerId).length;
  };

  const handleDeleteLoginType = (type: TypeDefinition) => {
    const usageCount = getLoginTypeUsageCount(type.id);
    if (usageCount > 0) {
      toast.error("Cannot delete", {
        description: `"${type.label}" is used by ${usageCount} account${usageCount > 1 ? "s" : ""}`,
      });
      return;
    }
    setDeletingLoginType(type);
  };

  const handleDeleteApiProvider = (provider: TypeDefinition) => {
    const usageCount = getApiProviderUsageCount(provider.id);
    if (usageCount > 0) {
      toast.error("Cannot delete", {
        description: `"${provider.label}" is used by ${usageCount} account${usageCount > 1 ? "s" : ""}`,
      });
      return;
    }
    setDeletingApiProvider(provider);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
            <span className="sr-only">Settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Manage login types and API providers
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Login Types</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddLoginDialogOpen(true)}
                >
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                  Add
                </Button>
              </div>

              <div className="space-y-1">
                {loginTypes.map((type) => (
                  <TypeItem
                    key={type.id}
                    type={type}
                    onEdit={() => setEditingLoginType(type)}
                    onDelete={() => handleDeleteLoginType(type)}
                  />
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">API Providers</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddApiDialogOpen(true)}
                >
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                  Add
                </Button>
              </div>

              <div className="space-y-1">
                {apiProviders.map((provider) => (
                  <TypeItem
                    key={provider.id}
                    type={provider}
                    onEdit={() => setEditingApiProvider(provider)}
                    onDelete={() => handleDeleteApiProvider(provider)}
                  />
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <TypeDialog
        open={addLoginDialogOpen}
        onOpenChange={setAddLoginDialogOpen}
        onSubmit={async (label, color) => {
          await addLoginType(label, color);
        }}
        title="Add Login Type"
        placeholder="e.g., iCloud, GitHub"
      />

      <TypeDialog
        open={addApiDialogOpen}
        onOpenChange={setAddApiDialogOpen}
        onSubmit={async (label, color) => {
          await addApiProvider(label, color);
        }}
        title="Add API Provider"
        placeholder="e.g., GitHub, Stripe"
      />

      <TypeDialog
        open={!!editingLoginType}
        onOpenChange={(open) => !open && setEditingLoginType(null)}
        onSubmit={async (label, color) => {
          if (editingLoginType) {
            await updateLoginType(editingLoginType.id, { label, color });
            setEditingLoginType(null);
          }
        }}
        title="Edit Login Type"
        initialLabel={editingLoginType?.label}
        initialColor={editingLoginType?.color}
      />

      <TypeDialog
        open={!!editingApiProvider}
        onOpenChange={(open) => !open && setEditingApiProvider(null)}
        onSubmit={async (label, color) => {
          if (editingApiProvider) {
            await updateApiProvider(editingApiProvider.id, { label, color });
            setEditingApiProvider(null);
          }
        }}
        title="Edit API Provider"
        initialLabel={editingApiProvider?.label}
        initialColor={editingApiProvider?.color}
      />

      <DeleteDialog
        open={!!deletingLoginType}
        onOpenChange={(open) => !open && setDeletingLoginType(null)}
        onConfirm={async () => {
          if (deletingLoginType) {
            await deleteLoginType(deletingLoginType.id);
            setDeletingLoginType(null);
          }
        }}
        accountName={deletingLoginType?.label || ""}
      />

      <DeleteDialog
        open={!!deletingApiProvider}
        onOpenChange={(open) => !open && setDeletingApiProvider(null)}
        onConfirm={async () => {
          if (deletingApiProvider) {
            await deleteApiProvider(deletingApiProvider.id);
            setDeletingApiProvider(null);
          }
        }}
        accountName={deletingApiProvider?.label || ""}
      />
    </>
  );
}
