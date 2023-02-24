import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  secsToDateTime,
  getHomeTeamLogo,
  getAwayTeamLogo,
  getPlayerPhoto,
} from "../../utils/utils";
import useFitText from "use-fit-text";
import PlayerSensorCharts from "./PlayerSensorCharts";

function PlayerSensorData({ activity, athlete, sensordata, value1, value2 }) {
    const { fontSize, ref } = useFitText({ maxFontSize: 12 });
    const [, forceUpdate] = useState(0);

    useEffect(() =>
    {
        forceUpdate((n) => !n)
    }, [sensordata, value1, value2])
  return (
    <>
      <div className="flex h-12 bg-base-200">
          <div className="my-2 shadow w-10 h-10">
            <img className="h-10" src={getPlayerPhoto(athlete)} alt="Profile" />
          </div>
          <div className="flex-col mt-2 w-[10vw]">
            <div ref={ref} style={{ fontSize: 12, height: 20, width: "100%" }}>
                {athlete.first_name}
            </div>
            <div ref={ref} style={{ fontSize: 12, height: 20, width: "100%" }}>
            {athlete.last_name.toUpperCase()}
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden w-[100vw]">
            <PlayerSensorCharts sensordata={sensordata} activity={activity} value1={value1} value2={value2}/>
          </div>
      </div>
      
    </>
  );
}

export default PlayerSensorData;
