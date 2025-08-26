-- AlterTable
ALTER TABLE "jurisdictions" 
ADD COLUMN "what_to_expect" TEXT NOT NULL DEFAULT 'Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.',
ADD COLUMN "what_to_expect_additional_text" TEXT NOT NULL DEFAULT '',
ADD COLUMN "what_to_expect_under_construction" TEXT NOT NULL DEFAULT '';