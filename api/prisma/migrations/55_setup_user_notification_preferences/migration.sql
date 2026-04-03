-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "user_id" UUID NOT NULL,
    "lottery" BOOLEAN DEFAULT false,
    "waitlist" BOOLEAN DEFAULT false,
    "mobility" BOOLEAN DEFAULT false,
    "hearing" BOOLEAN DEFAULT false,
    "vision" BOOLEAN DEFAULT false,
    "hearing_and_vision" BOOLEAN DEFAULT false,
    "mobility_and_hearing" BOOLEAN DEFAULT false,
    "mobility_and_vision" BOOLEAN DEFAULT false,
    "mobility_hearing_and_vision" BOOLEAN DEFAULT false,
    "wants_region_notifs" BOOLEAN DEFAULT false,
    "regions" TEXT[],

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "user_notification_preferences_user_id_idx" ON "user_notification_preferences"("user_id");

-- Setup partial indexes on all boolean columns to optimize queries that filter on true values
CREATE INDEX "user_notification_preferences_lottery_idx" ON "user_notification_preferences"("lottery") WHERE "lottery" = true;
CREATE INDEX "user_notification_preferences_waitlist_idx" ON "user_notification_preferences"("waitlist") WHERE "waitlist" = true;
CREATE INDEX "user_notification_preferences_mobility_idx" ON "user_notification_preferences"("mobility") WHERE "mobility" = true;
CREATE INDEX "user_notification_preferences_hearing_idx" ON "user_notification_preferences"("hearing") WHERE "hearing" = true;
CREATE INDEX "user_notification_preferences_vision_idx" ON "user_notification_preferences"("vision") WHERE "vision" = true;
CREATE INDEX "user_notification_preferences_hearing_and_vision_idx" ON "user_notification_preferences"("hearing_and_vision") WHERE "hearing_and_vision" = true;
CREATE INDEX "user_notification_preferences_mobility_and_hearing_idx" ON "user_notification_preferences"("mobility_and_hearing") WHERE "mobility_and_hearing" = true;
CREATE INDEX "user_notification_preferences_mobility_and_vision_idx" ON "user_notification_preferences"("mobility_and_vision") WHERE "mobility_and_vision" = true;
CREATE INDEX "user_notification_preferences_mobility_hearing_vision_idx" ON "user_notification_preferences"("mobility_hearing_and_vision") WHERE "mobility_hearing_and_vision" = true;
CREATE INDEX "user_notification_preferences_wants_region_notifs_idx" ON "user_notification_preferences"("wants_region_notifs") WHERE "wants_region_notifs" = true;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE TABLE "user_notification_preferences_snapshot" (
    "user_id" UUID NOT NULL,
    "lottery" BOOLEAN DEFAULT false,
    "waitlist" BOOLEAN DEFAULT false,
    "mobility" BOOLEAN DEFAULT false,
    "hearing" BOOLEAN DEFAULT false,
    "vision" BOOLEAN DEFAULT false,
    "hearing_and_vision" BOOLEAN DEFAULT false,
    "mobility_and_hearing" BOOLEAN DEFAULT false,
    "mobility_and_vision" BOOLEAN DEFAULT false,
    "mobility_hearing_and_vision" BOOLEAN DEFAULT false,
    "wants_region_notifs" BOOLEAN DEFAULT false,
    "regions" TEXT[],

    CONSTRAINT "user_notification_preferences_snapshot_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "user_notification_preferences_snapshot" ADD CONSTRAINT "user_notification_preferences_snapshot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account_snapshot"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
