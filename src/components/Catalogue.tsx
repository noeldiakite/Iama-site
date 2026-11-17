'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import type { Domaine, Formation } from '@/payload-types'
import { sessionsAVenir } from '@/lib/sessions'
import { FormationCardView } from './FormationCardView'
import { IconSearch } from './Icons'
import { inputClass } from './ui/Field'

type Filtres = { q: string; domaine: string; modalite: string; duree: string; periode: string }
const VIDE: Filtres = { q: '', domaine: '', modalite: '', duree: '', periode: '' }

const normaliser = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/**
 * Catalogue filtrable (F3). Le filtrage se fait dans le navigateur : la page reste
 * générée à l'avance (rapide) et le catalogue compte quelques dizaines de formations au plus.
 */
export function Catalogue({
  formations,
  domaines,
}: {
  formations: Formation[]
  domaines: Domaine[]
}) {
  const t = useTranslations('catalogue')
  const tf = useTranslations('formation')
  const locale = useLocale()
  const [f, setF] = useState<Filtres>(VIDE)
  const [maintenant] = useState(() => Date.now())
  const set = (k: keyof Filtres) => (e: { target: { value: string } }) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const resultats = useMemo(() => {
    const q = normaliser(f.q.trim())
    return formations.filter((fo) => {
      if (q) {
        const texte = normaliser(
          [
            fo.titre,
            fo.resume,
            fo.public,
            typeof fo.domaine === 'object' ? fo.domaine?.titre : '',
          ].join(' '),
        )
        if (!q.split(/\s+/).every((mot) => texte.includes(mot))) return false
      }
      if (f.domaine) {
        const id = typeof fo.domaine === 'object' ? fo.domaine?.id : fo.domaine
        if (String(id) !== f.domaine) return false
      }
      if (f.modalite && !fo.modalites?.includes(f.modalite as 'presentiel')) return false
      if (f.duree) {
        const j = fo.dureeJours ?? 0
        if (f.duree === 'courte' && !(j >= 1 && j <= 3)) return false
        if (f.duree === 'moyenne' && !(j >= 4 && j <= 5)) return false
        if (f.duree === 'longue' && !(j > 5)) return false
      }
      if (f.periode) {
        const sessions = sessionsAVenir(fo).filter((s) => s.statut === 'ouverte')
        if (!sessions.length) return false
        const horizon = f.periode === 'mois' ? 31 : f.periode === 'trimestre' ? 92 : Infinity
        if (
          !sessions.some(
            (s) => new Date(s.dateDebut).getTime() - maintenant <= horizon * 86_400_000,
          )
        )
          return false
      }
      return true
    })
  }, [formations, f, maintenant])

  const actifs = Object.values(f).some(Boolean)

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="lg:col-span-3" aria-label={t('filtres')}>
        <form
          role="search"
          className="space-y-5 rounded-[var(--radius-carte)] bg-white p-5 ring-1 ring-nuit-100 lg:sticky lg:top-24"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label htmlFor="q" className="mb-1.5 block text-sm font-semibold">
              {t('recherche')}
            </label>
            <div className="relative">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-nuit-400"
                width={18}
                height={18}
              />
              <input
                id="q"
                type="search"
                value={f.q}
                onChange={set('q')}
                placeholder={t('recherchePlaceholder')}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
            <Select
              id="domaine"
              label={t('domaine')}
              value={f.domaine}
              onChange={set('domaine')}
              options={[
                ['', t('tous')],
                ...domaines.map((d) => [String(d.id), d.titre] as [string, string]),
              ]}
            />
            <Select
              id="modalite"
              label={t('modalite')}
              value={f.modalite}
              onChange={set('modalite')}
              options={[
                ['', t('toutes')],
                ['presentiel', tf('modalitesListe.presentiel')],
                ['distanciel', tf('modalitesListe.distanciel')],
                ['mixte', tf('modalitesListe.mixte')],
              ]}
            />
            <Select
              id="duree"
              label={t('duree')}
              value={f.duree}
              onChange={set('duree')}
              options={[
                ['', t('toutes')],
                ['courte', t('dureeCourte')],
                ['moyenne', t('dureeMoyenne')],
                ['longue', t('dureeLongue')],
              ]}
            />
            <Select
              id="periode"
              label={t('periode')}
              value={f.periode}
              onChange={set('periode')}
              options={[
                ['', t('toutes')],
                ['mois', t('periodeMois')],
                ['trimestre', t('periodeTrimestre')],
                ['toutes', t('periodeAvecSession')],
              ]}
            />
          </div>
          {actifs && (
            <button
              type="button"
              onClick={() => setF(VIDE)}
              className="text-sm font-semibold text-iama-700 hover:underline"
            >
              {t('reinitialiser')}
            </button>
          )}
        </form>
      </aside>

      <div className="lg:col-span-9">
        <p className="mb-5 text-sm font-medium text-nuit-700" role="status" aria-live="polite">
          {t('resultats', { count: resultats.length })}
        </p>
        {resultats.length === 0 ? (
          <p className="rounded-[var(--radius-carte)] bg-nuit-50 p-10 text-center text-nuit-700">
            {t('aucun')}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {resultats.map((fo) => (
              <FormationCardView
                key={fo.id}
                formation={fo}
                locale={locale}
                labels={{
                  surDevis: tf('surDevis'),
                  jours: fo.dureeJours ? tf('jours', { count: fo.dureeJours }) : null,
                  voir: tf('enSavoirPlus'),
                  type: fo.type ? tf(`types.${fo.type}`) : null,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (e: { target: { value: string } }) => void
  options: [string, string][]
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <select id={id} value={value} onChange={onChange} className={inputClass}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}
