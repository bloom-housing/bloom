-- CreateEnum
CREATE TYPE "spoken_language_enum" AS ENUM ('chineseCantonese', 'chineseMandarin', 'english', 'filipino', 'korean', 'russian', 'spanish', 'vietnamese', 'farsi', 'afghani', 'notListed');

-- AlterTable
ALTER TABLE "demographic_snapshot" ADD COLUMN     "spoken_language" TEXT;

-- AlterTable
ALTER TABLE "demographics" ADD COLUMN     "spoken_language" TEXT;

-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "visible_spoken_languages" "spoken_language_enum"[] DEFAULT ARRAY['chineseCantonese', 'chineseMandarin', 'english', 'filipino', 'korean', 'russian', 'spanish', 'vietnamese', 'farsi', 'afghani', 'notListed']::"spoken_language_enum"[];
