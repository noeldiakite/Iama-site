import type { ReactNode } from 'react'
import { Container } from './Container'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

/** Bandeau de titre des pages intérieures. */
export function PageHeader({
  titre,
  intro,
  crumbs,
  children,
}: {
  titre: ReactNode
  intro?: ReactNode
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-nuit-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-iama-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-iama-500/60 to-transparent"
      />
      <Container className="relative py-12 sm:py-16">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">{titre}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-nuit-100">{intro}</p>}
        {children}
      </Container>
    </section>
  )
}
