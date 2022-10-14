import React, { useEffect } from "react";
import "./App.css";
import Maps from "./components/map/Maps";
import useFetchData from "./services/useFetchData";
import useCitiesStore from "./store/store";
import { Data } from "./types/data";

const url =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

function App(): JSX.Element {
  const { data, isLoading, isError } = useFetchData(url);

  const setCities = useCitiesStore((store) => store.setCities);
  const setPopulationSum = useCitiesStore((store) => store.setPopulationSum);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isLoading && !isError) {
      setCities(data);
      const populationSum = data.reduce(
        (acc: number, city: Data) => acc + parseInt(city.population),
        0
      );
      setPopulationSum(populationSum);
      console.log(populationSum, "populationSum");
    }
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <Maps></Maps>
      </header>
    </div>
  );
}

export default App;
