import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { isUndefined} from 'lodash'

const RadialChart1 = ({totalOrders}) => {
    const [series, setSeries] = useState([]);
    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;
    // const [radialoptions, setRadialoptions] = useState({});

    useEffect(() => {
        if(!isUndefined(totalOrders)) {
          setSeries([totalOrders]);
        }
      }, [totalOrders]);
    
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
        colors: ['#111742'],
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
                        show: false
                    }
                }
            }
        }
      };
  return(
    <React.Fragment>
        <div style={{ position: 'relative', display: 'inline-block' }}>
        <ReactApexChart
          options={radialoptions}
          series={series}
          type="radialBar"
          height="72"
          width= "72"

        />
        <div className="dash-icon">
        <i className="bx bxs-cart-alt"></i>
      </div>
      </div>
      </React.Fragment>
  )
}

export default RadialChart1;
