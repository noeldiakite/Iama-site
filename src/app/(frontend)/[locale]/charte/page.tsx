import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { FormationCardView } from '@/components/FormationCardView'
import { IconArrow } from '@/components/Icons'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field, Input } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Formation } from '@/payload-types'

/**
 * Charte graphique vivante (F13 — design system) : jetons, typographie et composants
 * tels qu'ils sont réellement utilisés par le site. Non indexée.
 */
export const metadata: Metadata = {
  title: 'Charte graphique',
  robots: { index: false, follow: false },
}

const couleurs: { groupe: string; items: [string, string, string][] }[] = [
  {
    groupe: 'Rouge IAMA (couleur du logo)',
    items: [
      ['iama-50', '#fff3f0', 'Fonds d’accent'],
      ['iama-500', '#ff3f1e', 'Logo, aplats, grands titres'],
      ['iama-600', '#e02a0b', 'Boutons principaux (texte blanc, AA gros texte)'],
      ['iama-700', '#b81f05', 'Liens et texte rouge (AA)'],
    ],
  },
  {
    groupe: 'Bleu nuit (aéronautique)',
    items: [
      ['nuit-50', '#f2f6fb', 'Fonds de section'],
      ['nuit-200', '#c3d3e8', 'Bordures'],
      ['nuit-700', '#1f3d68', 'Texte secondaire'],
      ['nuit-950', '#071326', 'Titres, bandeaux, pied de page'],
    ],
  },
  {
    groupe: 'Neutres et états',
    items: [
      ['sable-50', '#fbf8f3', 'Fond chaud (catalogue)'],
      ['succes-600', '#15803d', 'Succès'],
      ['alerte-600', '#b45309', 'Alerte (session complète)'],
      ['erreur-600', '#b91c1c', 'Erreur de formulaire'],
    ],
  },
]

const exemple = {
  id: 0,
  titre: 'Guidage avion aux gestes conventionnels',
  resume:
    'Guider un avion et communiquer avec le cockpit à l’aide des signaux conventionnels, en sécurité.',
  slug: 'guidage-avion-aux-gestes-conventionnels-initiale',
  dureeJours: 5,
  prix: 450000,
  type: 'initiale',
  sessions: [],
  updatedAt: '',
  createdAt: '',
} as unknown as Formation

export default async function ChartePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <PageHeader
        titre="Charte graphique"
        intro="Design system du site IAMA : couleurs, typographie et composants réutilisables. Document de travail, non indexé."
      />
      <Container className="space-y-16 py-14">
        <Bloc titre="1. Couleurs">
          <div className="grid gap-8 md:grid-cols-3">
            {couleurs.map((g) => (
              <div key={g.groupe}>
                <h3 className="mb-3 text-sm font-bold tracking-wide text-nuit-700 uppercase">
                  {g.groupe}
                </h3>
                <ul className="space-y-2">
                  {g.items.map(([nom, hex, usage]) => (
                    <li key={nom} className="flex items-center gap-3">
                      <span
                        className="h-12 w-12 shrink-0 rounded-lg ring-1 ring-black/10"
                        style={{ background: hex }}
                      />
                      <span className="text-sm">
                        <code className="font-semibold">{nom}</code>{' '}
                        <span className="text-nuit-600">{hex}</span>
                        <br />
                        <span className="text-nuit-700">{usage}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Bloc>

        <Bloc titre="2. Typographie">
          <div className="space-y-4">
            <p className="text-sm text-nuit-600">
              Titres : Manrope (800/700). Texte : Inter (400/500/600). Polices libres, servies par
              le site (aucun appel à Google).
            </p>
            <p className="font-display text-5xl font-extrabold">Titre de page H1</p>
            <p className="font-display text-3xl font-bold">Titre de section H2</p>
            <p className="font-display text-xl font-bold">Titre de carte H3</p>
            <p className="max-w-2xl text-lg">
              Paragraphe d’introduction. L’IAMA forme depuis 2005 les professionnels de l’assistance
              en escale, de la sûreté et du fret.
            </p>
            <p className="max-w-2xl">
              Texte courant, 16 px minimum, interligne 1,6 pour la lisibilité sur mobile.
            </p>
          </div>
        </Bloc>

        <Bloc titre="3. Boutons et badges">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Bouton principal</Button>
            <Button variant="secondaire">Secondaire</Button>
            <Button variant="clair">Clair</Button>
            <Button variant="lien">
              Lien d’action <IconArrow width={16} height={16} />
            </Button>
            <Button size="lg">Grand bouton</Button>
            <Button disabled>Désactivé</Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Neutre</Badge>
            <Badge tone="rouge">Formation initiale</Badge>
            <Badge tone="nuit">Domaine</Badge>
            <Badge tone="succes">Confirmée</Badge>
            <Badge tone="alerte">Complète</Badge>
          </div>
        </Bloc>

        <Bloc titre="4. Carte de formation">
          <div className="max-w-sm">
            <FormationCardView
              formation={exemple}
              locale={locale}
              labels={{
                surDevis: 'Sur devis',
                jours: '5 jours',
                voir: 'Voir la formation',
                type: 'Formation initiale',
              }}
            />
          </div>
        </Bloc>

        <Bloc titre="5. Champs de formulaire">
          <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
            <Field label="Nom" name="demo-nom" required>
              <Input name="demo-nom" placeholder="Diarra" />
            </Field>
            <Field label="E-mail" name="demo-email" required error="Adresse e-mail invalide.">
              <Input name="demo-email" defaultValue="adresse@" error="Adresse e-mail invalide." />
            </Field>
          </div>
        </Bloc>

        <Bloc titre="6. Principes">
          <ul className="prose-iama">
            <li>Mobile d’abord : chaque composant est conçu pour 360 px de large, puis enrichi.</li>
            <li>
              Accessibilité WCAG 2.1 AA : contrastes vérifiés, focus visible, navigation au clavier,
              textes alternatifs.
            </li>
            <li>
              Le rouge du logo (#FF3F1E) est réservé aux aplats ; le texte rouge utilise iama-700
              pour rester lisible.
            </li>
            <li>
              Une seule action principale (bouton rouge) par écran : « S’inscrire » ou « Voir le
              catalogue ».
            </li>
          </ul>
        </Bloc>
      </Container>
    </>
  )
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 border-b border-nuit-100 pb-3 text-2xl font-bold">{titre}</h2>
      {children}
    </section>
  )
}
