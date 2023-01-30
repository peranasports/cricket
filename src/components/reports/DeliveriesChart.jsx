import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart  from 'react-apexcharts';

function DeliveriesChart({ activity, athletes, deliveries, videoFile, deliveryClicked }) {
  const navigate = useNavigate()
  const [series, setSeries] = useState(null);
  const [options, setOptions] = useState(null);

  const handleClick = (dindex) =>
  {
    console.log("click " + dindex.toString())
    deliveryClicked(dindex)
    // var st = {
    //   delivery: deliveries[dindex],
    //   videoFile: videoFile,
    // }
    // navigate("/deliverydetail", { state: st });
  }

  useEffect(() => {
    var srs = [];
    var cats = [];
    var intensities = [];
    var ballspeeds = [];
    var runupspeeds = [];
    for (var n = 0; n < deliveries.length; n++) {
      var del = deliveries[n];
      ballspeeds.push(del.BallSpeed);
      // runupspeeds.push((del.runup_velocity * 3600) / 1000);
      cats.push(del.Over + "." + del.BallInOver);
    }
    srs.push({
      name: "Ball Speed",
      type: "column",
      data: ballspeeds,
    });
    // srs.push({
    //   name: "Run Up Velocity",
    //   type: "line",
    //   data: runupspeeds,
    // });
    setSeries(srs);

    var opts = {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            console.log(chartContext, config);
            handleClick(config.dataPointIndex);
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 4],
      },
      title: {
        text: "Deliveries Chart",
        align: "left",
        offsetX: 110,
      },
      xaxis: {
        categories: cats,
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            formatter: function(val) {
              return val.toFixed(0)
            },
            style: {
              colors: "#008FFB",
            },
          },
          title: {
            text: "Intensity %",
            style: {
              color: "#008FFB",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: "Run Up Velocity",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#FEB019",
          },
          labels: {
            formatter: function(val) {
              return val.toFixed(1)
            },
            style: {
              colors: "#FEB019",
            },
          },
          title: {
            text: "Run Up Speed (m/s)",
            style: {
              color: "#FEB019",
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40,
      },
    };

    setOptions(opts);
  }, []);

  if (series === null)
  {
    return <></>
  }
  return (
    <div>
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={250}
          />
    </div>
  );
}

export default DeliveriesChart;
