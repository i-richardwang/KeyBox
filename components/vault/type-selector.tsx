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
import type { CustomType } from "@/lib/types/account";
import { TypeDialog } from "./type-dialog";

interface TypeOption {
  value: string;
  label: string;
  color: string;
}

interface TypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  presets: TypeOption[];
  customTypes: CustomType[];
  onAddCustomType: (label: string, color: string) => CustomType;
  placeholder?: string;
  disabled?: boolean;
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
  presets,
  customTypes,
  onAddCustomType,
  placeholder = "Select type...",
  disabled = false,
  addDialogTitle,
  addDialogPlaceholder,
}: TypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Combine presets and custom types
  const allOptions: TypeOption[] = [
    ...presets,
    ...customTypes.map((ct) => ({
      value: ct.id,
      label: ct.label,
      color: ct.color,
    })),
  ];

  const selectedOption = allOptions.find((opt) => opt.value === value);

  const handleAddCustomType = (label: string, color: string) => {
    const newType = onAddCustomType(label, color);
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
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <ColorDot color={selectedOption.color} />
                {selectedOption.label}
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

              <CommandGroup heading="Presets">
                {presets.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={value === option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <ColorDot color={option.color} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              {customTypes.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Custom">
                    {customTypes.map((ct) => (
                      <CommandItem
                        key={ct.id}
                        value={ct.label}
                        data-checked={value === ct.id}
                        onSelect={() => {
                          onChange(ct.id);
                          setOpen(false);
                        }}
                      >
                        <ColorDot color={ct.color} />
                        {ct.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

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
        onSubmit={handleAddCustomType}
        title={addDialogTitle}
        placeholder={addDialogPlaceholder}
      />
    </>
  );
}
