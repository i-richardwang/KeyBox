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

interface AddTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (label: string, color: string) => void;
  title: string;
  placeholder: string;
}

/**
 * Dialog for adding a new custom type (login type or API provider)
 */
export function AddTypeDialog({
  open,
  onOpenChange,
  onAdd,
  title,
  placeholder,
}: AddTypeDialogProps) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState<ColorName>("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onAdd(label.trim(), color);
      setLabel("");
      setColor("blue");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setLabel("");
      setColor("blue");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!label.trim()}>
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
