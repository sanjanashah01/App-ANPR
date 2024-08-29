import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { isUndefined} from 'lodash'

const RadialChart = ({ orderStatusesCount }) => {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if(!isUndefined(orderStatusesCount.approved)) {
      setSeries([orderStatusesCount.approved,orderStatusesCount.rejected,orderStatusesCount.pending,]);
      setOptions({
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 10,
              size: "45%",
            },
            track: {
              show: true,
              strokeWidth: "70%",
              margin: 12,
            },
            dataLabels: {
              name: {
                fontSize: "27px",
              },
              value: {
                fontSize: "20px",
              },
              total: {
                show: true,
                label: "Total",
                formatter: function (w) {
                  return orderStatusesCount.totalOrders;
                },
              },
            },
          },
        },
        labels: ["Accepted", "Rejected", "Pending"],
        colors: ["#57BABA", "#FF6A56", "#005254"],
      });
    }
  }, [orderStatusesCount]);

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height="350"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export default RadialChart;
