require('dotenv').config()

const fs = require("fs");
const es = require("event-stream");
const csv = require("csv-parse");
const JSONStream = require("JSONStream");

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_SERVICE_KEY);

const FILE_GEOJSON = "./prisma/seed/Local_Authority_Districts_(December_2021)_GB_BFC.geojson";
const FILE_PROPERTY_PRICES = "./prisma/seed/Average-prices-Property-Type-2022-04.csv";
const FILE_DISTRICTS = "./prisma/seed/Local_Authority_Districts_(December_2021)_GB_BFC.csv";

async function seedGeojson() {
  const geojson = [];
  const stream = fs.createReadStream(FILE_GEOJSON, { encoding: "utf8" });
  const parser = JSONStream.parse("features..*");

  return new Promise((resolve, reject) => {
    return stream.pipe(parser)
      .pipe(
        es.mapSync(async function ({ properties, geometry }) {
          let item = {
            id: Number(properties["OBJECTID"]),
            district: String(properties["LAD21NM"]),
            long: Number(properties["LONG"]),
            lat: Number(properties["LAT"]),
            geometry,
          };

          geojson.push(item);
        })
      )
      .on("end", () => resolve(geojson))
      .on("error", () => reject(error));
  });
}

async function seedDistricts() {
  return new Promise((resolve, reject) => {
    const parser = fs
      .createReadStream(FILE_DISTRICTS)
      .pipe(
        csv.parse({
          columns: true,
          relax_quotes: true,
          escape: "\\",
          ltrim: true,
          rtrim: true,
        })
      );

    const records = [];

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on("error", function (err) {
      reject(err);
    });

    parser.on("end", function () {
      resolve(records);
    });
  });
}

async function seedProperties() {
  return new Promise((resolve, reject) => {
    const parser = fs
      .createReadStream(FILE_PROPERTY_PRICES)
      .pipe(
        csv.parse({
          columns: true,
          relax_quotes: true,
          escape: "\\",
          ltrim: true,
          rtrim: true,
        })
      );

    const records = [];

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on("error", function (err) {
      reject(err);
    });

    parser.on("end", function () {
      resolve(records);
    });
  });
}

async function seed() {
  const geojson = await seedGeojson();
  console.log(geojson[0], geojson.length);

  const districts = await seedDistricts();
  console.log(districts[0], districts.length);

  const properties = await seedProperties();
  console.log(properties[0], properties.length);
  // const upload = await supabase.from("geojson").insert(geojson);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
