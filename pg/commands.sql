CREATE TABLE "projets" (
    "id" SERIAL PRIMARY KEY,
    "index" TEXT,
    "epi" TEXT,
    "ar" TEXT,
    "et" TEXT,
    "nbr_boite" TEXT,
    "name_project" TEXT,
    "etude" TEXT,
    "date" TEXT,
    "secteur" TEXT,
    "ti" TEXT,
    "name_document" TEXT,
    "nbr_document_a3" TEXT,
    "nbr_document_a4" TEXT,
    "nbr_plan" TEXT,
    "type_document_a3" TEXT,
    "type_document_a4" TEXT,
    "type_document_a0" TEXT,
    "nbr_copy" TEXT,
    "nbr_exemplaire" TEXT,
    "nbr_folder" TEXT,
    "salle" TEXT,
    "created_by_id" INTEGER,
    "last_update_by_id" INTEGER,
    "status" VARCHAR,
    "created_at" TIMESTAMP,
    "motif" TEXT
);

CREATE TABLE "projets2" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "type" TEXT,
    "year" VARCHAR,
    "secteur" TEXT,
    "mappe" TEXT,
    "producer" TEXT,
    "scale" TEXT,
    "sheet" TEXT,
    "salle" TEXT,
    "tranche" TEXT,
    "index" TEXT,
    "nature" TEXT,
    "created_by_id" INTEGER,
    "last_update_by_id" INTEGER,
    "status" VARCHAR,
    "created_at" TIMESTAMP,
    "motif" TEXT
);

CREATE TABLE "projets_files" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "path" TEXT,
    "type" TEXT,
    "extension_type" TEXT,
    "created_by_id" INTEGER,
    "last_update_by_id" INTEGER,
    "project_id" INTEGER,
    "created_at" TIMESTAMP
);


CREATE TABLE "projets2_files" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "path" TEXT,
    "type" TEXT,
    "extension_type" TEXT,
    "created_by_id" INTEGER,
    "last_update_by_id" INTEGER,
    "project_id" INTEGER,
    "created_at" TIMESTAMP
);

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "fname" VARCHAR(100) NOT NULL,
    "lname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "poste_ormvag" VARCHAR(150),
    "last_connection" TIMESTAMP
);

INSERT INTO "users" (
  "fname", "lname", "email", "password", "role", "created_at", "updated_at", "poste_ormvag"
) VALUES (
  'Ali', 'Mbarek', 'administrateur@ormvag.ma', 
  '$2b$10$ZoNohtTUGdwBFJiVRTMYKuO7AncN7fYzL.O9xQBNgHqAPsn0piEqS', 
  'admin', 
  '2025-05-21 09:45:41.139045', 
  '2025-05-21 09:45:41.139045', 
  'Chef de services'
);



-- INSERT DATA



ALTER TABLE "projets"
ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "projets2"
ALTER COLUMN "status" SET DEFAULT 'pending';

ALTER TABLE "projets"
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "projets2"
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "projets_files"
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "projets2_files"
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

SELECT setval(pg_get_serial_sequence('projets', 'id'), (SELECT MAX("id") FROM "projets"));
SELECT setval(pg_get_serial_sequence('projets2', 'id'), (SELECT MAX("id") FROM "projets2"));
SELECT setval(pg_get_serial_sequence('projets_files', 'id'), (SELECT MAX("id") FROM "projets_files"));
SELECT setval(pg_get_serial_sequence('projets2_files', 'id'), (SELECT MAX("id") FROM "projets2_files"));

