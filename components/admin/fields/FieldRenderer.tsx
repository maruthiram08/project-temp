/**
 * Field Renderer - Main component that maps field types to input components
 */

'use client'

import { FormField } from '@/types/form-config'
import { TextInput } from './TextInput'
import { TextAreaInput } from './TextAreaInput'
import { SelectInput } from './SelectInput'
import { MultiSelectInput } from './MultiSelectInput'
import { DateTimeInput } from './DateTimeInput'
import { ColorInput } from './ColorInput'
import { ImageInput } from './ImageInput'
import { NumberInput } from './NumberInput'
import { BooleanInput } from './BooleanInput'
import { URLInput } from './URLInput'
import { ArrayInput } from './ArrayInput'

export interface FieldRendererProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  error?: string
  disabled?: boolean
}

export function FieldRenderer({ field, value, onChange, error, disabled = false }: FieldRendererProps) {
  const fieldComponents = {
    text: TextInput,
    textarea: TextAreaInput,
    select: SelectInput,
    multiselect: MultiSelectInput,
    date: DateTimeInput,
    datetime: DateTimeInput,
    color: ColorInput,
    image: ImageInput,
    number: NumberInput,
    boolean: BooleanInput,
    url: URLInput,
    array: ArrayInput
  }

  const FieldComponent = fieldComponents[field.type]

  if (!FieldComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-sm text-red-600">Unknown field type: {field.type}</p>
      </div>
    )
  }

  return (
    <div className="field-renderer">
      <FieldComponent
        field={field}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
