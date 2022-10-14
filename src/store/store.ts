import create from "zustand";

interface City {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
}

const initialValue = [
  {
    city: "",
    growth_from_2000_to_2013: "",
    latitude: 0,
    longitude: 0,
    population: "1",
    rank: "",
    state: "",
  },
];

interface State {
  cities: City[];
  setCities: (newCities: City[]) => void;
  populationSum: number;
  setPopulationSum: (total: number) => void;
}

const useCitiesStore = create<State>((set) => ({
  cities: initialValue,
  setCities: (newCities: City[]) => set(() => ({ cities: newCities })),
  populationSum: 1,
  setPopulationSum: (total: number) =>
    set(() => ({
      populationSum: total,
    })),
}));

export default useCitiesStore;
