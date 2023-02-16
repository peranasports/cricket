import { useState, useEffect, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import PlayerSensorData from "../components/sensors/PlayerSensorData";
import { getSensorDataForAthletesInActivity } from "../context/CatapultAPI/CatapultAPIAction";
import {
  secsToDateTime,
  getHomeTeamLogo,
  getAwayTeamLogo,
} from "../utils/utils";
import CatapultAPIContext from "../context/CatapultAPI/CatapultAPIContext";

function CatapultSensorDataPage() {
  const location = useLocation();
  const { athletes, activity } = location.state;
  const [sensorData, setSensorData] = useState([])
  const [, forceUpdate] = useState(0);
  const { deliveriesData, token, loading, dispatch } = useContext(CatapultAPIContext);

  const getAthleteSensorData = useCallback(async (token) => {
    var allsensors = [];
    for (var np = 0; np < athletes.length; np++) {
      var athlete = athletes[np];
      var athid = athlete.id;
    //   dispatch({ type: "SET_LOADING", payload: {message: "Loading data for " + athlete.last_name + "..."}  });
      const sd = await getSensorDataForAthletesInActivity(
        token,
        activity.id,
        athid
      );
      dispatch({
        type: "GET_SENSOR_DATA_FOR_ATHLETES_IN_ACTIVITY",
        payload: sd,
      });
      const sensordata = sd.sensordata[0].data;
      sensordata.athlete = athlete;
      allsensors.push(sensordata !== null ? sensordata : []);
      console.log(athlete.last_name);
    //   console.log(sensordata);
      setSensorData(allsensors)
      forceUpdate((n) => !n)
    }
  }, [activity.id]);

  const getAthleteSensor = (idx) =>
  {
    if (sensorData.length > idx)
    {
        return sensorData[idx]
    }
    return null
  }

  useEffect(() =>
  {
    var token = localStorage.getItem("CatapultToken")
    getAthleteSensorData(token)
  }, [activity.id])

  return (
    <>
      <div className="flex my-4">
        <div className="mr-4">
          <img className="h-16" src={getHomeTeamLogo(activity)} />
        </div>
        <div className="">
          <h2 className="text-2xl font-bold">
            {activity.name.replace(/_/g, " ").toUpperCase()}
          </h2>
          <p>{secsToDateTime(activity.start_time).toDateString()}</p>
        </div>
        <div className="ml-4">
          <img className="h-16" src={getAwayTeamLogo(activity)} />
        </div>
      </div>

      {athletes.map((athlete, idx) => (
        <div className="mb-1">
          <PlayerSensorData athlete={athlete} sensordata={() => getAthleteSensor(idx)} key={idx} />
        </div>
      ))}
    </>
  );
}

export default CatapultSensorDataPage;
