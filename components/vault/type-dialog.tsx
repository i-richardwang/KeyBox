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

interface TypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string, color: string) => void;
  title: string;
  placeholder?: string;
  initialLabel?: string;
  initialColor?: string;
}

export function TypeDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  placeholder = "Enter name...",
  initialLabel,
  initialColor,
}: TypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open && (
          <TypeForm
            key={initialLabel ?? "new"}
            initialLabel={initialLabel ?? ""}
            initialColor={initialColor ?? "blue"}
            placeholder={placeholder}
            onSubmit={(label, color) => {
              onSubmit(label, color);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface TypeFormProps {
  initialLabel: string;
  initialColor: string;
  placeholder: string;
  onSubmit: (label: string, color: string) => void;
  onCancel: () => void;
}

function TypeForm({
  initialLabel,
  initialColor,
  placeholder,
  onSubmit,
  onCancel,
}: TypeFormProps) {
  const [label, setLabel] = useState(initialLabel);
  const [color, setColor] = useState<ColorName>(initialColor as ColorName);

  const isEdit = initialLabel !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onSubmit(label.trim(), color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type-label">Name</Label>
        <Input
          id="type-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={placeholder}
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
          {isEdit ? "Save" : "Add"}
        </Button>
      </div>
    </form>
  );
}
