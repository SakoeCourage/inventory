/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useEffect, useState, useMemo, useContext } from 'react'
import ReactApexChart from "react-apexcharts";
import { formatcurrency } from '../../api/Util';

function LineChart({dashboardData}) {
    const [series, setSeries] = useState(
        [44, 55, 41, 17, 15]
    )
    const [colors, setColors] = useState([])
    const [categories, setCategories] = useState(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])

    const lineChart = useMemo(function(){
         return{
                series: Boolean(dashboardData?.line_chart?.length) && [ ...dashboardData?.line_chart],
                options: {
                    chart: {
                        width: "100%",
                        height: 350,
                        type: "area",
                        toolbar: {
                            show: false,
                        },
                    },
        
                    legend: {
                        show: false,
                    },
        
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        curve: "smooth",
                    },
        
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: "14px",
                                fontWeight: 600,
                                colors: ["#8c8c8c"],
                            },
                        },
                    },
        
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: "14px",
                                fontWeight: 600,
                                colors: [
                                    "#8c8c8c",
                                    "#8c8c8c",
                                    "#8c8c8c",
                                    "#8c8c8c",
                                    "#8c8c8c",
                                    "#8c8c8c",
                                    "#8c8c8c",
                                ],
                            },
                        },
                        categories: ["mon","tue",'wed','thu','fri','sat','sun']
                    },
        
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return formatcurrency(val);
                            },
                        },
                    },
                },
            };
        
    
    }, [dashboardData])





    return (
        <>
            <div className="linechart px-10">
                <div className='card-header'>
                    <div className=' text-info-900 font-bold tracking-3 antialiased' >Weekly sales and revenue</div>
                    <nav className="lastweek text-info-900 ">
                       A graph of current weeks sale and revenue
                    </nav>
                </div>
              
            </div>

            <ReactApexChart
                className="full-width"
                options={lineChart.options}
                series={lineChart.series}
                type="area"
                height={350}
                width={"100%"}
            />
        </>
    );
}

export default LineChart;
