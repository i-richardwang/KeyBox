"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { getBadgeClass } from "@/lib/colors";
import type { TypeDefinition } from "@/lib/types/account";
import { TypeDialog } from "./type-dialog";

interface TypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  types: TypeDefinition[];
  onAddType: (label: string, color: string) => TypeDefinition;
  placeholder?: string;
  addDialogTitle: string;
  addDialogPlaceholder: string;
}

function ColorDot({ color }: { color: string }) {
  const badgeClass = getBadgeClass(color);
  const bgClass = badgeClass.split(" ")[0];
  return <span className={cn("w-3 h-3 rounded-full", bgClass)} />;
}

export function TypeSelector({
  value,
  onChange,
  types,
  onAddType,
  placeholder = "Select type...",
  addDialogTitle,
  addDialogPlaceholder,
}: TypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const selectedType = types.find((t) => t.id === value);

  const handleAddType = (label: string, color: string) => {
    const newType = onAddType(label, color);
    onChange(newType.id);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selectedType ? (
              <span className="flex items-center gap-2">
                <ColorDot color={selectedType.color} />
                {selectedType.label}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup>
                {types.map((type) => (
                  <CommandItem
                    key={type.id}
                    value={type.label}
                    data-checked={value === type.id}
                    onSelect={() => {
                      onChange(type.id);
                      setOpen(false);
                    }}
                  >
                    <ColorDot color={type.color} />
                    {type.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setAddDialogOpen(true);
                  }}
                  className="text-muted-foreground"
                >
                  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                  Add new...
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <TypeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddType}
        title={addDialogTitle}
        placeholder={addDialogPlaceholder}
      />
    </>
  );
}
