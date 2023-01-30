import { useEffect, useContext, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatapultAPIContext from "../../context/CatapultAPI/CatapultAPIContext";
import { getAthletesInActivity } from "../../context/CatapultAPI/CatapultAPIAction";
import AthletesList from "./AthletesList";
import { secsToDateTime } from "../../utils/utils";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

function ActivityDetails() {
  const [aths, setAths] = useState(null);
  const params = useParams();
  const { activity, athletes, token, dispatch } =
    useContext(CatapultAPIContext);
  const navigate = useNavigate();
  const { catapultToken } = useUser();
  const [deliveriesFileData, setDeliveriesFileData] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const [deliveriesFileName, setDeliveriesFileName] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const dfRef = useRef()
  const vfRef = useRef()

  const getLatest = useCallback(async () => {
    dispatch({ type: "SET_LOADING" });

    const athletesData = await getAthletesInActivity(
      catapultToken,
      params.activityId
    );
    dispatch({ type: "GET_ATHLETES_IN_ACTIVITY", payload: athletesData });
    setAths(athletesData.athletes);
  }, [params.activityId]);

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
    };
    navigate("/bowlingreport", { state: st });
  };

  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0])
    setDeliveriesFileName(files[0].name)
    localStorage.setItem("deliveriesFileName", files[0].name)
    const fileReader = new FileReader()
    fileReader.readAsText(files[0], "UTF-8")
    fileReader.onload = (e) => {
      setDeliveriesFileData(e.target.result);
      localStorage.setItem("deliveriesFileData", e.target.result)
    }
  }

  const handleVideoSelected = (e) => {
    const files = Array.from(e.target.files);
    console.log("file:", files[0]);
    setVideoFileName(files[0].name);
    localStorage.setItem("videoFileName", files[0].name);
    setVideoFileUrl(URL.createObjectURL(files[0]))
    localStorage.setItem("videoFileUrl", URL.createObjectURL(files[0]));
  };

  useEffect(() => {
    setDeliveriesFileName(localStorage.getItem("deliveriesFileName"))
    setDeliveriesFileData(localStorage.getItem("deliveriesFileData"))
    setVideoFileName(localStorage.getItem("videoFileName"))
    setVideoFileUrl(localStorage.getItem("videoFileUrl"))
    getLatest();
    // setTimeout(() => setCounter(!counter), 30000)
  }, [getLatest]);

  if (activity.id === undefined) {
    return <></>;
  }

  return (
    <div>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="mx-4 w-100 h-full">
            <div className="flex space-x-4 mt-2">
              {/* <button
                className="flex btn btn-sm"
                onClick={() => doSensorData()}
              >
                Load Sensor Data
              </button> */}
              <button
                className="flex btn btn-md btn-primary"
                onClick={() => doBowlingReport()}
              >
                Bowling Report
              </button>
            </div>
            
            <h2 className="mt-4 text-2xl font-bold">{activity.name.toUpperCase()}</h2>
            <p>{secsToDateTime(activity.start_time).toDateString()}</p>
            <div>
              {/* <label className="label">
                <span className="label-text">Select deliveries file</span>
              </label>
              <input
                type="file"
                style={{display: 'none'}}
                onChange={handleFileSelected}
                className="file-input file-input-bordered w-full max-w-xs"
              /> */}

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
                  onClick={() => document.getElementById("selectedFile").click()}
                />
                <label className="label ml-4">
                  <span className="label-text">{deliveriesFileName === null ? "" : deliveriesFileName}</span>
                </label>
              </div>
            </div>
            <div>
              {/* <label className="label">
                <span className="label-text">Select video file</span>
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleVideoSelected}
                className="file-input file-input-bordered w-full max-w-xs"
              /> */}
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
                  onClick={() => document.getElementById("selectedVideo").click()}
                />
                <label className="label ml-4">
                  <span className="label-text">{videoFileName === null ? "" : videoFileName}</span>
                </label>
              </div>

            </div>
          </div>
        </div>
        <div className="drawer-side w-80">
          <label htmlFor="my-drawer-5" className="drawer-overlay"></label>
          <div className="h-full bg-base-200">
            <AthletesList
              athletes={athletes}
              onAthleteSelectionChanged={(aths) => setAths(aths)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails;
