import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IData } from "../utils/Helper";
import RBDataYear from "../data/RBYear.json";
import LKDataYear from "../data/LKYear.json";

const StackedBarComponent = ({
    getYear,
    getDistrict,
    isAbsolute,
    isDark,
}: {
    getYear: number;
    getDistrict: string;
    isAbsolute: boolean;
    isDark: boolean;
}): JSX.Element => {
    const [checkedHighlighting, setCheckedHighlighting] = useState<boolean>(false);

    const getDataRB: IData = useMemo(() => {
        return RBDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);
    const getDataLK: IData = useMemo(() => {
        return LKDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);

    const selectedLK = useMemo(() => {
        let sLK;
        const data = Object.values(getDataRB).flat(1);
        const dataLK = Object.values(getDataLK).flat(1);
        if (getDistrict == "Bayern") {
            sLK = data;
        } else {
            data.forEach((dataEntry) => {
                if (dataEntry.municipality === getDistrict) {
                    sLK = dataLK.filter((lkEntry) => Math.trunc(Number(lkEntry.AGS) / 100) === dataEntry.AGS);
                }
            });
        }
        return sLK;
    }, [getDataRB, getDataLK, getDistrict]);
    const options: ApexOptions = useMemo(() => {
        return {
            colors: [
                "var(--color-pink)",
                "var(--color-orange)",
                "var(--color-gray-1)",
                "var(--color-green)",
                "var(--color-blue)",
            ],
            chart: {
                toolbar: {
                    show: false,
                },
                type: "bar",
                stacked: true,
                stackType: isAbsolute ? "100%" : "normal",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                    animateGradually: {
                        enabled: false,
                        //delay: 150,
                    },
                },
                background: "rgba(0,0,0,0)",
            },
            xaxis: {
                type: "category",
                categories: selectedLK.map((lkEntry) => lkEntry.municipality),
                labels: {
                    style: {
                        colors: "var(--color-black)",
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            stroke: {
                width: 0,
            },

            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    if (isAbsolute) {
                        return `${Math.round(val as number)} %`;
                    } else {
                        if (val >= 10000) return `${Math.round(val as number)} ha`;
                        else return "";
                    }
                },
                style: {
                    fontFamily: "Liberation Mono",
                    fontSize: "14px",
                },
            },
            zoom: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter: (val) => val + " ha",
                },
            },
            responsive: [
                {
                    breakpoint: 100,
                },
            ],
            legend: {
                markers: {
                    onClick() {
                        if (checkedHighlighting) {
                            setCheckedHighlighting(false);
                        } else {
                            setCheckedHighlighting(true);
                        }
                    },
                },
                fontFamily: "Liberation Mono",
                fontSize: "17px",
                position: "top",
                horizontalAlign: "center",
                offsetX: 40,
                onItemHover: {
                    highlightDataSeries: true, //checkedHighlighting,
                },
                onItemClick: {
                    toggleDataSeries: false,
                },
                labels: {
                    colors: "var(--color-black)",
                    useSeriesColors: false,
                },
            },
            theme: {
                mode: isDark ? "dark" : "light",
            },
        };
    }, [selectedLK, isAbsolute, checkedHighlighting, isDark]);
    const series = useMemo(() => {
        return [
            {
                name: "Wohnfläche",
                data: selectedLK.map((lkEntry) => lkEntry.living),
            },
            {
                name: "Industriefläche",
                data: selectedLK.map((lkEntry) => lkEntry.industry),
            },
            {
                name: "Transport und Infrastruktur",
                data: selectedLK.map((lkEntry) => lkEntry.transport_infrastructure),
            },
            {
                name: "Natur und Wasser",
                data: selectedLK.map((lkEntry) => lkEntry.nature_and_water),
            },
            {
                name: "Sonstiges",
                data: selectedLK.map((lkEntry) => lkEntry.miscellaneous),
            },
        ];
    }, [selectedLK]);
    return (
        <>
            <div className="break" />
            <div className={"main-view-bar"}>
                <Chart options={options} series={series} type={"bar"} height={"100%"} width={"100%"} />
            </div>
        </>
    );
};

export default StackedBarComponent;