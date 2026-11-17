import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_formations_sessions_statut" AS ENUM('ouverte', 'complete', 'annulee');
  CREATE TYPE "public"."enum_formations_modalites" AS ENUM('presentiel', 'distanciel', 'mixte');
  CREATE TYPE "public"."enum_formations_type" AS ENUM('initiale', 'continue', 'sur-mesure');
  CREATE TYPE "public"."enum_formations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__formations_v_version_sessions_statut" AS ENUM('ouverte', 'complete', 'annulee');
  CREATE TYPE "public"."enum__formations_v_version_modalites" AS ENUM('presentiel', 'distanciel', 'mixte');
  CREATE TYPE "public"."enum__formations_v_version_type" AS ENUM('initiale', 'continue', 'sur-mesure');
  CREATE TYPE "public"."enum__formations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__formations_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_inscriptions_statut" AS ENUM('nouvelle', 'en-cours', 'confirmee', 'annulee');
  CREATE TYPE "public"."enum_inscriptions_langue" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_inscriptions_civilite" AS ENUM('M.', 'Mme');
  CREATE TYPE "public"."enum_inscriptions_paiement_statut" AS ENUM('non-requis', 'en-attente', 'paye', 'echoue', 'rembourse');
  CREATE TYPE "public"."enum_inscriptions_paiement_operateur" AS ENUM('orange-money', 'moov-money', 'wave', 'autre');
  CREATE TYPE "public"."enum_actualites_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__actualites_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__actualites_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_accreditations_organisme" AS ENUM('anac', 'iata', 'oaci', 'autre');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editeur');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'fr', 'en');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_parametres_reseaux_reseau" AS ENUM('facebook', 'linkedin', 'youtube', 'x', 'instagram', 'whatsapp');
  CREATE TABLE "formations_objectifs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar
  );
  
  CREATE TABLE "formations_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date_debut" timestamp(3) with time zone,
  	"date_fin" timestamp(3) with time zone,
  	"lieu" varchar DEFAULT 'IAMA, Bamako',
  	"places_total" numeric,
  	"places_restantes" numeric,
  	"statut" "enum_formations_sessions_statut" DEFAULT 'ouverte'
  );
  
  CREATE TABLE "formations_modalites" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_formations_modalites",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "formations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"brochure_id" integer,
  	"slug" varchar,
  	"domaine_id" integer,
  	"type" "enum_formations_type" DEFAULT 'initiale',
  	"duree_jours" numeric,
  	"duree_heures" numeric,
  	"prix" numeric,
  	"en_vedette" boolean DEFAULT false,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_formations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "formations_locales" (
  	"titre" varchar,
  	"resume" varchar,
  	"description" jsonb,
  	"public" varchar,
  	"prerequis" varchar,
  	"programme" jsonb,
  	"methodes" varchar,
  	"evaluation" varchar,
  	"validite" varchar,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "formations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"formateurs_id" integer,
  	"metiers_id" integer
  );
  
  CREATE TABLE "_formations_v_version_objectifs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"texte" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_formations_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date_debut" timestamp(3) with time zone,
  	"date_fin" timestamp(3) with time zone,
  	"lieu" varchar DEFAULT 'IAMA, Bamako',
  	"places_total" numeric,
  	"places_restantes" numeric,
  	"statut" "enum__formations_v_version_sessions_statut" DEFAULT 'ouverte',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_formations_v_version_modalites" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__formations_v_version_modalites",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_formations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_brochure_id" integer,
  	"version_slug" varchar,
  	"version_domaine_id" integer,
  	"version_type" "enum__formations_v_version_type" DEFAULT 'initiale',
  	"version_duree_jours" numeric,
  	"version_duree_heures" numeric,
  	"version_prix" numeric,
  	"version_en_vedette" boolean DEFAULT false,
  	"version_ordre" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__formations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__formations_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_formations_v_locales" (
  	"version_titre" varchar,
  	"version_resume" varchar,
  	"version_description" jsonb,
  	"version_public" varchar,
  	"version_prerequis" varchar,
  	"version_programme" jsonb,
  	"version_methodes" varchar,
  	"version_evaluation" varchar,
  	"version_validite" varchar,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_formations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"formateurs_id" integer,
  	"metiers_id" integer
  );
  
  CREATE TABLE "domaines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ordre" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "domaines_locales" (
  	"titre" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "metiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"ordre" numeric DEFAULT 0,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "metiers_locales" (
  	"titre" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "formateurs_expertises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texte" varchar NOT NULL
  );
  
  CREATE TABLE "formateurs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"photo_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "formateurs_locales" (
  	"fonction" varchar,
  	"biographie" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"statut" "enum_inscriptions_statut" DEFAULT 'nouvelle',
  	"langue" "enum_inscriptions_langue" DEFAULT 'fr',
  	"formation_id" integer NOT NULL,
  	"session_id" varchar,
  	"session_libelle" varchar,
  	"civilite" "enum_inscriptions_civilite",
  	"nom" varchar NOT NULL,
  	"prenom" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telephone" varchar NOT NULL,
  	"organisation" varchar,
  	"fonction" varchar,
  	"message" varchar,
  	"consentement" boolean DEFAULT false NOT NULL,
  	"notes_internes" varchar,
  	"paiement_statut" "enum_inscriptions_paiement_statut" DEFAULT 'non-requis',
  	"paiement_montant" numeric,
  	"paiement_operateur" "enum_inscriptions_paiement_operateur",
  	"paiement_reference_transaction" varchar,
  	"paiement_date_paiement" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telephone" varchar,
  	"organisation" varchar,
  	"sujet" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"consentement" boolean DEFAULT false NOT NULL,
  	"traite" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "actualites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_actualites_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "actualites_locales" (
  	"titre" varchar,
  	"extrait" varchar,
  	"contenu" jsonb,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_actualites_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__actualites_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__actualites_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_actualites_v_locales" (
  	"version_titre" varchar,
  	"version_extrait" varchar,
  	"version_contenu" jsonb,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"titre" varchar,
  	"chapeau" varchar,
  	"contenu" jsonb,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_titre" varchar,
  	"version_chapeau" varchar,
  	"version_contenu" jsonb,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "accreditations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organisme" "enum_accreditations_organisme",
  	"image_id" integer,
  	"document_id" integer,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "accreditations_locales" (
  	"titre" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partenaires" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"actionnaire" boolean DEFAULT false,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_vignette_url" varchar,
  	"sizes_vignette_width" numeric,
  	"sizes_vignette_height" numeric,
  	"sizes_vignette_mime_type" varchar,
  	"sizes_vignette_filesize" numeric,
  	"sizes_vignette_filename" varchar,
  	"sizes_carte_url" varchar,
  	"sizes_carte_width" numeric,
  	"sizes_carte_height" numeric,
  	"sizes_carte_mime_type" varchar,
  	"sizes_carte_filesize" numeric,
  	"sizes_carte_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'inscriptions' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'inscriptions' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"formations_id" integer,
  	"domaines_id" integer,
  	"metiers_id" integer,
  	"formateurs_id" integer,
  	"inscriptions_id" integer,
  	"messages_contact_id" integer,
  	"actualites_id" integer,
  	"pages_id" integer,
  	"accreditations_id" integer,
  	"partenaires_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "parametres_reseaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"reseau" "enum_parametres_reseaux_reseau",
  	"url" varchar
  );
  
  CREATE TABLE "parametres_chiffres_cles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" varchar NOT NULL
  );
  
  CREATE TABLE "parametres_chiffres_cles_locales" (
  	"libelle" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "parametres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_telephone" varchar,
  	"contact_mobile" varchar,
  	"contact_email" varchar,
  	"contact_carte_url" varchar,
  	"email_notifications" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "parametres_locales" (
  	"contact_adresse" varchar,
  	"contact_horaires" varchar,
  	"accroche" varchar,
  	"sous_titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "formations_objectifs" ADD CONSTRAINT "formations_objectifs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations_sessions" ADD CONSTRAINT "formations_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations_modalites" ADD CONSTRAINT "formations_modalites_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations" ADD CONSTRAINT "formations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formations" ADD CONSTRAINT "formations_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formations" ADD CONSTRAINT "formations_domaine_id_domaines_id_fk" FOREIGN KEY ("domaine_id") REFERENCES "public"."domaines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formations_locales" ADD CONSTRAINT "formations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations_rels" ADD CONSTRAINT "formations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations_rels" ADD CONSTRAINT "formations_rels_formateurs_fk" FOREIGN KEY ("formateurs_id") REFERENCES "public"."formateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formations_rels" ADD CONSTRAINT "formations_rels_metiers_fk" FOREIGN KEY ("metiers_id") REFERENCES "public"."metiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_version_objectifs" ADD CONSTRAINT "_formations_v_version_objectifs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_formations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_version_sessions" ADD CONSTRAINT "_formations_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_formations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_version_modalites" ADD CONSTRAINT "_formations_v_version_modalites_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_formations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v" ADD CONSTRAINT "_formations_v_parent_id_formations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."formations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_formations_v" ADD CONSTRAINT "_formations_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_formations_v" ADD CONSTRAINT "_formations_v_version_brochure_id_media_id_fk" FOREIGN KEY ("version_brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_formations_v" ADD CONSTRAINT "_formations_v_version_domaine_id_domaines_id_fk" FOREIGN KEY ("version_domaine_id") REFERENCES "public"."domaines"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_formations_v_locales" ADD CONSTRAINT "_formations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_formations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_rels" ADD CONSTRAINT "_formations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_formations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_rels" ADD CONSTRAINT "_formations_v_rels_formateurs_fk" FOREIGN KEY ("formateurs_id") REFERENCES "public"."formateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_formations_v_rels" ADD CONSTRAINT "_formations_v_rels_metiers_fk" FOREIGN KEY ("metiers_id") REFERENCES "public"."metiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "domaines_locales" ADD CONSTRAINT "domaines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."domaines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metiers" ADD CONSTRAINT "metiers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "metiers_locales" ADD CONSTRAINT "metiers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formateurs_expertises" ADD CONSTRAINT "formateurs_expertises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formateurs" ADD CONSTRAINT "formateurs_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "formateurs_locales" ADD CONSTRAINT "formateurs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_formation_id_formations_id_fk" FOREIGN KEY ("formation_id") REFERENCES "public"."formations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "actualites" ADD CONSTRAINT "actualites_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "actualites_locales" ADD CONSTRAINT "actualites_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."actualites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_actualites_v" ADD CONSTRAINT "_actualites_v_parent_id_actualites_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."actualites"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_actualites_v" ADD CONSTRAINT "_actualites_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_actualites_v_locales" ADD CONSTRAINT "_actualites_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_actualites_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accreditations" ADD CONSTRAINT "accreditations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accreditations" ADD CONSTRAINT "accreditations_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accreditations_locales" ADD CONSTRAINT "accreditations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accreditations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partenaires" ADD CONSTRAINT "partenaires_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formations_fk" FOREIGN KEY ("formations_id") REFERENCES "public"."formations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_domaines_fk" FOREIGN KEY ("domaines_id") REFERENCES "public"."domaines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_metiers_fk" FOREIGN KEY ("metiers_id") REFERENCES "public"."metiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formateurs_fk" FOREIGN KEY ("formateurs_id") REFERENCES "public"."formateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inscriptions_fk" FOREIGN KEY ("inscriptions_id") REFERENCES "public"."inscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_contact_fk" FOREIGN KEY ("messages_contact_id") REFERENCES "public"."messages_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_actualites_fk" FOREIGN KEY ("actualites_id") REFERENCES "public"."actualites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accreditations_fk" FOREIGN KEY ("accreditations_id") REFERENCES "public"."accreditations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partenaires_fk" FOREIGN KEY ("partenaires_id") REFERENCES "public"."partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parametres_reseaux" ADD CONSTRAINT "parametres_reseaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."parametres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parametres_chiffres_cles" ADD CONSTRAINT "parametres_chiffres_cles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."parametres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parametres_chiffres_cles_locales" ADD CONSTRAINT "parametres_chiffres_cles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."parametres_chiffres_cles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parametres_locales" ADD CONSTRAINT "parametres_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."parametres"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "formations_objectifs_order_idx" ON "formations_objectifs" USING btree ("_order");
  CREATE INDEX "formations_objectifs_parent_id_idx" ON "formations_objectifs" USING btree ("_parent_id");
  CREATE INDEX "formations_objectifs_locale_idx" ON "formations_objectifs" USING btree ("_locale");
  CREATE INDEX "formations_sessions_order_idx" ON "formations_sessions" USING btree ("_order");
  CREATE INDEX "formations_sessions_parent_id_idx" ON "formations_sessions" USING btree ("_parent_id");
  CREATE INDEX "formations_modalites_order_idx" ON "formations_modalites" USING btree ("order");
  CREATE INDEX "formations_modalites_parent_idx" ON "formations_modalites" USING btree ("parent_id");
  CREATE INDEX "formations_image_idx" ON "formations" USING btree ("image_id");
  CREATE INDEX "formations_brochure_idx" ON "formations" USING btree ("brochure_id");
  CREATE UNIQUE INDEX "formations_slug_idx" ON "formations" USING btree ("slug");
  CREATE INDEX "formations_domaine_idx" ON "formations" USING btree ("domaine_id");
  CREATE INDEX "formations_updated_at_idx" ON "formations" USING btree ("updated_at");
  CREATE INDEX "formations_created_at_idx" ON "formations" USING btree ("created_at");
  CREATE INDEX "formations__status_idx" ON "formations" USING btree ("_status");
  CREATE UNIQUE INDEX "formations_locales_locale_parent_id_unique" ON "formations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "formations_locales_parent_id_idx" ON "formations_locales" USING btree ("_parent_id");
  CREATE INDEX "formations_rels_order_idx" ON "formations_rels" USING btree ("order");
  CREATE INDEX "formations_rels_parent_idx" ON "formations_rels" USING btree ("parent_id");
  CREATE INDEX "formations_rels_path_idx" ON "formations_rels" USING btree ("path");
  CREATE INDEX "formations_rels_formateurs_id_idx" ON "formations_rels" USING btree ("formateurs_id");
  CREATE INDEX "formations_rels_metiers_id_idx" ON "formations_rels" USING btree ("metiers_id");
  CREATE INDEX "_formations_v_version_objectifs_order_idx" ON "_formations_v_version_objectifs" USING btree ("_order");
  CREATE INDEX "_formations_v_version_objectifs_parent_id_idx" ON "_formations_v_version_objectifs" USING btree ("_parent_id");
  CREATE INDEX "_formations_v_version_objectifs_locale_idx" ON "_formations_v_version_objectifs" USING btree ("_locale");
  CREATE INDEX "_formations_v_version_sessions_order_idx" ON "_formations_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_formations_v_version_sessions_parent_id_idx" ON "_formations_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_formations_v_version_modalites_order_idx" ON "_formations_v_version_modalites" USING btree ("order");
  CREATE INDEX "_formations_v_version_modalites_parent_idx" ON "_formations_v_version_modalites" USING btree ("parent_id");
  CREATE INDEX "_formations_v_parent_idx" ON "_formations_v" USING btree ("parent_id");
  CREATE INDEX "_formations_v_version_version_image_idx" ON "_formations_v" USING btree ("version_image_id");
  CREATE INDEX "_formations_v_version_version_brochure_idx" ON "_formations_v" USING btree ("version_brochure_id");
  CREATE INDEX "_formations_v_version_version_slug_idx" ON "_formations_v" USING btree ("version_slug");
  CREATE INDEX "_formations_v_version_version_domaine_idx" ON "_formations_v" USING btree ("version_domaine_id");
  CREATE INDEX "_formations_v_version_version_updated_at_idx" ON "_formations_v" USING btree ("version_updated_at");
  CREATE INDEX "_formations_v_version_version_created_at_idx" ON "_formations_v" USING btree ("version_created_at");
  CREATE INDEX "_formations_v_version_version__status_idx" ON "_formations_v" USING btree ("version__status");
  CREATE INDEX "_formations_v_created_at_idx" ON "_formations_v" USING btree ("created_at");
  CREATE INDEX "_formations_v_updated_at_idx" ON "_formations_v" USING btree ("updated_at");
  CREATE INDEX "_formations_v_snapshot_idx" ON "_formations_v" USING btree ("snapshot");
  CREATE INDEX "_formations_v_published_locale_idx" ON "_formations_v" USING btree ("published_locale");
  CREATE INDEX "_formations_v_latest_idx" ON "_formations_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_formations_v_locales_locale_parent_id_unique" ON "_formations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_formations_v_locales_parent_id_idx" ON "_formations_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_formations_v_rels_order_idx" ON "_formations_v_rels" USING btree ("order");
  CREATE INDEX "_formations_v_rels_parent_idx" ON "_formations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_formations_v_rels_path_idx" ON "_formations_v_rels" USING btree ("path");
  CREATE INDEX "_formations_v_rels_formateurs_id_idx" ON "_formations_v_rels" USING btree ("formateurs_id");
  CREATE INDEX "_formations_v_rels_metiers_id_idx" ON "_formations_v_rels" USING btree ("metiers_id");
  CREATE UNIQUE INDEX "domaines_slug_idx" ON "domaines" USING btree ("slug");
  CREATE INDEX "domaines_updated_at_idx" ON "domaines" USING btree ("updated_at");
  CREATE INDEX "domaines_created_at_idx" ON "domaines" USING btree ("created_at");
  CREATE UNIQUE INDEX "domaines_locales_locale_parent_id_unique" ON "domaines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "domaines_locales_parent_id_idx" ON "domaines_locales" USING btree ("_parent_id");
  CREATE INDEX "metiers_image_idx" ON "metiers" USING btree ("image_id");
  CREATE UNIQUE INDEX "metiers_slug_idx" ON "metiers" USING btree ("slug");
  CREATE INDEX "metiers_updated_at_idx" ON "metiers" USING btree ("updated_at");
  CREATE INDEX "metiers_created_at_idx" ON "metiers" USING btree ("created_at");
  CREATE UNIQUE INDEX "metiers_locales_locale_parent_id_unique" ON "metiers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "metiers_locales_parent_id_idx" ON "metiers_locales" USING btree ("_parent_id");
  CREATE INDEX "formateurs_expertises_order_idx" ON "formateurs_expertises" USING btree ("_order");
  CREATE INDEX "formateurs_expertises_parent_id_idx" ON "formateurs_expertises" USING btree ("_parent_id");
  CREATE INDEX "formateurs_expertises_locale_idx" ON "formateurs_expertises" USING btree ("_locale");
  CREATE INDEX "formateurs_photo_idx" ON "formateurs" USING btree ("photo_id");
  CREATE UNIQUE INDEX "formateurs_slug_idx" ON "formateurs" USING btree ("slug");
  CREATE INDEX "formateurs_updated_at_idx" ON "formateurs" USING btree ("updated_at");
  CREATE INDEX "formateurs_created_at_idx" ON "formateurs" USING btree ("created_at");
  CREATE UNIQUE INDEX "formateurs_locales_locale_parent_id_unique" ON "formateurs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "formateurs_locales_parent_id_idx" ON "formateurs_locales" USING btree ("_parent_id");
  CREATE INDEX "inscriptions_formation_idx" ON "inscriptions" USING btree ("formation_id");
  CREATE INDEX "inscriptions_updated_at_idx" ON "inscriptions" USING btree ("updated_at");
  CREATE INDEX "inscriptions_created_at_idx" ON "inscriptions" USING btree ("created_at");
  CREATE INDEX "messages_contact_updated_at_idx" ON "messages_contact" USING btree ("updated_at");
  CREATE INDEX "messages_contact_created_at_idx" ON "messages_contact" USING btree ("created_at");
  CREATE INDEX "actualites_image_idx" ON "actualites" USING btree ("image_id");
  CREATE UNIQUE INDEX "actualites_slug_idx" ON "actualites" USING btree ("slug");
  CREATE INDEX "actualites_updated_at_idx" ON "actualites" USING btree ("updated_at");
  CREATE INDEX "actualites_created_at_idx" ON "actualites" USING btree ("created_at");
  CREATE INDEX "actualites__status_idx" ON "actualites" USING btree ("_status");
  CREATE UNIQUE INDEX "actualites_locales_locale_parent_id_unique" ON "actualites_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "actualites_locales_parent_id_idx" ON "actualites_locales" USING btree ("_parent_id");
  CREATE INDEX "_actualites_v_parent_idx" ON "_actualites_v" USING btree ("parent_id");
  CREATE INDEX "_actualites_v_version_version_image_idx" ON "_actualites_v" USING btree ("version_image_id");
  CREATE INDEX "_actualites_v_version_version_slug_idx" ON "_actualites_v" USING btree ("version_slug");
  CREATE INDEX "_actualites_v_version_version_updated_at_idx" ON "_actualites_v" USING btree ("version_updated_at");
  CREATE INDEX "_actualites_v_version_version_created_at_idx" ON "_actualites_v" USING btree ("version_created_at");
  CREATE INDEX "_actualites_v_version_version__status_idx" ON "_actualites_v" USING btree ("version__status");
  CREATE INDEX "_actualites_v_created_at_idx" ON "_actualites_v" USING btree ("created_at");
  CREATE INDEX "_actualites_v_updated_at_idx" ON "_actualites_v" USING btree ("updated_at");
  CREATE INDEX "_actualites_v_snapshot_idx" ON "_actualites_v" USING btree ("snapshot");
  CREATE INDEX "_actualites_v_published_locale_idx" ON "_actualites_v" USING btree ("published_locale");
  CREATE INDEX "_actualites_v_latest_idx" ON "_actualites_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_actualites_v_locales_locale_parent_id_unique" ON "_actualites_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_actualites_v_locales_parent_id_idx" ON "_actualites_v_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_image_idx" ON "pages" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_image_idx" ON "_pages_v" USING btree ("version_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "accreditations_image_idx" ON "accreditations" USING btree ("image_id");
  CREATE INDEX "accreditations_document_idx" ON "accreditations" USING btree ("document_id");
  CREATE INDEX "accreditations_updated_at_idx" ON "accreditations" USING btree ("updated_at");
  CREATE INDEX "accreditations_created_at_idx" ON "accreditations" USING btree ("created_at");
  CREATE UNIQUE INDEX "accreditations_locales_locale_parent_id_unique" ON "accreditations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accreditations_locales_parent_id_idx" ON "accreditations_locales" USING btree ("_parent_id");
  CREATE INDEX "partenaires_logo_idx" ON "partenaires" USING btree ("logo_id");
  CREATE INDEX "partenaires_updated_at_idx" ON "partenaires" USING btree ("updated_at");
  CREATE INDEX "partenaires_created_at_idx" ON "partenaires" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_vignette_sizes_vignette_filename_idx" ON "media" USING btree ("sizes_vignette_filename");
  CREATE INDEX "media_sizes_carte_sizes_carte_filename_idx" ON "media" USING btree ("sizes_carte_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_formations_id_idx" ON "payload_locked_documents_rels" USING btree ("formations_id");
  CREATE INDEX "payload_locked_documents_rels_domaines_id_idx" ON "payload_locked_documents_rels" USING btree ("domaines_id");
  CREATE INDEX "payload_locked_documents_rels_metiers_id_idx" ON "payload_locked_documents_rels" USING btree ("metiers_id");
  CREATE INDEX "payload_locked_documents_rels_formateurs_id_idx" ON "payload_locked_documents_rels" USING btree ("formateurs_id");
  CREATE INDEX "payload_locked_documents_rels_inscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("inscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_messages_contact_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_contact_id");
  CREATE INDEX "payload_locked_documents_rels_actualites_id_idx" ON "payload_locked_documents_rels" USING btree ("actualites_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_accreditations_id_idx" ON "payload_locked_documents_rels" USING btree ("accreditations_id");
  CREATE INDEX "payload_locked_documents_rels_partenaires_id_idx" ON "payload_locked_documents_rels" USING btree ("partenaires_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "parametres_reseaux_order_idx" ON "parametres_reseaux" USING btree ("_order");
  CREATE INDEX "parametres_reseaux_parent_id_idx" ON "parametres_reseaux" USING btree ("_parent_id");
  CREATE INDEX "parametres_chiffres_cles_order_idx" ON "parametres_chiffres_cles" USING btree ("_order");
  CREATE INDEX "parametres_chiffres_cles_parent_id_idx" ON "parametres_chiffres_cles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "parametres_chiffres_cles_locales_locale_parent_id_unique" ON "parametres_chiffres_cles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "parametres_chiffres_cles_locales_parent_id_idx" ON "parametres_chiffres_cles_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "parametres_locales_locale_parent_id_unique" ON "parametres_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "parametres_locales_parent_id_idx" ON "parametres_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "formations_objectifs" CASCADE;
  DROP TABLE "formations_sessions" CASCADE;
  DROP TABLE "formations_modalites" CASCADE;
  DROP TABLE "formations" CASCADE;
  DROP TABLE "formations_locales" CASCADE;
  DROP TABLE "formations_rels" CASCADE;
  DROP TABLE "_formations_v_version_objectifs" CASCADE;
  DROP TABLE "_formations_v_version_sessions" CASCADE;
  DROP TABLE "_formations_v_version_modalites" CASCADE;
  DROP TABLE "_formations_v" CASCADE;
  DROP TABLE "_formations_v_locales" CASCADE;
  DROP TABLE "_formations_v_rels" CASCADE;
  DROP TABLE "domaines" CASCADE;
  DROP TABLE "domaines_locales" CASCADE;
  DROP TABLE "metiers" CASCADE;
  DROP TABLE "metiers_locales" CASCADE;
  DROP TABLE "formateurs_expertises" CASCADE;
  DROP TABLE "formateurs" CASCADE;
  DROP TABLE "formateurs_locales" CASCADE;
  DROP TABLE "inscriptions" CASCADE;
  DROP TABLE "messages_contact" CASCADE;
  DROP TABLE "actualites" CASCADE;
  DROP TABLE "actualites_locales" CASCADE;
  DROP TABLE "_actualites_v" CASCADE;
  DROP TABLE "_actualites_v_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "accreditations" CASCADE;
  DROP TABLE "accreditations_locales" CASCADE;
  DROP TABLE "partenaires" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "parametres_reseaux" CASCADE;
  DROP TABLE "parametres_chiffres_cles" CASCADE;
  DROP TABLE "parametres_chiffres_cles_locales" CASCADE;
  DROP TABLE "parametres" CASCADE;
  DROP TABLE "parametres_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_formations_sessions_statut";
  DROP TYPE "public"."enum_formations_modalites";
  DROP TYPE "public"."enum_formations_type";
  DROP TYPE "public"."enum_formations_status";
  DROP TYPE "public"."enum__formations_v_version_sessions_statut";
  DROP TYPE "public"."enum__formations_v_version_modalites";
  DROP TYPE "public"."enum__formations_v_version_type";
  DROP TYPE "public"."enum__formations_v_version_status";
  DROP TYPE "public"."enum__formations_v_published_locale";
  DROP TYPE "public"."enum_inscriptions_statut";
  DROP TYPE "public"."enum_inscriptions_langue";
  DROP TYPE "public"."enum_inscriptions_civilite";
  DROP TYPE "public"."enum_inscriptions_paiement_statut";
  DROP TYPE "public"."enum_inscriptions_paiement_operateur";
  DROP TYPE "public"."enum_actualites_status";
  DROP TYPE "public"."enum__actualites_v_version_status";
  DROP TYPE "public"."enum__actualites_v_published_locale";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_accreditations_organisme";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_parametres_reseaux_reseau";`)
}
