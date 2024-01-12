-- DropIndex
DROP INDEX "UQ_87b8888186ca9769c960e926870";

-- AlterTable
ALTER TABLE "translations" RENAME CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" TO "translations_pkey";

-- RenameIndex
ALTER INDEX "REL_5eb038a51b9cd6872359a687b1" RENAME TO "alternate_contact_mailing_address_id_key";

-- RenameIndex
ALTER INDEX "REL_194d0fca275b8661a56e486cb6" RENAME TO "applications_applicant_id_key";

-- RenameIndex
ALTER INDEX "REL_3a4c71bc34dce9f6c196f11093" RENAME TO "applications_accessibility_id_key";

-- RenameIndex
ALTER INDEX "REL_56abaa378952856aaccc64d7eb" RENAME TO "applications_alternate_contact_id_key";

-- RenameIndex
ALTER INDEX "REL_7fc41f89f22ca59ffceab5da80" RENAME TO "applications_alternate_address_id_key";

-- RenameIndex
ALTER INDEX "REL_b72ba26ebc88981f441b30fe3c" RENAME TO "applications_mailing_address_id_key";

-- RenameIndex
ALTER INDEX "REL_fed5da45b7b4dafd9f025a37dd" RENAME TO "applications_demographics_id_key";

-- RenameIndex
ALTER INDEX "REL_61b80a947c9db249548ba3c73a" RENAME TO "listings_utilities_id_key";

-- RenameIndex
ALTER INDEX "REL_ac59a58a02199c57a588f04583" RENAME TO "listings_features_id_key";

-- RenameIndex
ALTER INDEX "REL_4ca3d4c823e6bd5149ecaad363" RENAME TO "units_ami_chart_override_id_key";
