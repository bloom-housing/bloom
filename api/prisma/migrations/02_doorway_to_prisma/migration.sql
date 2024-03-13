CREATE TABLE "map_layers" (
      "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
      "name" TEXT NOT NULL,
      "jurisdiction_id" TEXT NOT NULL,
      "feature_collection" JSONB NOT NULL DEFAULT '{}',
      CONSTRAINT "map_layers_pkey" PRIMARY KEY ("id")
);
