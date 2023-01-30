import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

function DeliveriesGraph({
  activity,
  athletes,
  deliveries,
  videoFile,
  deliveryClicked,
}) {
  const [series, setSeries] = useState(null);
  const [options, setOptions] = useState(null);

  const handleClick = (dindex) => {
    console.log("click " + dindex.toString());
    deliveryClicked(dindex);
    // var st = {
    //   delivery: deliveries[dindex],
    //   videoFile: videoFile,
    // }
    // navigate("/deliverydetail", { state: st });
  };

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
      var o = Number.parseInt(del.Over) - 1;
      cats.push(o.toString() + "." + del.BallInOver);
    }
    srs.push({
      data: ballspeeds,
    });
    setSeries(srs);

    var opts = {
      chart: {
        type: "bar",
        height: 1800,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            console.log(chartContext, config);
            handleClick(config.dataPointIndex);
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: cats,
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
      },
      annotations: {
        xaxis: [
          {
            x: '4.1',
            borderColor: '#775DD0',
            label: {
              style: {
                color: '#ff0000',
              },
              text: 'Wicket'
            }
          }
        ],
        points: [
            {
              x: 40,
              y: 100,
              marker: {
                size: 6,
                fillColor: "#fff",
                strokeColor: "#2698FF",
                radius: 2
              },
              label: {
                borderColor: "#FF4560",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#FF4560"
                },
      
                text: "W"
              }
            }
          ]
      }
    };
    setOptions(opts);
  }, []);

  if (series === null) {
    return <></>;
  }

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={1800}
      />
    </div>
  );
}

export default DeliveriesGraph;
