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

function PlayerSensorData({ athlete, sensordata }) {
    const { fontSize, ref } = useFitText({ maxFontSize: 16 });
    const [, forceUpdate] = useState(0);

    useEffect(() =>
    {
        forceUpdate((n) => !n)
    }, [sensordata])
  return (
    <>
      <div className="flex h-12 bg-blue-900">
          <div className="my-2 shadow w-10 h-10">
            <img className="h-10" src={getPlayerPhoto(athlete)} alt="Profile" />
          </div>
          <div className="flex-col mt-2 w-[10vw]">
            <div ref={ref} style={{ fontSize, height: 16, width: "100%" }}>
                {athlete.first_name}
            </div>
            <div ref={ref} style={{ fontSize, height: 16, width: "100%" }}>
            {athlete.last_name.toUpperCase()}
            </div>
            {/* <h1 className="text-sm">{athlete.first_name}</h1>
            <h2 className="box text-sm font-semibold">
              {athlete.last_name.toUpperCase()}
            </h2> */}
          </div>
          <div className="overflow-x-auto overflow-y-hidden w-[100vw]">
            <PlayerSensorCharts sensordata={sensordata}/>
          </div>
      </div>
      
    </>
  );
}

export default PlayerSensorData;
