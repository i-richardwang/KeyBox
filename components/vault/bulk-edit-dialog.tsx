"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { TypeSelector } from "./type-selector";
import { useVaultStore } from "@/lib/store";

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { type?: string; provider?: string }) => void;
  count: number;
  mode: "login" | "api-key";
}

export function BulkEditDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  mode,
}: BulkEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>
            Edit {count} {count === 1 ? (mode === "login" ? "account" : "API key") : (mode === "login" ? "accounts" : "API keys")}
          </DialogTitle>
          <DialogDescription>
            Change the {mode === "login" ? "type" : "provider"} for the selected items.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <BulkEditForm
            key={`${mode}-${count}`}
            mode={mode}
            onSubmit={(data) => {
              onConfirm(data);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface BulkEditFormProps {
  mode: "login" | "api-key";
  onSubmit: (data: { type?: string; provider?: string }) => void;
}

function BulkEditForm({ mode, onSubmit }: BulkEditFormProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const loginTypes = useVaultStore((state) => state.loginTypes);
  const apiProviders = useVaultStore((state) => state.apiProviders);
  const addLoginType = useVaultStore((state) => state.addLoginType);
  const addApiProvider = useVaultStore((state) => state.addApiProvider);

  const types = mode === "login" ? loginTypes : apiProviders;
  const onAddType = mode === "login" ? addLoginType : addApiProvider;
  const fieldLabel = mode === "login" ? "Type" : "Provider";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedValue) return;
    if (mode === "login") {
      onSubmit({ type: selectedValue });
    } else {
      onSubmit({ provider: selectedValue });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel>{fieldLabel}</FieldLabel>
        <TypeSelector
          value={selectedValue}
          onChange={setSelectedValue}
          types={types}
          onAddType={onAddType}
          placeholder={`Select ${fieldLabel.toLowerCase()}...`}
          addDialogTitle={`Add ${fieldLabel}`}
          addDialogPlaceholder={`${fieldLabel} name`}
        />
      </Field>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!selectedValue}>
          Apply
        </Button>
      </DialogFooter>
    </form>
  );
}
