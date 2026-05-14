-- CreateEnum
CREATE TYPE "household_member_relationship_enum" AS ENUM ('spouse', 'registeredDomesticPartner', 'parent', 'child', 'sibling', 'cousin', 'aunt', 'uncle', 'nephew', 'niece', 'grandparent', 'greatGrandparent', 'inLaw', 'friend', 'other', 'aideOrAttendant', 'spousePartner', 'girlfriendBoyfriend', 'brotherSister', 'auntUncle', 'nephewNiece', 'grandparentGreatGrandparent', 'liveInAide');

-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "visible_household_member_relationships" "household_member_relationship_enum"[] DEFAULT ARRAY['spouse', 'registeredDomesticPartner', 'parent', 'child', 'sibling', 'cousin', 'aunt', 'uncle', 'nephew', 'niece', 'grandparent', 'greatGrandparent', 'inLaw', 'friend', 'other', 'aideOrAttendant']::"household_member_relationship_enum"[];
