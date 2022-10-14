import React, { useEffect } from "react";
import useCitiesStore from "../../../store/store";
import L from "leaflet";
import "leaflet.heat";
import { useLeafletContext } from "@react-leaflet/core";

type HeatLatLngTuple = [number, number, number];

function HeatMap(): null {
  const cities = useCitiesStore((store) => store.cities);
  const populationSum = useCitiesStore((store) => store.populationSum);
  const context = useLeafletContext();

  useEffect(() => {
    const container = context.layerContainer ?? context.map;

    if (cities.length > 1) {
      const points: HeatLatLngTuple[] = cities.map((city) => {
        const population = parseInt(city.population);
        const radius = ((population / populationSum) * 10) / 0.6410188667041;
        return [city.latitude, city.longitude, radius];
      });

      const heat = L.heatLayer(points, {
        gradient: { 0.1: "blue", 0.2: "yellow", 0.3: "red" },
      });
      container.addLayer(heat);
      return () => {
        container.removeLayer(heat);
      };
    }
  }, [cities]);

  return null;
}

export default HeatMap;
