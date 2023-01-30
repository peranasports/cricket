import { useEffect, useState } from "react";

function BowlerStatsPanel({ deliveries, bowler, parameter }) {
  const [bowlerDeliveries, setBowlerDeliveries] = useState([]);
  const [bowlerStats, setBowlerStats] = useState({});
  const parameters = [
    "Run up velocity",
    "Run up distance",
    "Run up average velocity",
    "Run up maximum velocity",
    "Delivery load",
    "Delivery yaw",
    "Delivery roll",
    "Delivery resultant",
  ];
  const parameterunits = ["kph", "metres", "kph", "kph", "", "", "", ""];

  const getDeliveryValue = (del) => {
    if (del.cricket_delivery_au === undefined) return -1;
    switch (parameter) {
      case 0:
        return (del.cricket_delivery_au.runup_velocity * 3600) / 1000;
      case 1:
        return del.cricket_delivery_au.runup_distance;
      case 2:
        return (
          (del.cricket_delivery_au.delivery_runup_avg_velocity * 3600) / 1000
        );
      case 3:
        return (
          (del.cricket_delivery_au.delivery_runup_max_velocity * 3600) / 1000
        );
      case 4:
        return del.cricket_delivery_au.delivery_load;
      case 5:
        return del.cricket_delivery_au.delivery_yaw;
      case 6:
        return del.cricket_delivery_au.delivery_roll;
      case 7:
        return del.cricket_delivery_au.delivery_resultant;
      default:
        return -1;
    }
  };

  useEffect(() => {
    if (bowler === null) {
      return;
    }
    var maxval = 0;
    var valcount = 0;
    var totalval = 0;
    var bd = [];
    for (var n = 0; n < deliveries.length; n++) {
      var del = deliveries[n];
      if (del.Bowler === bowler) {
        bd.push(del);
        var val = getDeliveryValue(del);
        if (val !== -1) {
          maxval = val > maxval ? val : maxval;
          totalval += val;
          valcount++;
        }
      }
    }
    setBowlerDeliveries(bd);
    var bs = {};
    bs.numberOfDeliveries = bd.length;
    bs.maxParameter = maxval;
    bs.averageParameter = valcount > 0 ? totalval / valcount : 0;
    bs.maxParameterLabel = "Max " + parameters[parameter];
    bs.averageParameterLabel = "Ave " + parameters[parameter];
    bs.parameterUnit = parameterunits[parameter];
    setBowlerStats(bs);
  }, []);

  if (bowler === null || bowlerStats === null) {
    return <></>;
  }

  return (
    <>
      <div className="ml-6 text-2xl font-bold">{bowler.toUpperCase()}</div>
      {/* <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">DELIVERIES</div>
          <div className="stat-value">{bowlerStats.numberOfDeliveries}</div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">
            {bowlerStats.maxParameterLabel &&
              bowlerStats.maxParameterLabel.toUpperCase()}
          </div>
          <div className="stat-value">
            {bowlerStats.maxParameter && bowlerStats.maxParameter.toFixed(2)}
          </div>
          <div className="stat-desc">{bowlerStats.parameterUnit}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">
            {bowlerStats.averageParameterLabel &&
              bowlerStats.averageParameterLabel.toUpperCase()}
          </div>
          <div className="stat-value">
            {bowlerStats.averageParameter &&
              bowlerStats.averageParameter.toFixed(2)}
          </div>
          <div className="stat-desc">{bowlerStats.parameterUnit}</div>
        </div>
      </div> */}
    </>
  );
}

export default BowlerStatsPanel;
