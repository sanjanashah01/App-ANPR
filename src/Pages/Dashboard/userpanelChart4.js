import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialChart4 = ({totalOrders, pendingOrders}) => {
    const val = (100*pendingOrders)/totalOrders;
    const formattedVal = val.toFixed(1);
    const series = [parseFloat(formattedVal)];
    const radialoptions = {
        chart: {
            type: 'radialBar',
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#005254'],
        stroke: {
            lineCap: 'round'
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '70%'
                },
                track: {
                    margin: 0,
                },
    
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 5,
                        show: true
                    }
                }
            }
        }
    };
  return(
    <React.Fragment>
        <ReactApexChart
          options={radialoptions}
          series={series}
          type="radialBar"
          height="72"
          width= "72"
          className="apex-charts"
        />
      </React.Fragment>
  )
}

export default RadialChart4;
