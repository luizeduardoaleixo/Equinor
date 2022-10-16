/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useMemo, useState } from "react";
import useCitiesStore from "../../store/store";
import Plot from "react-plotly.js";
import { Annotations, ButtonClickEvent, Data } from "plotly.js";

type ButtonClicked = "typeNone" | "typeAbsolute" | "typeGrowth";

interface ICartData {
  typeNone: Data;
  typeAbsolute: Data;
  typeGrowth: Data;
}

const filterEmptyObjects: any = (arr: any[]) => {
  return arr.filter((element: any) => {
    if (Object.keys(element).length !== 0) {
      return true;
    }
    return false;
  });
};

function Chart(): JSX.Element {
  const cities = useCitiesStore((store) => store.cities);
  const populationSum = useCitiesStore((store) => store.populationSum);
  const [buttonClicked, setButtonClicked] = useState<ButtonClicked>("typeNone");
  const [activeTypeButton, setActiveTypeButton] = useState(0);
  const [activeGroupByButton, setActiveGroupByButton] = useState(0);
  const [activeFilterButton, setActiveFilterButton] = useState(0);
  const [groupByTransformation, setGroupByTransformation] = useState({});
  const [filterTransformation, setFilterTransformation] = useState({});

  const xValues = useMemo(() => cities.map((city) => city.longitude), [cities]);
  const yValues = useMemo(() => cities.map((city) => city.latitude), [cities]);
  const citiesLabel = useMemo(() => cities.map((city) => city.city), [cities]);
  const states = useMemo(() => cities.map((city) => city.state), [cities]);
  const growth = useMemo(
    () =>
      cities.map((city) => {
        if (
          typeof city.growth_from_2000_to_2013 === "string" &&
          city.growth_from_2000_to_2013.length === 0
        ) {
          return 1;
        }
        return parseInt(city.growth_from_2000_to_2013.slice(0, -1)) / 10;
      }),
    [cities]
  );
  const populations = useMemo(
    () => cities.map((city) => parseInt(city.population)),
    [cities]
  );
  const populationNormalized = useMemo(
    () =>
      cities.map((city) => (parseInt(city.population) * 3000) / populationSum),
    [cities]
  );

  const chartData: ICartData = useMemo(
    () => ({
      typeNone: {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "markers",
        text: citiesLabel,
        transforms: filterEmptyObjects([groupByTransformation]),
      },
      typeAbsolute: {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "markers",
        // @ts-expect-error type exists
        marker: groupByTransformation.type
          ? {
              size: populationNormalized,
              color: populations,
              colorscale: "Portland",
              cmin: populations[populations.length - 1],
              cmax: populations[0],
            }
          : {
              size: populationNormalized,
              color: populations,
              showscale: true,
              colorscale: "Portland",
              cmin: populations[populations.length - 1],
              cmax: populations[0],
              colorbar: { len: 1, title: "Population:" },
            },
        text: citiesLabel,
        transforms: filterEmptyObjects([groupByTransformation]),
      },
      typeGrowth: {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "markers",
        // @ts-expect-error type exists
        marker: groupByTransformation.type
          ? {}
          : {
              colorscale: "Portland",
              color: growth,
              colorbar: {
                len: 1,
                ticksuffix: "%",
                title: "Growth from:<br>2000 to 2013<br>",
              },
            },
        text: citiesLabel,

        transforms: filterEmptyObjects([
          filterTransformation,
          groupByTransformation,
        ]),
      },
    }),
    [xValues, groupByTransformation, filterTransformation]
  );

  const annotations: Array<Partial<Annotations>> = [
    {
      text: "Add population:",
      x: -160,
      y: 1.29,
      yref: "paper",
      align: "left",
      showarrow: false,
    },
    {
      text: "Group by:",
      x: -160,
      y: 1.19,
      yref: "paper",
      align: "left",
      showarrow: false,
    },
    {
      text: "Filter by:",
      x: -160,
      y: 1.09,
      yref: "paper",
      align: "left",
      showarrow: false,
    },
  ];

  const updatemenus = [
    {
      buttons: [
        {
          args: [],
          label: "None",
          method: "update",
          name: "typeNone",
        },
        {
          args: [],
          label: "Absolute values",
          method: "update",
          name: "typeAbsolute",
        },
        {
          args: [],
          label: "Growth",
          method: "update",
          name: "typeGrowth",
        },
      ],
      direction: "left",
      active: activeTypeButton,
      showactive: true,
      type: "buttons",
      x: 0.15,
      xanchor: "left",
      y: 1.3,
      yanchor: "top",
    },
    {
      buttons: [
        {
          args: [],
          label: "None",
          method: "update",
          name: "GroupByNone",
        },
        {
          args: [],
          label: "States",
          method: "update",
          name: "GroupBy",
        },
      ],
      direction: "left",
      active: activeGroupByButton,
      showactive: true,
      type: "buttons",
      x: 0.15,
      xanchor: "left",
      y: 1.2,
      yanchor: "top",
    },
    buttonClicked === "typeGrowth"
      ? {
          buttons: [
            {
              args: [],
              label: "None",
              method: "update",
              name: "FilterByNone",
            },
            {
              args: [],
              label: "Growth > 0",
              method: "update",
              name: "FilterByPositiveGrowth",
            },
            {
              args: [],
              label: "Growth < 0",
              method: "update",
              name: "FilterByNegativeGrowth",
            },
          ],
          direction: "left",
          active: activeFilterButton,
          showactive: true,
          type: "buttons",
          x: 0.15,
          xanchor: "left",
          y: 1.1,
          yanchor: "top",
        }
      : {},
  ];

  const groupByTransformationValue = {
    type: "groupby",
    groups: states,
  };
  const positiveGrowthTransformationValue = {
    type: "filter",
    target: growth,
    operation: ">",
    value: "0",
  };
  const negativeGrowthTransformationValue = {
    type: "filter",
    target: growth,
    operation: "<",
    value: "0",
  };

  return (
    <Plot
      data={[chartData[buttonClicked]]}
      onButtonClicked={(e: Readonly<ButtonClickEvent>) => {
        // @ts-expect-error e.button exists
        const buttonName = e.button.name;
        // @ts-expect-error e.active exists
        const { active } = e;
        if (buttonName === "GroupBy") {
          setActiveGroupByButton(active);
          setGroupByTransformation(groupByTransformationValue);
          return;
        } else if (buttonName === "GroupByNone") {
          setActiveGroupByButton(active);
          setGroupByTransformation({});
          return;
        } else if (buttonName === "FilterByPositiveGrowth") {
          setActiveFilterButton(active);
          setFilterTransformation(positiveGrowthTransformationValue);
          return;
        } else if (buttonName === "FilterByNegativeGrowth") {
          setActiveFilterButton(active);
          setFilterTransformation(negativeGrowthTransformationValue);
          return;
        } else if (buttonName === "FilterByNone") {
          setActiveFilterButton(active);
          setFilterTransformation({});
          return;
        }
        setActiveTypeButton(active);
        setButtonClicked(buttonName);
      }}
      layout={{
        width: 1000,
        height: 800,
        updatemenus,
        annotations,
        title: "US Cities by Location",
        xaxis: {
          title: {
            text: "Longitude",
            font: {
              size: 18,
              color: "#7f7f7f",
            },
          },
        },
        yaxis: {
          title: {
            text: "Latitude",
            font: {
              size: 18,
              color: "#7f7f7f",
            },
          },
        },
      }}
    />
  );
}

export default Chart;
