/* eslint-disable @typescript-eslint/require-await */
import type { NextRequest } from "next/server.js";
import { env } from "../../env/server.mjs";

const mapboxParams = {
  country: "us",
  proximity: "ip",
  types: "postcode,place",
  access_token: env.MAPBOX_API_KEY,
};

export async function getMapboxSuggestions(input: string) {
  const encodedInput = encodeURIComponent(input);
  const mapboxUrl = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedInput}.json`
  );

  mapboxUrl.searchParams.set("country", mapboxParams.country);
  mapboxUrl.searchParams.set("proximity", mapboxParams.proximity);
  mapboxUrl.searchParams.set("types", mapboxParams.types);
  mapboxUrl.searchParams.set("access_token", mapboxParams.access_token);

  const data = await fetch(mapboxUrl);

  if (!data.ok) throw new Error("Failed to fetch suggestions");

  const json = await data.json();

  return json;
}

export default async function handler(req: NextRequest, res) {
  // const data = await fetch(mapboxUrl);

  // const json = await data.json();

  const { query } = req;

  const suggestions = await getMapboxSuggestions(query.searchText);

  res.status(200).json(suggestions);
}
