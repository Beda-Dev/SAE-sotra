"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { LucideIcon } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  placeholder: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  required?: boolean
}

export function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  icon: Icon,
  required = true,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-medium flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="h-12 text-base border-2 border-input focus:border-primary"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-base py-3">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
