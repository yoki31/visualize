import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import data from "../data/data.json";
import { ICLickedLK } from "./MainComponent";
import { IDataEntry } from "../utils/Helper";

const LineGraphComponent = ({
    getClickedLK,
    getCurrentYear,
    isDark,
    handleModalClick2,
}: {
    getClickedLK: ICLickedLK;
    getCurrentYear: number;
    isDark: boolean;
    handleModalClick2: () => void;
}): JSX.Element => {
    const getSelectedData = useMemo(() => {
        return data.filter((entry: IDataEntry) => entry.AGS == parseInt(getClickedLK.AGS));
    }, [getClickedLK]);

    const usedAreaSeries = useMemo(() => {
        const usedAreaData = getSelectedData.map((entry: IDataEntry) => {
            const [day, month, year] = entry.date.split(".");

            return {
                x: year + "-" + month + "-" + day,
                y: entry.used_area_percent * 100,
            };
        });

        return [
            {
                name: "Verbrauchte Fläche",
                data: usedAreaData,
            },
        ];
    }, [getSelectedData]);
    const options: ApexOptions = useMemo<ApexOptions>(() => {
        return {
            chart: {
                // height: 350,
                type: "line",
                id: "linechart",
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                background: "rgba(0,0,0,0)",
                events: {
                    click: (e) => {
                        if (e.target.innerHTML === "⚠") {
                            handleModalClick2();
                        }
                    },
                },
                fontFamily: "Liberation Mono !important",
            },
            annotations: {
                xaxis: [
                    {
                        id: "warn",
                        x: new Date("2014-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-yellow)",
                        label: {
                            borderColor: "var(--color-yellow)",
                            borderWidth: 0,
                            offsetY: -10,
                            style: {
                                fontSize: "20px",
                                color: "var(--color-yellow)",
                                background: "rgba(0,0,0,0)",
                            },
                            text: "⚠",
                            orientation: "horizontal",
                        },
                    },
                    {
                        x: new Date(getCurrentYear + "-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-black)",
                        label: {
                            borderColor: "var(--color-black)",
                            style: {
                                color: "var(--color-white)",
                                background: "var(--color-black)",
                            },
                            text: "Aktuell",
                        },
                    },
                ],
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "straight",
            },
            grid: {
                padding: {
                    right: 30,
                    left: 20,
                },
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                position: "top",
                horizontalAlign: "center",
                onItemClick: {
                    toggleDataSeries: false,
                },
            },
            // title: {
            //     text: "Line with Annotations",
            //     align: "left",
            // },
            // labels: filteredData.map((e) => new Date(e.date).getTime()),
            xaxis: {
                type: "datetime",
                labels: {
                    formatter: (value) => new Date(value).getFullYear().toString(),
                },
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                decimalsInFloat: 0,
                labels: {
                    formatter: (value) => value + "%",
                },
            },
            tooltip: {
                enabled: true,
                x: {
                    show: true,
                    format: "dd.MMM.yyyy",
                },
                y: {
                    formatter: (value) => value.toFixed(2) + "%",
                },
            },
            theme: {
                mode: isDark ? "dark" : "light",
            },
        };
    }, [getCurrentYear, isDark, handleModalClick2]);

    return <Chart options={options} series={usedAreaSeries} type="line" height={"100%"} width={"100%"} />;
};

export default LineGraphComponent;
