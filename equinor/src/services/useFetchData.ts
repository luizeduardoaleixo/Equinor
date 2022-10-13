import useSWR from "swr";

interface Data {
  city: string;
  growth_from_2000_to_2013: string;
  latitude: number;
  longitude: number;
  population: string;
  rank: string;
  state: string;
}

interface IFetchData {
  data?: Data[];
  isLoading: boolean;
  isError: any;
}

function useFetchData(url: string): IFetchData {
  const { data, error } = useSWR<Data[], any>(
    url,
    async (apiURL: string) =>
      await fetch(apiURL).then(async (res) => await res.json())
  );
  return {
    data,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    isLoading: !error && data == null,
    isError: error,
  };
}

export default useFetchData;
