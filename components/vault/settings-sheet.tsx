"use client";

import { useState } from "react";
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
import type { CustomLoginType, CustomApiProvider } from "@/lib/types/account";
import { PRESET_LOGIN_TYPES, PRESET_API_PROVIDERS } from "@/lib/types/account";
import { TypeDialog } from "./type-dialog";
import { DeleteDialog } from "./delete-dialog";

interface TypeItemProps {
  type: string;
  isPreset: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TypeItem({ type, isPreset, onEdit, onDelete }: TypeItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <TypeBadge type={type} />
      {!isPreset && (
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
      )}
    </div>
  );
}

export function SettingsSheet() {
  const {
    customLoginTypes,
    customApiProviders,
    addLoginType,
    updateLoginType,
    deleteLoginType,
    addApiProvider,
    updateApiProvider,
    deleteApiProvider,
  } = useVaultStore();

  const [addLoginDialogOpen, setAddLoginDialogOpen] = useState(false);
  const [addApiDialogOpen, setAddApiDialogOpen] = useState(false);
  const [editingLoginType, setEditingLoginType] = useState<CustomLoginType | null>(null);
  const [editingApiProvider, setEditingApiProvider] = useState<CustomApiProvider | null>(null);
  const [deletingLoginType, setDeletingLoginType] = useState<CustomLoginType | null>(null);
  const [deletingApiProvider, setDeletingApiProvider] = useState<CustomApiProvider | null>(null);

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
              Manage custom login types and API providers
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
                {PRESET_LOGIN_TYPES.map((type) => (
                  <TypeItem key={type} type={type} isPreset />
                ))}

                {customLoginTypes.map((type) => (
                  <TypeItem
                    key={type.id}
                    type={type.id}
                    isPreset={false}
                    onEdit={() => setEditingLoginType(type)}
                    onDelete={() => setDeletingLoginType(type)}
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
                {PRESET_API_PROVIDERS.map((provider) => (
                  <TypeItem key={provider} type={provider} isPreset />
                ))}

                {customApiProviders.map((provider) => (
                  <TypeItem
                    key={provider.id}
                    type={provider.id}
                    isPreset={false}
                    onEdit={() => setEditingApiProvider(provider)}
                    onDelete={() => setDeletingApiProvider(provider)}
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
        onSubmit={addLoginType}
        title="Add Login Type"
        placeholder="e.g., iCloud, GitHub"
      />

      <TypeDialog
        open={addApiDialogOpen}
        onOpenChange={setAddApiDialogOpen}
        onSubmit={addApiProvider}
        title="Add API Provider"
        placeholder="e.g., GitHub, Stripe"
      />

      <TypeDialog
        open={!!editingLoginType}
        onOpenChange={(open) => !open && setEditingLoginType(null)}
        onSubmit={(label, color) => {
          if (editingLoginType) {
            updateLoginType(editingLoginType.id, { label, color });
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
        onSubmit={(label, color) => {
          if (editingApiProvider) {
            updateApiProvider(editingApiProvider.id, { label, color });
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
        onConfirm={() => {
          if (deletingLoginType) {
            deleteLoginType(deletingLoginType.id);
            setDeletingLoginType(null);
          }
        }}
        accountName={deletingLoginType?.label || ""}
      />

      <DeleteDialog
        open={!!deletingApiProvider}
        onOpenChange={(open) => !open && setDeletingApiProvider(null)}
        onConfirm={() => {
          if (deletingApiProvider) {
            deleteApiProvider(deletingApiProvider.id);
            setDeletingApiProvider(null);
          }
        }}
        accountName={deletingApiProvider?.label || ""}
      />
    </>
  );
}
