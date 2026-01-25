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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { COLOR_PALETTE, type ColorName } from "@/lib/types/account";
import { COLOR_HEX } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface TypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: string, color: string) => void;
  title: string;
  description?: string;
  placeholder?: string;
  initialLabel?: string;
  initialColor?: string;
}

export function TypeDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description = "Choose a name and color for the new type.",
  placeholder = "Enter name...",
  initialLabel,
  initialColor,
}: TypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
}

function TypeForm({
  initialLabel,
  initialColor,
  placeholder,
  onSubmit,
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="type-label">Name</Label>
          <Input
            id="type-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>

        <div className="grid gap-3">
          <Label>Color</Label>
          <RadioGroup
            value={color}
            onValueChange={(v) => setColor(v as ColorName)}
            className="grid grid-cols-9 gap-1.5"
          >
            {COLOR_PALETTE.map((c) => (
              <div key={c} className="flex items-center justify-center">
                <RadioGroupItem
                  value={c}
                  id={`color-${c}`}
                  className={cn(
                    "size-6 rounded-full border-0",
                    "data-[state=checked]:ring-2 data-[state=checked]:ring-offset-2 data-[state=checked]:ring-foreground",
                    "[&_[data-slot=radio-group-indicator]]:hidden"
                  )}
                  style={{ backgroundColor: COLOR_HEX[c] }}
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!label.trim()}>
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </form>
  );
}
