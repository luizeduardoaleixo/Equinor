import React, { useEffect, useState } from "react";
import "./App.css";
import Chart from "./components/chart/Chart";
import Maps from "./components/map/Maps";
import useFetchData from "./services/useFetchData";
import useCitiesStore from "./store/store";
import { Data } from "./types/data";
import { AiOutlineDotChart } from "react-icons/ai";
import { BiMap } from "react-icons/bi";

const url =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

function App(): JSX.Element {
  const { data, isLoading, isError } = useFetchData(url);

  const setCities = useCitiesStore((store) => store.setCities);
  const setPopulationSum = useCitiesStore((store) => store.setPopulationSum);
  const [displayMap, setDisplayMap] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isLoading && !isError) {
      setCities(data);
      const populationSum = data.reduce(
        (acc: number, city: Data) => acc + parseInt(city.population),
        0
      );
      setPopulationSum(populationSum);
    }
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div className="sideBar">
            <button className="button" onClick={() => setDisplayMap(true)}>
              <BiMap size={30}></BiMap>
              Map
            </button>

            <button
              className="button"
              style={{
                marginTop: "20px",
              }}
              onClick={() => setDisplayMap(false)}
            >
              <AiOutlineDotChart size={30}></AiOutlineDotChart>
              Chart
            </button>
          </div>
          {displayMap ? (
            <div>
              <Maps></Maps>
            </div>
          ) : (
            <div>
              <Chart></Chart>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
