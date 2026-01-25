"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./color-picker";
import type { ColorName } from "@/lib/types/account";

interface EditTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (label: string, color: string) => void;
  title: string;
  initialLabel: string;
  initialColor: string;
}

/**
 * Dialog for editing a custom type (login type or API provider)
 * Uses key-based reset pattern to reinitialize form when props change
 */
export function EditTypeDialog({
  open,
  onOpenChange,
  onSave,
  title,
  initialLabel,
  initialColor,
}: EditTypeDialogProps) {
  // Use a key to force re-render when initialLabel changes
  // This avoids the need for useEffect with setState
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open && (
          <EditTypeForm
            key={initialLabel}
            initialLabel={initialLabel}
            initialColor={initialColor}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EditTypeFormProps {
  initialLabel: string;
  initialColor: string;
  onSave: (label: string, color: string) => void;
  onCancel: () => void;
}

function EditTypeForm({ initialLabel, initialColor, onSave, onCancel }: EditTypeFormProps) {
  const [label, setLabel] = useState(initialLabel);
  const [color, setColor] = useState<ColorName>(initialColor as ColorName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onSave(label.trim(), color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-type-label">Name</Label>
        <Input
          id="edit-type-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!label.trim()}>
          Save
        </Button>
      </div>
    </form>
  );
}
