import type { Formation } from '@/payload-types'

export type Session = NonNullable<Formation['sessions']>[number]

const aujourdHui = () => new Date(new Date().toISOString().slice(0, 10))

/** Sessions à venir (non annulées), triées par date. */
export const sessionsAVenir = (f: Pick<Formation, 'sessions'>): Session[] =>
  (f.sessions ?? [])
    .filter((s) => s.statut !== 'annulee' && new Date(s.dateFin || s.dateDebut) >= aujourdHui())
    .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut))

export const prochaineSession = (f: Pick<Formation, 'sessions'>): Session | undefined =>
  sessionsAVenir(f).find((s) => s.statut === 'ouverte')
