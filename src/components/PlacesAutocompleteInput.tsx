/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Autocomplete } from "@mantine/core";
import { useEffect, useState } from "react";
// import { getMapboxSuggestions } from "../pages/api/search";
import useDebounce from "../hooks/useDebounce";

// export type for value output by handleLocationSelect
export type LocationResult = {
  value: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
};

interface PlacesAutocompleteInputProps {
  handleLocationSelect: (location: LocationResult) => void;
}

export default function PlacesAutocompleteInput({
  handleLocationSelect,
}: PlacesAutocompleteInputProps) {
  const [value, setValue] = useState<string>("");
  const [data, setData] = useState([]);

  const debouncedSearch = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedSearch) {
      async function fetchData() {
        const res = await fetch(
          `/api/search?${new URLSearchParams({
            searchText: debouncedSearch,
          }).toString()}`
        );

        const suggestionObject = await res.json();

        console.log(suggestionObject);

        const suggestions = suggestionObject?.features.map(
          (feature: {
            context: any[];
            place_name: any;
            center: any[];
            text: any;
          }) => {
            // god i hate this. should we replace mapbox? why can't i just get a straight "city, state, country"

            const region = feature.context.find(
              (context: { id: string | string[] }) =>
                context.id.includes("region")
            );

            const [country, state] = region.short_code.split("-");

            return {
              value: feature.place_name,
              lat: feature.center[1],
              lng: feature.center[0],
              country,
              state,
              city: feature.text,
            };
          }
        );

        setData(suggestions);
      }

      void fetchData();
    }
  }, [debouncedSearch]);

  return (
    <>
      <Autocomplete
        data={data}
        limit={8}
        value={value}
        onChange={(val) => setValue(val)}
        placeholder="Enter a location"
        onItemSubmit={(val) => handleLocationSelect(val)}
        size="xl"
        label="City"
      ></Autocomplete>
    </>
  );
}
