"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ru } from "date-fns/locale";
import { format, parse, isValid, Locale } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./button";

interface FormDatePickerProps {
  value?: Date | null;
  onChange: (date?: Date | null) => void;
  label?: string;
  placeholder?: string;
  locale?: Locale;
  className?: string;
}

const DATE_FORMAT = "dd.MM.yyyy";

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "дд.мм.гггг",
  locale = ru,
  className,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  // синхронизация input ← value
  React.useEffect(() => {
    if (!value) {
      setInputValue("");
    } else {
      setInputValue(format(value, DATE_FORMAT, { locale }));
    }
  }, [value, locale]);

  const tryParseDate = (val: string) => {
    if (!val.trim()) {
      onChange(null);
      return;
    }

    const parsed = parse(val, DATE_FORMAT, new Date(), { locale });

    if (isValid(parsed)) {
      onChange(parsed);
    } else {
      onChange(null);
    }
  };


  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <Label>{label}</Label>}

      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Открыть календарь"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "rounded-full",
                "hover:bg-red-500/15",
                "transition-colors duration-200"
              )}
            >
            <CalendarIcon
              className={cn(
                "h-4 w-4",
                "text-muted-foreground",
                "transition-colors duration-200",
                "group-hover:text-foreground hover:text-foreground"
              )}
          />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={(date) => {
                onChange(date ?? null);
              }}
              locale={locale}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          value={inputValue}
          placeholder={placeholder}
          className="pl-9"
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={(e) => tryParseDate(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              tryParseDate(inputValue);
            }
          }}
        />
      </div>
    </div>
  );
};
