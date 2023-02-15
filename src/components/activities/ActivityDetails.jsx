import { useEffect, useContext, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatapultAPIContext from "../../context/CatapultAPI/CatapultAPIContext";
import { getAthletesInActivity, getStatsInActivity, getParameters } from "../../context/CatapultAPI/CatapultAPIAction";
import AthletesList from "./AthletesList";
import { secsToDateTime } from "../../utils/utils";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";
import PlayerStats from "../stats/PlayerStats";

function ActivityDetails() {
  const [aths, setAths] = useState(null);
  const params = useParams();
  const { activity, athletes, loading, dispatch } =
    useContext(CatapultAPIContext);
  const navigate = useNavigate();
  const { catapultToken } = useUser();
  const [allStats, setAllStats] = useState(null);
  const [allParameters, setAllParameters] = useState(null);
  const [athleteStats, setAthleteStats] = useState(null);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [deliveriesFileData, setDeliveriesFileData] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const [deliveriesFileName, setDeliveriesFileName] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [onlineVideoFileUrl, setOnlineVideoFileUrl] = useState(null);
  const dfRef = useRef();
  const vfRef = useRef();

  const handleChange = (e) => setOnlineVideoFileUrl(e.target.value);

  const getLatest = useCallback(async () => {
    dispatch({
      type: "SET_LOADING",
      payload: { message: "Loading athletes in activity..." },
    });

    const athletesData = await getAthletesInActivity(
      catapultToken,
      params.activityId
    );
    dispatch({ type: "GET_ATHLETES_IN_ACTIVITY", payload: athletesData });
    if (athletesData.athletes !== undefined) {
      setAths(athletesData.athletes);
    }

    dispatch({
      type: "SET_LOADING",
      payload: { message: "Loading parameters..." },
    });
    
    const paramsData = await getParameters(catapultToken);
    dispatch({ type: "GET_PARAMETERS", payload: paramsData });
    setAllParameters(paramsData.parameters)

    dispatch({
      type: "SET_LOADING",
      payload: { message: "Loading stats..." },
    });
    
    const statsData = await getStatsInActivity(
      catapultToken,
      params.activityId
    );
    dispatch({ type: "GET_STATS_IN_ACTIVITY", payload: statsData });
    setAllStats(statsData.statsData)

  }, [params.activityId]);

  const doAthleteSelectionChanged = (ath) => {
    setSelectedAthlete(ath);
    for (var ns=0; ns<allStats.length; ns++)
    {
      if (allStats[ns].athlete_id === ath.id)
      {
        setAthleteStats(allStats[ns])
        break;
      }
    }
  };

  const doSensorData = () => {
    var str = "";
    for (var i = 0; i < aths.length; i++) {
      if (aths[i].selected) {
        if (str.length > 0) str += ",";
        str += aths[i].id;
      }
    }
    navigate(`/sensors/${activity.id}/${str}`);
  };

  const doBowlingReport = () => {
    if (deliveriesFileName === null) {
      toast.error("Please select a deliveries file.");
      return;
    }
    const st = {
      athletes: aths,
      activity: activity,
      deliveriesFileData: deliveriesFileData,
      videoFileUrl: videoFileUrl,
      onlineVideoFileUrl: onlineVideoFileUrl,
    };
    navigate("/bowlingreport", { state: st });
  };

  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setDeliveriesFileName(files[0].name);
    localStorage.setItem("deliveriesFileName", files[0].name);
    const fileReader = new FileReader();
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      setDeliveriesFileData(e.target.result);
      localStorage.setItem("deliveriesFileData", e.target.result);
    };
  };

  const handleVideoSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setVideoFileName(files[0].name);
    localStorage.setItem("videoFileName", files[0].name);
    setVideoFileUrl(URL.createObjectURL(files[0]));
    localStorage.setItem("videoFileUrl", URL.createObjectURL(files[0]));
  };

  const doClearVideoFile = () => {
    setVideoFileName(null);
    setVideoFileUrl(null);
    localStorage.setItem("videoFileName", "");
    localStorage.setItem("videoFileUrl", "");
  };

  useEffect(() => {    
    setDeliveriesFileName(localStorage.getItem("deliveriesFileName"));
    setDeliveriesFileData(localStorage.getItem("deliveriesFileData"));
    setVideoFileName(localStorage.getItem("videoFileName"));
    setVideoFileUrl(localStorage.getItem("videoFileUrl"));
    getLatest();
    // setTimeout(() => setCounter(!counter), 30000)
  }, [getLatest]);

  if (activity.id === undefined) {
    return <></>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="mx-4 w-100 h-full">
            <div className="flex space-x-4 mt-2">
              <label
                htmlFor="bowling-report-modal"
                className="flex btn btn-md btn-primary"
                // onClick={() => doBowlingReport()}
              >
                Bowling Report
              </label>
            </div>
            <div className="my-10">
              <h2 className="mt-4 text-2xl font-bold">
                {activity.name.replace(/_/g, " ").toUpperCase()}
              </h2>
              <p>{secsToDateTime(activity.start_time).toDateString()}</p>
            </div>
            <input
              type="checkbox"
              id="bowling-report-modal"
              className="modal-toggle"
            />
            <div className="modal">
              <div className="modal-box">
                <div>
                  <div className="flex my-2">
                    <input
                      type="file"
                      id="selectedFile"
                      ref={dfRef}
                      style={{ display: "none" }}
                      onChange={handleFileSelected}
                    />
                    <input
                      type="button"
                      className="btn btn-sm w-60"
                      value="Select deliveries file..."
                      onClick={() =>
                        document.getElementById("selectedFile").click()
                      }
                    />
                    <label className="label ml-4">
                      <span className="label-text">
                        {deliveriesFileName === null ? "" : deliveriesFileName}
                      </span>
                    </label>
                  </div>
                </div>
                <div>
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
                      className="btn btn-sm w-60"
                      value="Select video file..."
                      onClick={() =>
                        document.getElementById("selectedVideo").click()
                      }
                    />
                    <label className="label ml-4">
                      <span className="label-text">
                        {videoFileName === null ? "" : videoFileName}
                      </span>
                    </label>
                    {videoFileName !== null ? (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => doClearVideoFile()}
                      >
                        Clear
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="my-4">
                  <p className="text-sm">Online Video URL</p>
                  <input
                    type="text"
                    className="w-full pr-40 bg-gray-200 input input-sm rounded-sm"
                    id="onlineVideoUrl"
                    onChange={handleChange}
                  />
                </div>
                <div className="modal-action">
                <label
                  htmlFor="bowling-report-modal"
                  className="btn btn-primary"
                >
                  Cancel
                </label>
                <label
                  htmlFor="bowling-report-modal"
                  className="btn btn-primary"
                  onClick={() => doBowlingReport()}
                >
                  Report
                </label>
              </div>
              </div>
            </div>
            <div>
              {selectedAthlete === null ? (
                <></>
              ) : (
                <PlayerStats
                  className="mt-10 bg-red-100"
                  athlete={selectedAthlete}
                  stats={athleteStats}
                  allParameters={allParameters}
                />
              )}
            </div>
          </div>
        </div>
        <div className="drawer-side w-80">
          <label htmlFor="my-drawer-5" className="drawer-overlay"></label>
          <div className="h-full bg-base-200">
            <AthletesList
              athletes={athletes}
              onAthleteSelectionChanged={(ath) =>
                doAthleteSelectionChanged(ath)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
