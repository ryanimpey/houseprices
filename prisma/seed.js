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

var getStream = function () {
  const stream = fs.createReadStream(FILE_GEOJSON, { encoding: "utf8" });
  const parser = JSONStream.parse("features..*");
return stream.pipe(parser);
};

async function seedGeojson() {
const geojson = [];
return new Promise((resolve, reject) => {
  getStream()
    .pipe(
      es.mapSync(async function ({ properties, geometry }) {
        let item = {
          id: Number(properties["OBJECTID"]),
          district: String(properties["LAD21NM"]),
          long: Number(properties["LONG"]),
          lat: Number(properties["LAT"]),
          geometry,
        };

        if(item.id >= 311 && item.id <= 330) {
          geojson.push(item);
        }

      })
    )
    .on("end", () => resolve(geojson))
    .on("error", () => reject());
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
        records.push(
          {
            OBJECTID: Object.values(record)[0],
            LAD21CD: record['LAD21CD'],
            LAD21NM: record['LAD21NM'],
            LAD21NMW: record['LAD21NMW'],
            BNG_E: record['BNG_E'],
            BNG_N: record['BNG_N'],
            LONG: record['LONG'],
            LAT: record['LAT'],
            GlobalID: record['GlobalID'],
            SHAPE_Length: record['SHAPE_Length'],
            SHAPE_Area: record['SHAPE_Area'],
          }
        );
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
  await supabase.from("geojson").insert(geojson);
  
  const districts = await seedDistricts();
  await supabase.from("districts").insert(districts);
  
  const properties = await seedProperties();
   await supabase.from("prices").insert(properties);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
