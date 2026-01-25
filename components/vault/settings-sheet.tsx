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
import { getBadgeClass } from "@/lib/colors";
import { useCustomTypes } from "@/context/custom-types-context";
import type { CustomLoginType, CustomApiProvider, PresetLoginType, PresetApiProvider } from "@/lib/types/account";
import {
  PRESET_LOGIN_TYPES,
  PRESET_API_PROVIDERS,
  LOGIN_TYPE_LABELS,
  API_PROVIDER_LABELS,
  LOGIN_TYPE_COLORS,
  API_PROVIDER_COLORS,
} from "@/lib/types/account";
import { AddTypeDialog } from "./add-type-dialog";
import { EditTypeDialog } from "./edit-type-dialog";
import { DeleteDialog } from "./delete-dialog";

interface TypeItemProps {
  label: string;
  color: string;
  isPreset: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function TypeItem({ label, color, isPreset, onEdit, onDelete }: TypeItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getBadgeClass(color)}`}>
        {label}
      </span>
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
    loginTypes,
    apiProviders,
    addLoginType,
    updateLoginType,
    deleteLoginType,
    addApiProvider,
    updateApiProvider,
    deleteApiProvider,
  } = useCustomTypes();

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
            {/* Login Types Section */}
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
                  <TypeItem
                    key={type}
                    label={LOGIN_TYPE_LABELS[type as PresetLoginType]}
                    color={LOGIN_TYPE_COLORS[type as PresetLoginType]}
                    isPreset
                  />
                ))}

                {loginTypes.map((type) => (
                  <TypeItem
                    key={type.id}
                    label={type.label}
                    color={type.color}
                    isPreset={false}
                    onEdit={() => setEditingLoginType(type)}
                    onDelete={() => setDeletingLoginType(type)}
                  />
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* API Providers Section */}
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
                  <TypeItem
                    key={provider}
                    label={API_PROVIDER_LABELS[provider as PresetApiProvider]}
                    color={API_PROVIDER_COLORS[provider as PresetApiProvider]}
                    isPreset
                  />
                ))}

                {apiProviders.map((provider) => (
                  <TypeItem
                    key={provider.id}
                    label={provider.label}
                    color={provider.color}
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

      <AddTypeDialog
        open={addLoginDialogOpen}
        onOpenChange={setAddLoginDialogOpen}
        onAdd={addLoginType}
        title="Add Login Type"
        placeholder="e.g., iCloud, GitHub"
      />

      <AddTypeDialog
        open={addApiDialogOpen}
        onOpenChange={setAddApiDialogOpen}
        onAdd={addApiProvider}
        title="Add API Provider"
        placeholder="e.g., GitHub, Stripe"
      />

      <EditTypeDialog
        open={!!editingLoginType}
        onOpenChange={(open) => !open && setEditingLoginType(null)}
        onSave={(label, color) => {
          if (editingLoginType) {
            updateLoginType(editingLoginType.id, { label, color });
            setEditingLoginType(null);
          }
        }}
        title="Edit Login Type"
        initialLabel={editingLoginType?.label || ""}
        initialColor={editingLoginType?.color || "blue"}
      />

      <EditTypeDialog
        open={!!editingApiProvider}
        onOpenChange={(open) => !open && setEditingApiProvider(null)}
        onSave={(label, color) => {
          if (editingApiProvider) {
            updateApiProvider(editingApiProvider.id, { label, color });
            setEditingApiProvider(null);
          }
        }}
        title="Edit API Provider"
        initialLabel={editingApiProvider?.label || ""}
        initialColor={editingApiProvider?.color || "blue"}
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
