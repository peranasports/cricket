import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoadSavedData() {
    const navigate = useNavigate()
    const [deliveriesFileName, setDeliveriesFileName] = useState(null);
    const [deliveriesFileData, setDeliveriesFileData] = useState(null);
    const [videoFileName, setVideoFileName] = useState(null);
    const [videoFileUrl, setVideoFileUrl] = useState(null);
    const [onlineVideoFileUrl, setOnlineVideoFileUrl] = useState(null);
    const dfRef = useRef()
    const vfRef = useRef()
  
  const handleChange = (e) => setOnlineVideoFileUrl(e.target.value)

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

  return (
    <>
      <div className="mx-4 my-10 w-100 h-full">
        <p>Load previously saved match data</p>
        <div>
          <div className="flex my-4">
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
              value="Select saved data file..."
              onClick={() => document.getElementById("selectedFile").click()}
            />
            <label className="label ml-4">
              <span className="label-text">
                {deliveriesFileName === null ? "select saved data file" : deliveriesFileName}
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
              value="Select local video file..."
              onClick={() => document.getElementById("selectedVideo").click()}
            />
            <label className="label ml-4">
              <span className="label-text">
                {videoFileName === null ? "select local video file" : videoFileName}
              </span>
            </label>
          </div>
        </div>
        <div className="my-4">
            <p className="text-sm">Online Video URL</p>            
            <input
              type="text"
              className='w-full pr-40 text-gray-500 bg-gray-200 input input-sm rounded-sm'
              id="onlineVideoUrl"
              onChange={handleChange}
            />
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
    </>
  );
}

export default LoadSavedData;
