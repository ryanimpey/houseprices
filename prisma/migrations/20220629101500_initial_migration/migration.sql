-- CreateTable
CREATE TABLE "places" (
    "region" TEXT NOT NULL,
    "long" TEXT,
    "lat" TEXT,
    "geometry" JSONB,

    CONSTRAINT "places_pkey" PRIMARY KEY ("region")
);

-- CreateTable
CREATE TABLE "prices" (
    "Date" TEXT NOT NULL,
    "Region_Name" TEXT NOT NULL,
    "Area_Code" TEXT,
    "Detached_Average_Price" DOUBLE PRECISION,
    "Detached_Index" DOUBLE PRECISION,
    "Detached_Monthly_Change" TEXT,
    "Detached_Annual_Change" TEXT,
    "Semi_Detached_Average_Price" DOUBLE PRECISION,
    "Semi_Detached_Index" DOUBLE PRECISION,
    "Semi_Detached_Monthly_Change" TEXT,
    "Semi_Detached_Annual_Change" TEXT,
    "Terraced_Average_Price" DOUBLE PRECISION,
    "Terraced_Index" DOUBLE PRECISION,
    "Terraced_Monthly_Change" TEXT,
    "Terraced_Annual_Change" TEXT,
    "Flat_Average_Price" DOUBLE PRECISION,
    "Flat_Index" DOUBLE PRECISION,
    "Flat_Monthly_Change" TEXT,
    "Flat_Annual_Change" TEXT,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("Region_Name","Date")
);

-- CreateTable
CREATE TABLE "districts" (
    "OBJECTID" BIGINT NOT NULL,
    "LAD21CD" TEXT,
    "LAD21NM" TEXT,
    "LAD21NMW" TEXT,
    "BNG_E" BIGINT,
    "BNG_N" BIGINT,
    "LONG" DOUBLE PRECISION,
    "LAT" DOUBLE PRECISION,
    "GlobalID" TEXT,
    "SHAPE_Length" DOUBLE PRECISION,
    "SHAPE_Area" DOUBLE PRECISION,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("OBJECTID")
);

-- CreateTable
CREATE TABLE "geojson" (
    "id" BIGSERIAL NOT NULL,
    "district" TEXT,
    "long" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "geometry" JSONB,

    CONSTRAINT "geojson_pkey" PRIMARY KEY ("id")
);
