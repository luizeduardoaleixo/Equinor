import useSWR from "swr";
interface IFetchData {
  data: any;
  isLoading: boolean;
  isError: any;
}

function useFetchData(url: string): IFetchData {
  const { data, error } = useSWR<any, any>(
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
