'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'
import { envoyerContact, type EtatFormulaire } from '@/app/(frontend)/actions'
import { IconCheck } from './Icons'
import { Button } from './ui/Button'
import { Field, Honeypot, Input, inputClass } from './ui/Field'

export function ContactForm() {
  const t = useTranslations('contact')
  const ti = useTranslations('inscription')
  const locale = useLocale()
  const [etat, action, enCours] = useActionState<EtatFormulaire, FormData>(envoyerContact, {
    ok: false,
  })
  const v = etat.valeurs ?? {}
  const e = etat.erreurs ?? {}
  // Horodatage d'affichage du formulaire (anti-robot), posé après le chargement.
  const debutRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (debutRef.current) debutRef.current.value = String(Date.now())
  }, [])

  if (etat.ok) {
    return (
      <div
        role="status"
        className="flex items-start gap-4 rounded-[var(--radius-carte)] bg-green-50 p-6 ring-1 ring-green-200"
      >
        <IconCheck width={24} height={24} className="text-succes-600" />
        <p className="font-medium text-nuit-900">{t('succes')}</p>
      </div>
    )
  }

  return (
    <form action={action} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input ref={debutRef} type="hidden" name="_t" defaultValue="0" />
      <Honeypot />
      {etat.message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm font-medium text-erreur-600 ring-1 ring-red-200 sm:col-span-2"
        >
          {etat.message}
        </p>
      )}
      <Field label={t('nom')} name="nom" required error={e.nom}>
        <Input name="nom" required autoComplete="name" defaultValue={v.nom} error={e.nom} />
      </Field>
      <Field label={ti('organisation')} name="organisation">
        <Input name="organisation" autoComplete="organization" defaultValue={v.organisation} />
      </Field>
      <Field label={ti('email')} name="email" required error={e.email}>
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={v.email}
          error={e.email}
        />
      </Field>
      <Field label={ti('telephone')} name="telephone" error={e.telephone}>
        <Input
          name="telephone"
          type="tel"
          autoComplete="tel"
          defaultValue={v.telephone}
          error={e.telephone}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label={t('sujet')} name="sujet" required error={e.sujet}>
          <Input name="sujet" required defaultValue={v.sujet} error={e.sujet} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={t('message')} name="message" required error={e.message}>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            defaultValue={v.message}
            className={inputClass}
            aria-invalid={e.message ? true : undefined}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-nuit-800">
          <input
            type="checkbox"
            name="consentement"
            required
            className="mt-0.5 h-5 w-5 accent-iama-600"
          />
          <span>{ti('consentement')}</span>
        </label>
        {e.consentement && (
          <p className="mt-1 text-sm font-medium text-erreur-600">{e.consentement}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={enCours}>
          {enCours ? ti('envoi') : t('envoyer')}
        </Button>
      </div>
    </form>
  )
}
