import * as React from 'react'

import { cn } from '@/lib/utils'

// Explicitly allow only these safe textarea props (excluding 'style', etc.)
const ALLOWED_TEXTAREA_PROPS = [
  'autoComplete', 'autoFocus', 'cols', 'defaultValue', 'disabled', 'form', 'id',
  'maxLength', 'minLength', 'name', 'placeholder', 'readOnly', 'required',
  'rows', 'spellCheck', 'tabIndex', 'title', 'value', 'wrap', 'aria-label',
  'aria-labelledby', 'aria-describedby', 'aria-invalid', 'aria-required',
  'aria-errormessage', 'aria-activedescendant', 'aria-autocomplete', 'aria-owns',
  'aria-expanded', 'aria-controls', 'aria-multiline', 'aria-placeholder',
  // Add others if you use them in your code base
]

const REACT_EVENT_HANDLER_REGEX = /^on[A-Z].*$/

function filterTextareaProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {}
  for (const key of Object.keys(props)) {
    // Disallow 'style' prop for security
    if (key === 'style') continue

    if (ALLOWED_TEXTAREA_PROPS.includes(key)) {
      filtered[key] = props[key]
      continue
    }

    // Allow React event handlers ONLY if value is a function
    if (REACT_EVENT_HANDLER_REGEX.test(key) && typeof props[key] === 'function') {
      filtered[key] = props[key]
      continue
    }

    // All other props are dropped
  }
  return filtered
}

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    const safeProps = filterTextareaProps(props)

    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className
            )}
            {...safeProps}
        />
    )
}

export { Textarea }