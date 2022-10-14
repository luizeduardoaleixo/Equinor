import React from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import useCitiesStore from "../../store/store";

import HeatMap from "./heat/HeatMap";
import RadiusMap from "./radius/RadiusMap";

function Maps(): JSX.Element {
  const cities = useCitiesStore((store) => store.cities);
  const populationSum = useCitiesStore((store) => store.populationSum);
  console.log("pop");

  return (
    <MapContainer
      center={[40.806862, -96.681679]}
      zoom={4}
      scrollWheelZoom={false}
      style={{ width: "50vw", height: "50vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LayersControl position="topright">
        <LayersControl.Overlay name="heat">
          <LayerGroup>
            <HeatMap></HeatMap>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="radius">
          <LayerGroup>
            <RadiusMap
              cities={cities}
              populationSum={populationSum}
            ></RadiusMap>
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default Maps;
