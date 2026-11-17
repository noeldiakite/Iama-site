/**
 * Contenus repris du site actuel (iama.oxadel.net, aspiré le 16/11/2026).
 * Les textes anglais sont des traductions PROVISOIRES pour la maquette : la traduction
 * officielle est à fournir par l'IAMA (cadrage technique, échéance 08/01/2027).
 * Les sessions sont des EXEMPLES à remplacer par le calendrier réel de l'IAMA.
 */

type Bi = { fr: string; en: string }

export const domaines: { cle: string; titre: Bi; ordre: number }[] = [
  { cle: 'escale', titre: { fr: 'Assistance en escale', en: 'Ground handling' }, ordre: 1 },
  { cle: 'surete', titre: { fr: 'Sûreté et sécurité', en: 'Security and safety' }, ordre: 2 },
  {
    cle: 'fret',
    titre: { fr: 'Fret et marchandises dangereuses', en: 'Cargo and dangerous goods' },
    ordre: 3,
  },
  {
    cle: 'transverse',
    titre: { fr: 'Compétences transverses', en: 'Cross-functional skills' },
    ordre: 4,
  },
]

export const metiers: { cle: string; titre: Bi; description: Bi; ordre: number }[] = [
  {
    cle: 'agent-descale',
    ordre: 1,
    titre: { fr: 'Agent d’escale', en: 'Passenger service agent' },
    description: {
      fr: 'L’agent d’escale commercial est au cœur des services de l’aéroport : il renseigne les passagers et se charge des procédures d’embarquement et de débarquement. Il s’occupe aussi de l’enregistrement des passagers et du suivi de leurs bagages en soute.',
      en: 'The passenger service agent is at the heart of airport services: they inform passengers and handle boarding and disembarking. They also check passengers in and follow up on their hold baggage.',
    },
  },
  {
    cle: 'agent-de-piste-bagagiste',
    ordre: 2,
    titre: { fr: 'Agent de piste / bagagiste', en: 'Ramp agent / baggage handler' },
    description: {
      fr: 'L’agent de piste joue un rôle capital dans la circulation sur le tarmac. Il intervient avant et après chaque atterrissage pour charger et décharger les appareils et gère le déplacement des avions au sol.',
      en: 'The ramp agent plays a key role in apron operations. They load and unload aircraft before and after each flight and manage aircraft movements on the ground.',
    },
  },
  {
    cle: 'agent-de-surete',
    ordre: 3,
    titre: { fr: 'Agent de sûreté', en: 'Security agent' },
    description: {
      fr: 'L’agent de sûreté aéroportuaire inspecte les passagers, leurs bagages et l’ensemble du personnel. Il contrôle aussi le courrier, le fret, les marchandises montées à bord et le matériel utilisé dans l’aéroport.',
      en: 'The airport security agent screens passengers, their baggage and all staff. They also check mail, cargo, goods taken on board and equipment used at the airport.',
    },
  },
  {
    cle: 'agent-de-reservation',
    ordre: 4,
    titre: { fr: 'Agent de réservation', en: 'Reservation agent' },
    description: {
      fr: 'L’agent de réservation accueille et conseille la clientèle en matière de voyages aériens. Il effectue les réservations et délivre les billets.',
      en: 'The reservation agent welcomes and advises customers on air travel, makes bookings and issues tickets.',
    },
  },
  {
    cle: 'agent-polyvalent',
    ordre: 5,
    titre: { fr: 'Agent polyvalent (PMR)', en: 'Multi-skilled agent (PRM)' },
    description: {
      fr: 'L’agent aéroportuaire polyvalent, ou agent PMR, accueille et accompagne les passagers qui ont besoin d’aide, en particulier les plus jeunes et les personnes en situation de handicap.',
      en: 'The multi-skilled airport agent, or PRM agent, welcomes and assists passengers who need help, especially children and passengers with reduced mobility.',
    },
  },
  {
    cle: 'agent-de-nettoyage',
    ordre: 6,
    titre: { fr: 'Agent de nettoyage avion', en: 'Aircraft cleaning agent' },
    description: {
      fr: 'L’agent de nettoyage, ou agent de propreté avion, participe au bon entretien des appareils et garantit aux voyageurs des espaces propres et des conditions de voyage agréables.',
      en: 'The aircraft cleaning agent keeps cabins clean and ensures passengers travel in pleasant conditions.',
    },
  },
]

export type FormationSeed = {
  slug: string
  image: string
  domaine: string
  type: 'initiale' | 'continue' | 'sur-mesure'
  dureeJours?: number
  dureeHeures?: number
  prix?: number
  enVedette?: boolean
  ordre: number
  metiers: string[]
  sessions: { debut: string; fin: string; places: number; restantes: number }[]
  fr: Contenu
  en: Contenu
}
type Contenu = {
  titre: string
  resume: string
  description: string
  objectifs: string[]
  public?: string
  prerequis?: string
  programme?: string
  methodes?: string
  evaluation?: string
  validite?: string
}

const A_COMPLETER_FR = 'Programme détaillé à fournir par l’IAMA.'
const A_COMPLETER_EN = 'Detailed programme to be provided by IAMA.'

export const formations: FormationSeed[] = [
  {
    slug: 'guidage-avion-aux-gestes-conventionnels-initiale',
    image: 'guidage-avion.jpg',
    domaine: 'escale',
    type: 'initiale',
    dureeJours: 5,
    dureeHeures: 35,
    enVedette: true,
    ordre: 1,
    metiers: ['agent-de-piste-bagagiste'],
    sessions: [{ debut: '2027-02-15', fin: '2027-02-19', places: 12, restantes: 7 }],
    fr: {
      titre: 'Guidage avion aux gestes conventionnels — initiale',
      resume:
        'Guider un avion à l’arrivée et au départ et communiquer avec le cockpit à l’aide des signaux conventionnels, en toute sécurité.',
      description:
        'Formation initiale au guidage des aéronefs par signaux conventionnels, alliant théorie en salle et pratique en conditions réelles sur l’aéroport international Modibo-Keïta.',
      objectifs: [
        'Connaître et savoir appliquer les règles de sécurité en vigueur autour d’un avion.',
        'Savoir guider un avion et communiquer avec le cockpit à l’aide des signaux conventionnels.',
      ],
      public:
        'Agent de compagnie aérienne ou de société d’assistance devant assurer le guidage de l’avion par gestes conventionnels lors des opérations d’arrivée ou de départ.',
      prerequis: 'Badge avec zone Avion valable localement.',
      programme: `## Théorie (4 heures)
- Le rôle et les responsabilités de l’opérateur.
- Les principes de sécurité liés à l’avion en mouvement.
- Les règles de sécurité en vigueur autour de l’avion.
- La préparation et la vérification du poste de stationnement avion.
- La réalisation des opérations d’arrivée et de départ.
- Les principes de calage et de balisage de l’avion.
- Les signaux conventionnels de guidage avion et de communication.

## Pratique (31 heures)
- Application des règles et méthodologies abordées en théorie, avec mise en situation réelle.
- Opérations de guidage avion à l’arrivée.
- Opérations de guidage avion au départ (selon disponibilités locales).`,
      methodes:
        'Théorie dispensée en salle. Pratique en conditions réelles dans le cadre des touchées avion, avec un formateur qualifié et expérimenté.',
      evaluation:
        'Théorie : test écrit de validation (80 % de bonnes réponses minimum, IATA AHM 1110).\nPratique : fiche d’évaluation des compétences (80 % de points positifs minimum).',
      validite: '3 ans maximum (recommandation IATA AHM 1110)',
    },
    en: {
      titre: 'Aircraft marshalling with standard hand signals — initial',
      resume:
        'Guide an aircraft on arrival and departure and communicate with the flight deck using standard hand signals, safely.',
      description:
        'Initial training in aircraft marshalling with standard signals, combining classroom theory with hands-on practice at Modibo-Keïta International Airport.',
      objectifs: [
        'Know and apply the safety rules around an aircraft.',
        'Marshal an aircraft and communicate with the flight deck using standard signals.',
      ],
      public:
        'Airline or ground handling staff responsible for marshalling aircraft on arrival or departure.',
      prerequis: 'Locally valid airside badge with aircraft zone access.',
      programme: `## Theory (4 hours)
- Role and responsibilities of the operator.
- Safety principles for moving aircraft.
- Safety rules around the aircraft.
- Preparing and checking the aircraft stand.
- Arrival and departure operations.
- Chocking and coning principles.
- Standard marshalling and communication signals.

## Practice (31 hours)
- Applying the rules and methods learned, in real conditions.
- Marshalling aircraft on arrival.
- Marshalling aircraft on departure (subject to local availability).`,
      methodes:
        'Classroom theory. Practice in real conditions during aircraft turnarounds, with a qualified and experienced instructor.',
      evaluation:
        'Theory: written test (minimum 80% correct answers, IATA AHM 1110).\nPractice: skills assessment sheet (minimum 80% positive points).',
      validite: 'Up to 3 years (IATA AHM 1110 recommendation)',
    },
  },
  {
    slug: 'formation-comportement-commercial',
    image: 'comportement-commercial.jpg',
    domaine: 'transverse',
    type: 'continue',
    dureeJours: 3,
    dureeHeures: 21,
    prix: 450000,
    enVedette: true,
    ordre: 2,
    metiers: ['agent-descale', 'agent-polyvalent'],
    sessions: [{ debut: '2027-03-08', fin: '2027-03-10', places: 15, restantes: 15 }],
    fr: {
      titre: 'Agent passage et comportement commercial — maintien de compétences',
      resume:
        'Atteindre un niveau de professionnalisme conforme aux standards internationaux dans la relation avec les passagers, à l’enregistrement comme auprès des PMR.',
      description:
        'Cette formation s’adresse à toute personne en contact régulier avec des clients, internes ou externes, dans l’enregistrement des passagers, le traitement des passagers à mobilité réduite (PMR) et de leurs bagages.',
      objectifs: [
        'Adopter un comportement commercial professionnel avec chaque passager.',
        'Gérer les situations délicates et les litiges.',
        'Accueillir et accompagner les passagers à mobilité réduite.',
      ],
      public: 'Agents passage, agents litiges, agents PMR.',
      methodes: 'Formation théorique en salle et jeux de rôles.',
      evaluation:
        'Test écrit de contrôle des connaissances théoriques : 80 % de bonnes réponses minimum.',
    },
    en: {
      titre: 'Passenger service and customer behaviour — recurrent training',
      resume:
        'Reach an international standard of professionalism with passengers, at check-in and with passengers with reduced mobility.',
      description:
        'This course is for anyone in regular contact with internal or external customers in passenger check-in, handling of passengers with reduced mobility (PRM) and their baggage.',
      objectifs: [
        'Adopt a professional customer attitude with every passenger.',
        'Handle difficult situations and claims.',
        'Welcome and assist passengers with reduced mobility.',
      ],
      public: 'Passenger service agents, claims agents, PRM agents.',
      methodes: 'Classroom theory and role play.',
      evaluation: 'Written knowledge test: minimum 80% correct answers.',
    },
  },
  {
    slug: 'formation-trafic-asam',
    image: 'trafic-asam.jpg',
    domaine: 'escale',
    type: 'continue',
    prix: 450000,
    ordre: 3,
    metiers: ['agent-descale'],
    sessions: [],
    fr: {
      titre: 'Formation trafic (programme ASAM)',
      resume: 'Formation aux opérations de trafic, conçue avec ASAM pour ses agents.',
      description: A_COMPLETER_FR,
      objectifs: [],
    },
    en: {
      titre: 'Traffic operations (ASAM programme)',
      resume: 'Traffic operations training designed with ASAM for its staff.',
      description: A_COMPLETER_EN,
      objectifs: [],
    },
  },
  {
    slug: 'formation-trafic-de-base-ab-initio',
    image: 'trafic-ab-initio.jpg',
    domaine: 'escale',
    type: 'initiale',
    enVedette: true,
    ordre: 4,
    metiers: ['agent-descale', 'agent-de-piste-bagagiste'],
    sessions: [{ debut: '2027-01-25', fin: '2027-02-05', places: 20, restantes: 4 }],
    fr: {
      titre: 'Trafic de base — ab initio',
      resume: 'Les fondamentaux de l’assistance en escale pour débuter dans le métier.',
      description: A_COMPLETER_FR,
      objectifs: [],
    },
    en: {
      titre: 'Basic traffic — ab initio',
      resume: 'Ground handling fundamentals for newcomers to the profession.',
      description: A_COMPLETER_EN,
      objectifs: [],
    },
  },
  {
    slug: 'surete-du-fret-et-de-la-poste',
    image: 'surete-fret.jpg',
    domaine: 'surete',
    type: 'initiale',
    dureeJours: 5,
    ordre: 5,
    metiers: ['agent-de-surete'],
    sessions: [{ debut: '2027-03-15', fin: '2027-03-19', places: 12, restantes: 12 }],
    fr: {
      titre: 'Sûreté du fret et de la poste',
      resume:
        'Mettre en œuvre les mesures préventives de sûreté du fret et du courrier, conformément au programme national de sûreté.',
      description:
        'Formation de base pour s’assurer de la mise en œuvre des mesures préventives de sûreté du fret, dans les limites des responsabilités de chaque intervenant, conformément aux programmes nationaux. Réalisée sous la supervision de l’ANAC du Mali.',
      objectifs: [
        'Connaître la réglementation nationale de sûreté du fret et de la poste.',
        'Appliquer les mesures préventives de sûreté adaptées.',
      ],
    },
    en: {
      titre: 'Cargo and mail security',
      resume:
        'Apply preventive security measures to cargo and mail in line with the national security programme.',
      description:
        'Basic training to implement preventive cargo security measures within each stakeholder’s responsibilities, in line with national programmes. Delivered under the supervision of ANAC Mali.',
      objectifs: [
        'Know the national cargo and mail security regulations.',
        'Apply the appropriate preventive security measures.',
      ],
    },
  },
  {
    slug: 'gestion-de-crises',
    image: 'gestion-crises.jpg',
    domaine: 'surete',
    type: 'sur-mesure',
    dureeJours: 5,
    ordre: 6,
    metiers: [],
    sessions: [],
    fr: {
      titre: 'Gestion de crises',
      resume:
        'Préparer l’encadrement à faire face aux urgences majeures de sûreté survenant dans les aéroports.',
      description:
        'Expliquer la nécessité d’un plan de gestion de crises pour faire face aux urgences majeures de sûreté survenant aux aéroports. Formation dispensée sous la supervision de l’ANAC du Mali.',
      objectifs: [
        'Comprendre le rôle d’un plan de gestion de crises.',
        'Savoir organiser la réponse à une urgence majeure de sûreté.',
      ],
      public: 'Encadrement des compagnies aériennes et des sociétés d’assistance.',
    },
    en: {
      titre: 'Crisis management',
      resume: 'Prepare managers to respond to major security emergencies at airports.',
      description:
        'Explains why a crisis management plan is needed to respond to major security emergencies at airports. Delivered under the supervision of ANAC Mali.',
      objectifs: [
        'Understand the role of a crisis management plan.',
        'Organise the response to a major security emergency.',
      ],
      public: 'Managers of airlines and ground handling companies.',
    },
  },
  {
    slug: 'marchandises-dangereuses-cbta',
    image: 'cbta-marchandises-dangereuses.jpg',
    domaine: 'fret',
    type: 'initiale',
    dureeJours: 3,
    ordre: 7,
    metiers: [],
    sessions: [{ debut: '2027-02-22', fin: '2027-02-24', places: 10, restantes: 10 }],
    fr: {
      titre: 'Marchandises dangereuses — CBTA (IATA DGR)',
      resume:
        'Préparer les envois de marchandises dangereuses selon la réglementation IATA, avec l’approche par compétences (CBTA).',
      description:
        'Renforcer les capacités opérationnelles pour la préparation des colis contenant des marchandises dangereuses selon la réglementation IATA. Le cours porte sur les principes de base, la classification des marchandises dangereuses et la préparation de l’expédition.',
      objectifs: [
        'Satisfaire aux exigences de conformité réglementaire.',
        'Préparer les envois de marchandises dangereuses et leur documentation.',
        'Appliquer le manuel DGR de l’IATA pour traiter les envois avec précision.',
        'Connaître les responsabilités légales des intervenants du transport aérien de marchandises dangereuses.',
      ],
      public: 'Transitaires, agents de fret, personnels des compagnies aériennes.',
    },
    en: {
      titre: 'Dangerous goods — CBTA (IATA DGR)',
      resume:
        'Prepare dangerous goods shipments according to IATA regulations, using the competency-based training approach (CBTA).',
      description:
        'Builds operational skills to prepare packages containing dangerous goods in line with IATA regulations: basic principles, classification and shipment preparation.',
      objectifs: [
        'Meet regulatory compliance requirements.',
        'Prepare dangerous goods shipments and their documentation.',
        'Apply the IATA DGR manual to process shipments accurately.',
        'Know the legal responsibilities of stakeholders in air transport of dangerous goods.',
      ],
      public: 'Freight forwarders, cargo agents, airline staff.',
    },
  },
  {
    slug: 'agent-denregistrement',
    image: 'agents-enregistrement.jpg',
    domaine: 'escale',
    type: 'initiale',
    ordre: 8,
    metiers: ['agent-descale'],
    sessions: [],
    fr: {
      titre: 'Agent d’enregistrement passagers',
      resume:
        'Accueillir et enregistrer les passagers et leurs bagages selon les procédures des compagnies.',
      description: A_COMPLETER_FR,
      objectifs: [],
    },
    en: {
      titre: 'Passenger check-in agent',
      resume: 'Welcome and check in passengers and their baggage following airline procedures.',
      description: A_COMPLETER_EN,
      objectifs: [],
    },
  },
]

export const actualites: {
  slug: string
  date: string
  image: string
  fr: { titre: string; texte: string }
  en: { titre: string; texte: string }
}[] = [
  {
    slug: 'formation-cbta',
    date: '2023-12-27',
    image: 'cbta-marchandises-dangereuses.jpg',
    fr: {
      titre: 'Formation CBTA aux marchandises dangereuses',
      texte:
        'L’IAMA a organisé du 27 au 29 décembre 2023 une session de formation CBTA 7.1 au profit des sociétés de transit Satguru et Bridge Africa Consulting. L’objectif : renforcer les capacités opérationnelles des apprenants pour la préparation des colis contenant des marchandises dangereuses selon la réglementation IATA.',
    },
    en: {
      titre: 'CBTA dangerous goods training',
      texte:
        'From 27 to 29 December 2023, IAMA held a CBTA 7.1 training session for the freight forwarders Satguru and Bridge Africa Consulting, to strengthen their ability to prepare dangerous goods packages according to IATA regulations.',
    },
  },
  {
    slug: 'formation-gestion-de-crises',
    date: '2023-10-24',
    image: 'gestion-crises.jpg',
    fr: {
      titre: 'Sahel Aviation Service forme son encadrement à la gestion de crises',
      texte:
        'Du 16 au 20 octobre, l’IAMA a formé l’encadrement de la compagnie Sahel Aviation Service à la gestion de crises, sous la supervision de l’ANAC du Mali. Objectif : maîtriser le plan de gestion de crises face aux urgences majeures de sûreté dans les aéroports.',
    },
    en: {
      titre: 'Sahel Aviation Service trains its managers in crisis management',
      texte:
        'From 16 to 20 October, IAMA trained Sahel Aviation Service managers in crisis management, under the supervision of ANAC Mali.',
    },
  },
  {
    slug: 'surete-du-fret-et-de-la-poste',
    date: '2023-10-24',
    image: 'surete-fret.jpg',
    fr: {
      titre: 'ASAM forme son personnel à la sûreté du fret et de la poste',
      texte:
        'Du 9 au 13 octobre 2023, l’IAMA a formé le personnel d’ASAM à la sûreté du fret et de la poste, sous la supervision de l’ANAC du Mali.',
    },
    en: {
      titre: 'ASAM trains its staff in cargo and mail security',
      texte:
        'From 9 to 13 October 2023, IAMA trained ASAM staff in cargo and mail security, under the supervision of ANAC Mali.',
    },
  },
]

export const accreditations = [
  {
    image: 'certificat-anac.jpg',
    organisme: 'anac' as const,
    ordre: 1,
    fr: 'Certificat de reconnaissance de capacité pour centre de formation de l’aviation civile',
    en: 'Certificate of capability for a civil aviation training centre',
  },
  {
    image: 'specifications-agrement.jpg',
    organisme: 'anac' as const,
    ordre: 2,
    fr: 'Spécifications d’agrément de l’organisme de formation de l’aviation civile',
    en: 'Approval specifications of the civil aviation training organisation',
  },
  {
    image: 'certificat-iata.jpg',
    organisme: 'iata' as const,
    ordre: 3,
    fr: 'Certificat d’accréditation IATA',
    en: 'IATA certificate of accreditation',
  },
]

export const partenaires = [
  { nom: 'ASAM', logo: 'logo-asam.png', ordre: 1 },
  { nom: 'Air France', logo: 'logo-air-france.png', ordre: 2 },
  { nom: 'ASECNA Services', logo: 'logo-asecna-services.png', ordre: 3 },
]

export const institut = {
  fr: {
    titre: 'L’Institut',
    chapeau:
      'Centre de formation aux métiers du transport aérien, reconnu par l’ANAC Mali et accrédité par l’IATA.',
    contenu: `L’Institut Africain des Métiers de l’Aérien (IAMA) est une société anonyme de droit malien, créée en partenariat par ASAM, Air France et ASECNA Services, et spécialisée dans la formation des opérateurs du transport aérien. Son siège est situé à l’aéroport international Modibo-Keïta de Bamako.
## Une reconnaissance nationale et internationale
L’IAMA est reconnu par l’Agence Nationale de l’Aviation Civile du Mali (ANAC) et par l’IATA, à travers deux documents de référence : le certificat de reconnaissance de capacité et le certificat d’accréditation IATA.
## Nos publics
- Les sociétés d’assistance en escale
- Les compagnies aériennes
- Les transitaires
- Les personnes qui souhaitent travailler dans les métiers de l’aérien
## Notre pédagogie
Chaque cours s’appuie sur un syllabus et un programme de formation remis au stagiaire à son inscription, ou à l’entreprise cliente à l’achat de la formation. Nos instructeurs sont tous reconnus par l’ANAC et l’IATA. Les formations sont programmées en fonction des besoins exprimés par les clients.`,
  },
  en: {
    titre: 'The Institute',
    chapeau: 'Aviation training centre approved by ANAC Mali and accredited by IATA.',
    contenu: `The African Institute of Aviation Professions (IAMA) is a Malian public limited company founded in partnership by ASAM, Air France and ASECNA Services, specialised in training air transport operators. Its head office is at Modibo-Keïta International Airport, Bamako.
## National and international recognition
IAMA is approved by Mali’s National Civil Aviation Agency (ANAC) and accredited by IATA, through two reference documents: the certificate of capability and the IATA certificate of accreditation.
## Who we train
- Ground handling companies
- Airlines
- Freight forwarders
- Anyone wishing to work in aviation
## Our approach
Each course is backed by a syllabus and training programme given to trainees on registration, or to client companies on purchase. All our instructors are recognised by ANAC and IATA. Sessions are scheduled according to client needs.`,
  },
}

export const confidentialite = {
  fr: {
    titre: 'Politique de confidentialité',
    contenu: `Texte provisoire, à valider par l’IAMA avant la mise en ligne.
## Données collectées
Les formulaires d’inscription et de contact collectent : nom, prénom, e-mail, téléphone, organisation, fonction et message. Ces données servent uniquement à traiter votre demande.
## Base légale et durée de conservation
Le traitement repose sur votre consentement, conformément à la loi n°2013-015 du 21 mai 2013 portant protection des données à caractère personnel en République du Mali.
## Vos droits
Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à info@iama.aero.
## Mesure d’audience
Le site utilise Matomo, hébergé sur le serveur de l’IAMA, sans cookie publicitaire.`,
  },
  en: {
    titre: 'Privacy policy',
    contenu: `Provisional text, to be approved by IAMA before going live.
## Data collected
The registration and contact forms collect: last name, first name, e-mail, phone, organisation, job title and message. This data is used only to process your request.
## Legal basis
Processing is based on your consent, in accordance with Malian law no. 2013-015 of 21 May 2013 on personal data protection.
## Your rights
You may request access to, correction or deletion of your data by writing to info@iama.aero.
## Audience measurement
The site uses Matomo, hosted on IAMA’s server, without advertising cookies.`,
  },
}
