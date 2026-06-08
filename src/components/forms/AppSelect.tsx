import * as React from 'react';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export interface AppSelectOption {
  value: string;
  label: string;
}

export interface AppSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  id?: string;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Selecione...',
  icon,
  className = 'w-full',
  triggerClassName = '',
  contentClassName = '',
  disabled = false,
  id,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const triggerLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={className} id={id}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-between py-2.5 border rounded-xl bg-[var(--ios-card)] text-[var(--ios-text)] text-sm font-normal shadow-sm h-auto hover:bg-[var(--ios-card)] hover:text-[var(--ios-text)] relative active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              open ? 'border-[var(--ios-blue)] ring-1 ring-[var(--ios-blue)]/20' : 'border-[var(--ios-separator)]'
            } ${
              icon ? 'pl-10 pr-4' : 'px-3'
            } ${triggerClassName}`}
          >
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ios-text-tertiary)]">
                {icon}
              </div>
            )}
            <span className="truncate pr-2">{triggerLabel}</span>
            <ChevronDown className={`h-4 w-4 text-[var(--ios-text-tertiary)] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-[var(--ios-blue)]' : ''}`} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className={`w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto bg-[var(--ios-sheet-bg)] border border-[var(--ios-separator)] text-[var(--ios-text)] rounded-xl p-1 shadow-lg z-[200] ${contentClassName}`}
        >
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center justify-between pl-3 pr-3 py-2.5 rounded-lg text-sm text-[var(--ios-text)] focus:bg-[var(--ios-fill)] focus:text-[var(--ios-text)] cursor-pointer [&>span.absolute]:hidden gap-2"
                >
                  <span className="truncate">{opt.label}</span>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-[var(--ios-blue)] bg-[var(--ios-blue)] text-white'
                        : 'border-[var(--ios-separator)] bg-transparent'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </div>
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
