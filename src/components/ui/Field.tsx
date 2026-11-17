import type { ComponentProps, ReactNode } from 'react'

export const inputClass =
  'block w-full rounded-lg border-0 bg-white px-3.5 py-2.5 text-nuit-950 shadow-xs ring-1 ring-nuit-200 ring-inset placeholder:text-nuit-400 focus:ring-2 focus:ring-iama-600 focus:outline-none aria-[invalid=true]:ring-erreur-600'

export function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string
  name: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-nuit-900">
        {label}
        {required && (
          <span className="ml-0.5 text-iama-700" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-nuit-600">{hint}</p>}
      {error && (
        <p id={`${name}-erreur`} className="mt-1 text-sm font-medium text-erreur-600">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({
  name,
  error,
  ...props
}: ComponentProps<'input'> & { name: string; error?: string }) {
  return (
    <input
      id={name}
      name={name}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${name}-erreur` : undefined}
      className={inputClass}
      {...props}
    />
  )
}

/** Champ piège invisible : les robots le remplissent, les humains non (anti-spam, F5). */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="site_web">Ne pas remplir</label>
      <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
