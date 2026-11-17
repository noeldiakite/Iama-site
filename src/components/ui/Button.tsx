import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'

type Variant = 'primaire' | 'secondaire' | 'clair' | 'lien'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  // Rouge foncé (iama-600) pour garantir un contraste AA avec le texte blanc.
  primaire: 'bg-iama-600 text-white hover:bg-iama-700 focus-visible:outline-iama-600',
  secondaire: 'bg-nuit-900 text-white hover:bg-nuit-800 focus-visible:outline-nuit-900',
  clair:
    'bg-white text-nuit-900 ring-1 ring-nuit-200 hover:bg-nuit-50 focus-visible:outline-nuit-700',
  lien: 'px-0! py-0! text-iama-700 hover:text-iama-800 underline-offset-4 hover:underline',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export const buttonClass = (variant: Variant = 'primaire', size: Size = 'md', extra = '') =>
  `${base} ${variants[variant]} ${sizes[size]} ${extra}`

type LinkProps = ComponentProps<typeof Link> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function ButtonLink({ variant, size, className = '', ...props }: LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}

export function Button({
  variant,
  size,
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />
}
