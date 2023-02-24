import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import PlayerSensorData from "../components/sensors/PlayerSensorData";
import { getSensorDataForAthletesInActivity } from "../context/CatapultAPI/CatapultAPIAction";
import {
  secsToDateTime,
  getHomeTeamLogo,
  getAwayTeamLogo,
} from "../utils/utils";
import CatapultAPIContext from "../context/CatapultAPI/CatapultAPIContext";
import GoogleMaps from "../components/Deliveries/Maps";
import ReactPlayer from "react-player/lazy";
import { toast } from "react-toastify";

function CatapultSensorDataPage() {
  const location = useLocation();
  const { athletes, activity } = location.state;
  const [sensorData, setSensorData] = useState([]);
  const [islLoading, setIsLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [, forceUpdate] = useState(0);
  const { deliveriesData, token, loading, dispatch } =
    useContext(CatapultAPIContext);
  const playerRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const [onlineVideoFileUrl, setOnlineVideoFileUrl] = useState(null);
  const vfRef = useRef();
  const [gps, setGps] = useState(null);

  const [localSelectedValue1, setLocalSelectedValue1] = useState("Velocity");
  const [localSelectedValue2, setLocalSelectedValue2] = useState("Player Load (cummulative)");

  const [selectedValue1, setSelectedValue1] = useState("Velocity");
  const [selectedValue2, setSelectedValue2] = useState(
    
  );
  const [sensorParams, setSensorParams] = useState([
    "Velocity",
    "Acceleration",
    "Metabolic Power",
    "Player Load (instantaneous)",
    "Player Load (cummulative)",
  ]);

  const doPreferencesModalClosed = () => {
    if (videoFileUrl !== null) {
      setVideoUrl(videoFileUrl);
    } else if (onlineVideoFileUrl !== null) {
      setVideoUrl(onlineVideoFileUrl);
    }
    setSelectedValue1(localSelectedValue1)
    setSelectedValue2(localSelectedValue2)
    // forceUpdate((n) => !n);
};

function onValue1Selected(e) {
    if (e === undefined) return;
    setLocalSelectedValue1(e.target.value)
}

function onValue2Selected(e) {
    if (e === undefined) return;
    setLocalSelectedValue2(e.target.value)
}

const handleChange = (e) => setOnlineVideoFileUrl(e.target.value);

  const handleVideoSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setVideoFileName(files[0].name);
    localStorage.setItem("videoFileName", files[0].name);
    setVideoFileUrl(URL.createObjectURL(files[0]));
    localStorage.setItem("videoFileUrl", URL.createObjectURL(files[0]));
  };

  const getCentreGPS = (sd) => {
    var maxlat = -1000000000;
    var maxlong = -1000000000;
    var minlat = 100000000;
    var minlong = 100000000;

    for (var nn = 0; nn < sd.length; nn++) {
      if (sd[nn].lat === 0 || sd[nn].long === 0) continue;
      maxlat = sd[nn].lat > maxlat ? sd[nn].lat : maxlat;
      maxlong = sd[nn].long > maxlong ? sd[nn].long : maxlong;
      minlat = sd[nn].lat < minlat ? sd[nn].lat : minlat;
      minlong = sd[nn].long < minlong ? sd[nn].long : minlong;
    }
    const midlat = (maxlat + minlat) / 2;
    const midlong = (maxlong + minlong) / 2;
    setGps({ lat: midlat, long: midlong });
  };

  const doCancelLoading = () => {
    setCancelLoading(true)
  }

  const getAthleteSensorData = useCallback(
    async (token) => {
        setIsLoading(true)
      var allsensors = [];
      for (var np = 0; np < athletes.length; np++) {
        if (cancelLoading)
        {
            for (var nnp=np; nnp < athletes.length; nnp++) 
            {
                allsensors.push([])
            }
            setIsLoading(false)
            forceUpdate((n) => !n)
            toast("Cancelled loading of sensor data", "information")
            break
        }
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
        if (gps === null) {
          getCentreGPS(sd.sensordata[0].data);
        }
        sensordata.athlete = athlete;
        allsensors.push(sensordata !== null ? sensordata : []);
        console.log(athlete.last_name);
        //   console.log(sensordata);
        setSensorData(allsensors);
        forceUpdate((n) => !n);
      }
      setIsLoading(false)
      setCancelLoading(false)
    },
    [activity.id]
  );

  function getAthleteSensor(idx) {
    if (sensorData.length > idx) {
      return sensorData[idx];
    }
    return null;
  }

  const playerReady = () => {
    if (!isReady) {
      setIsReady(true);
      playerRef.current.seekTo(0, "seconds");
    }
  };

  useEffect(() => {
    var token = localStorage.getItem("CatapultToken");
    setSensorData([]);
    getAthleteSensorData(token);
  }, [activity.id]);

  return (
    <>
      <div className="flex my-4 justify-between">
        <div className="flex">
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
        <div className="flex">
        {
            islLoading === false ? <></> :
            <button className="btn btn-green-900 btn-sm" onClick={() => doCancelLoading()}>
                Cancel Loading
            </button>
        }
        <label htmlFor="settings-modal" className="btn btn-primary w-40">
          Settings
        </label>
        </div>
      </div>

      <div className="flex justify-around h-[40vh]">
        {gps === null ? (
          <></>
        ) : (
          <div>
            {/* <GoogleMaps latitude={defaultLat} longitude={defaultLong} positions={positions} ball={delivery.Over + "." + delivery.BallInOver} /> */}
            <GoogleMaps latitude={gps.lat} longitude={gps.long} />
          </div>
        )}
        <div className="flex justify-center">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={true}
            width="100%"
            height="100%"
            controls={true}
            onReady={() => playerReady()}
          />
        </div>
      </div>
      <div className="overflow-y-auto">
        {athletes.map((athlete, idx) => (
          <div className="mb-1" key={idx}>
            <PlayerSensorData
              activity={activity}
              athlete={athlete}
              sensordata={getAthleteSensor(idx)}
              value1={selectedValue1}
              value2={selectedValue2}
            />
          </div>
        ))}
      </div>
      <input type="checkbox" id="settings-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="mb-4 font-bold text-2xl">Preferences</h3>
          <div className="form">
            <div className="flex-col">
              <p className="text-sm">Line Chart</p>
              <select
                className="select select-info text-lg w-full"
                value={localSelectedValue1}
                onChange={onValue1Selected}
              >
                <option disabled selected>
                  Select line chart value
                </option>
                {sensorParams.map((param, i) => (
                  <option key={i}>{param}</option>
                ))}
              </select>
            </div>
            <div className="flex-col">
              <p className="text-sm">Bar Chart</p>
              <select
                className="select select-info text-lg w-full"
                value={localSelectedValue2}
                onChange={onValue2Selected}
              >
                <option disabled selected>
                  Select bar chart value
                </option>
                {sensorParams.map((param, i) => (
                  <option key={i}>{param}</option>
                ))}
              </select>
            </div>

            <div className="my-4">
              <p className="text-sm">Online Video URL</p>
              <input
                type="text"
                className="w-full text-gray-500 bg-gray-200 input input-sm rounded-sm"
                id="onlineVideoUrl"
                onChange={handleChange}
              />
              <div className="flex-col mt-8">
                <p className="text-sm">Or Local Video</p>
                <div className="flex">
                  <input
                    type="file"
                    id="selectedVideo"
                    ref={vfRef}
                    style={{ display: "none" }}
                    onChange={handleVideoSelected}
                  />
                  <input
                    type="button"
                    className="btn btn-sm w-40"
                    value="Select video..."
                    onClick={() =>
                      document.getElementById("selectedVideo").click()
                    }
                  />
                  <label className="label ml-4">
                    <span className="label-text">
                      {videoFileName === null
                        ? "select local video file"
                        : videoFileName}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <label htmlFor="settings-modal" className="btn btn-primary">
                Cancel
              </label>
              <label
                htmlFor="settings-modal"
                className="btn btn-primary"
                onClick={() => doPreferencesModalClosed()}
              >
                Apply
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CatapultSensorDataPage;
