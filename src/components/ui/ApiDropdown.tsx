"use client";
import React, { useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

interface ApiDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  data: any[];
  isLoading: boolean;
  getLabel?: (item: any) => string;
  getValue?: (item: any) => string;
  className?:string;
}

export const ApiDropdown: React.FC<ApiDropdownProps> = ({
  label,
  placeholder = "Select...",
  value,
  onChange,
  data,
  isLoading,
  getLabel = (item) => item.name,
  getValue = (item) => item._id,
  classsName=""
}) => {
  const [open, setOpen] = React.useState(false);

  const options = data;
  const loading = isLoading;

  const selectedItem = useMemo(
    () => options.find((o) => getValue(o) === value),
    [options, value, getValue]
  );

  const displayLabel = useMemo(() => {
    if (loading)
      return (
        <span className="flex items-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </span>
      );
    if (selectedItem) return getLabel(selectedItem);
    return placeholder;
  }, [loading, selectedItem, getLabel, placeholder]);

  const isDisabled = loading || !options.length;

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
            disabled={isDisabled}
          >
            {displayLabel}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border border-input rounded-md shadow-md">
          <Command>
            <CommandInput placeholder={`Search ${label || "items"}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {options.map((item) => {
                const itemValue = getValue(item);
                return (
                  <CommandItem
                    key={itemValue}
                    value={getLabel(item)}
                    onSelect={() => {
                      onChange(itemValue);
                      setOpen(false);
                    }}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === itemValue ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {getLabel(item)}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
