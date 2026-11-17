'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { soumettreInscription, type EtatFormulaire } from '@/app/(frontend)/actions'
import { Link } from '@/i18n/navigation'
import { IconCheck } from './Icons'
import { Button } from './ui/Button'
import { Field, Honeypot, Input, inputClass } from './ui/Field'

export type OptionFormation = {
  slug: string
  titre: string
  sessions: { id: string; libelle: string; complete: boolean }[]
}

export function InscriptionForm({
  formations,
  formationInitiale,
  sessionInitiale,
}: {
  formations: OptionFormation[]
  formationInitiale?: string
  sessionInitiale?: string
}) {
  const t = useTranslations('inscription')
  const locale = useLocale()
  const [etat, action, enCours] = useActionState<EtatFormulaire, FormData>(soumettreInscription, {
    ok: false,
  })
  const v = etat.valeurs ?? {}
  const e = etat.erreurs ?? {}
  const [formation, setFormation] = useState(v.formation || formationInitiale || '')
  // Horodatage d'affichage du formulaire (anti-robot), posé après le chargement.
  const debutRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (debutRef.current) debutRef.current.value = String(Date.now())
  }, [])
  const sessions = useMemo(
    () => formations.find((f) => f.slug === formation)?.sessions ?? [],
    [formations, formation],
  )

  if (etat.ok) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-carte)] bg-green-50 p-8 ring-1 ring-green-200"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-succes-600 text-white">
          <IconCheck width={24} height={24} />
        </span>
        <h2 className="mt-4 text-2xl font-bold">{t('succesTitre')}</h2>
        <p className="mt-2 text-nuit-800">{t('succes', { reference: etat.reference ?? '' })}</p>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="relative space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input ref={debutRef} type="hidden" name="_t" defaultValue="0" />
      <Honeypot />
      {etat.message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm font-medium text-erreur-600 ring-1 ring-red-200"
        >
          {etat.message}
        </p>
      )}

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">{t('formation')}</legend>
        <Field label={t('formation')} name="formation" required error={e.formation}>
          <select
            id="formation"
            name="formation"
            required
            value={formation}
            onChange={(ev) => setFormation(ev.target.value)}
            className={inputClass}
            aria-invalid={e.formation ? true : undefined}
          >
            <option value="">{t('choisirFormation')}</option>
            {formations.map((f) => (
              <option key={f.slug} value={f.slug}>
                {f.titre}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('session')} name="session">
          <select
            key={formation}
            id="session"
            name="session"
            defaultValue={v.session || sessionInitiale || ''}
            className={inputClass}
          >
            <option value="">{t('sessionAucune')}</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id} disabled={s.complete}>
                {s.libelle}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-6">
        <legend className="sr-only">Identité</legend>
        <div className="sm:col-span-2">
          <Field label={t('civilite')} name="civilite">
            <select id="civilite" name="civilite" defaultValue={v.civilite} className={inputClass}>
              <option value="" />
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label={t('nom')} name="nom" required error={e.nom}>
            <Input
              name="nom"
              required
              autoComplete="family-name"
              defaultValue={v.nom}
              error={e.nom}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label={t('prenom')} name="prenom" required error={e.prenom}>
            <Input
              name="prenom"
              required
              autoComplete="given-name"
              defaultValue={v.prenom}
              error={e.prenom}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label={t('email')} name="email" required error={e.email}>
            <Input
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={v.email}
              error={e.email}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label={t('telephone')} name="telephone" required error={e.telephone}>
            <Input
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+223 …"
              defaultValue={v.telephone}
              error={e.telephone}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label={t('organisation')} name="organisation">
            <Input name="organisation" autoComplete="organization" defaultValue={v.organisation} />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label={t('fonction')} name="fonction">
            <Input name="fonction" autoComplete="organization-title" defaultValue={v.fonction} />
          </Field>
        </div>
        <div className="sm:col-span-6">
          <Field label={t('message')} name="message">
            <textarea
              id="message"
              name="message"
              rows={4}
              defaultValue={v.message}
              className={inputClass}
            />
          </Field>
        </div>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-sm text-nuit-800">
          <input
            type="checkbox"
            name="consentement"
            required
            className="mt-0.5 h-5 w-5 rounded border-nuit-300 accent-iama-600"
            aria-invalid={e.consentement ? true : undefined}
          />
          <span>
            {t('consentement')}{' '}
            <Link href="/confidentialite" className="font-medium text-iama-700 underline">
              ↗
            </Link>
          </span>
        </label>
        {e.consentement && (
          <p className="mt-1 text-sm font-medium text-erreur-600">{e.consentement}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={enCours}>
          {enCours ? t('envoi') : t('envoyer')}
        </Button>
        <p className="text-sm text-nuit-600">
          <span className="text-iama-700">*</span> {t('obligatoire')}
        </p>
      </div>
      <p className="text-sm text-nuit-600">{t('paiementPhase2')}</p>
    </form>
  )
}
