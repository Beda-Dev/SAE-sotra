"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LucideIcon } from "lucide-react"

interface InputFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  required?: boolean
  type?: string
  readOnly?: boolean
}

export function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = true,
  type = "text",
  readOnly = false,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-medium flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-base border-2 border-input focus:border-primary"
        required={required}
        readOnly={readOnly}
      />
    </div>
  )
}
