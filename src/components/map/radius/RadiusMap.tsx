import React from "react";
import { Circle } from "react-leaflet";
import { Data } from "../../../types/data";

function RadiusMap({
  cities,
  populationSum,
}: {
  cities: Data[];
  populationSum: number;
}): JSX.Element {
  return (
    <>
      {cities.map((city) => {
        const population = parseInt(city.population);
        const radius = (population / populationSum) * 10000000;
        return (
          <Circle
            key={city.rank}
            center={[city.latitude, city.longitude]}
            radius={radius}
          />
        );
      })}
    </>
  );
}

export default RadiusMap;
