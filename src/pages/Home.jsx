import { useEffect, useContext, useCallback, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ActivitySearch from "../components/activities/ActivitySearch";
import ActivityResults from "../components/activities/ActivityResults";

function Home() {
  const navigate = useNavigate()
  const [deliveriesFileName, setDeliveriesFileName] = useState(null);
  const [deliveriesFileData, setDeliveriesFileData] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState(null);
  const dfRef = useRef()
  const vfRef = useRef()

  const doBowlingReport = () => {
    if (deliveriesFileName === null) {
      toast.error("Please select a deliveries file.");
      return;
    }
    const st = {
      athletes: [],
      activity: {},
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

  return (
    // <div>
    //     <ActivitySearch />
    //     <ActivityResults />
    // </div>
    <div className="mx-4 w-100 h-full">
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
            onClick={() => document.getElementById("selectedFile").click()}
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
            onClick={() => document.getElementById("selectedVideo").click()}
          />
          <label className="label ml-4">
            <span className="label-text">
              {videoFileName === null ? "" : videoFileName}
            </span>
          </label>
        </div>
      </div>
      <div className="flex space-x-4 mt-2">
        <button
          className="flex btn btn-md btn-primary w-60 my-4"
          onClick={() => doBowlingReport()}
        >
          Bowling Report
        </button>
      </div>

    </div>
  );
}

export default Home;
