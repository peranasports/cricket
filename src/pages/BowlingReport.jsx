import {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
  forwardRef,
} from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import CatapultAPIContext from "../context/CatapultAPI/CatapultAPIContext";
import {
  getDeliveriesForAthletesInActivity,
  getDeliveriesAndSensorDataForAthletesInActivity,
} from "../context/CatapultAPI/CatapultAPIAction";
import Spinner from "../components/layout/Spinner";
import DeliveryDetail from "../components/reports/DeliveryDetail";
import DeliveriesList from "../components/Deliveries/DeliveriesList";
import BowlingPanel from "../components/Deliveries/BowlingPanel";
import BowlerStatsPanel from "../components/Deliveries/BowlerStatsPanel";
import { useUser } from "../context/UserContext";

function BowlingReport() {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const { athletes, activity, deliveriesFileData, videoFileUrl, onlineVideoFileUrl } =
    location.state;
  // const vrl =
  //   "https://tennis.roosolution.com/videos/processed/Jason%20Dunstall/G13_v_Stars_001_SDI_1_1080p50.mp4";
  const playerRef = useRef();
  const [videoUrl, setVideoUrl] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [minLat, setMinLat] = useState(0);
  const [minLong, setMinLong] = useState(0);
  const [maxLat, setMaxLat] = useState(0);
  const [maxLong, setMaxLong] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [bowlingObject, setBowlingObject] = useState(null);
  const [videoOffset, setVideoOffset] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const { deliveriesData, token, loading, dispatch } =
    useContext(CatapultAPIContext);
  const { catapultToken } = useUser();

  function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      // Delimiters.
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    var dd = [];
    const hds = [];
    for (var nc = 0; nc < arrData[0].length; nc++) {
      hds.push(
        arrData[0][nc].replace(/ /g, "").replace("(", "").replace(")", "")
      );
    }
    for (var n = 1; n < arrData.length; n++) {
      var obj = {};
      for (var nc = 0; nc < arrData[0].length; nc++) {
        obj[hds[nc]] = arrData[n][nc];
      }
      dd.push(obj);
    }
    // Return the parsed data.
    return dd;
  }

  const getAthletesDeliveries = useCallback(async () => {
    var xdels = [];
    const ddd = CSVToArray(deliveriesFileData, "\t");
    for (var nd = 1; nd < ddd.length; nd++) {
      if (
        ddd[nd].TeamBowling !== undefined &&
        ddd[nd].TeamBowling.includes("Brisbane")
      ) {
        xdels.push(ddd[nd]);
      }
    }

    var alldels = [];
    var allsensors = [];
    for (var np = 0; np < athletes.length; np++) {
      var athlete = athletes[np];
      var athid = athlete.id;
      dispatch({ type: "SET_LOADING", payload: {message: "Loading data for " + athlete.last_name + "..."}  });
      const dd = await getDeliveriesAndSensorDataForAthletesInActivity(
        catapultToken,
        activity.id,
        athid
      );
      dispatch({
        type: "GET_DELIVERIES_AND_SENSOR_DATA_FOR_ATHLETES_IN_ACTIVITY",
        payload: dd,
      });
      const dels = dd.deliveriesData[0].data.cricket_delivery_au;
      const sensordata = dd.sensordata[0].data;
      sensordata.athlete = athlete;
      for (var nd=0; dels && nd<dels.length; nd++)
      {
        dels[nd].athleteId = athlete.id
      }
      alldels.push(dels !== null ? dels : []);
      allsensors.push(sensordata !== null ? sensordata : []);
      console.log(athlete.last_name);
      console.log(dels);
    }

    console.log(alldels);

    for (var np = 0; np < athletes.length; np++) {
      var athlete = athletes[np];
      var dels = alldels[np];
      if (dels === undefined) {
        continue;
      }
      var ddels = [];
      for (var nr = 0; nr < dels.length; nr++) {
        const del = dels[nr];
        if (del.runup_distance > 3) {
          ddels.push(del);
        }
      }
      var c = 0;
      for (var nx = 0; nx < xdels.length; nx++) {
        var xdel = xdels[nx];
        if (
          xdel.Bowler.includes(athlete.first_name) &&
          xdel.Bowler.includes(athlete.last_name)
        ) {
          xdel.cricket_delivery_au = ddels[c];
          c++;
        }
      }
    }

    // console.log(xdels);
    // setDeliveries(xdels);

    var sindices = [];
    for (var ns = 0; ns < allsensors.length; ns++) {
      sindices[ns] = 0;
    }

    for (var nd = 0; nd < xdels.length; nd++) {
      const del = xdels[nd];
      if (del.cricket_delivery_au === undefined) continue;
      var deltime = del.cricket_delivery_au.start_time;
      var plsensors = [];
      for (var ns = 0; ns < allsensors.length; ns++) {
        var sindex = sindices[ns];
        const sensordata = allsensors[ns];
        var lastsdd = 0;
        for (var nx = sindex; nx < sensordata.length; nx++) {
          var sdd = sensordata[nx];
          if (sdd.ts > deltime && deltime > lastsdd) {
            var maxsl = {val: 0, index:0}
            if (sensordata.athlete.id === del.cricket_delivery_au.athleteId)
            {
              var snx = nx - 20 < 0 ? 0 : nx - 20
              var lnx = nx + 20 >= sensordata.length ? sensordata.length - 1 : nx + 20
              for (var nxx=snx; nxx<lnx; nxx++)
              {
                if (sensordata[nxx].sl > maxsl.val)
                {
                  maxsl = { val: sensordata[nxx].sl, index: nxx }
                }
              }
              // console.log(maxsl)
              sdd = sensordata[maxsl.index]
            }

            var ts = deltime;
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(ts);
            del.time = t.toLocaleTimeString();
            // maxpl = sdd.pl > maxpl ? sdd.pl : maxpl;
            sdd.athlete = sensordata.athlete;
            plsensors.push(sdd);
            sindices[ns] = nx;
            break;
          }
          lastsdd = sdd.ts;
        }
      }
      del.playersensors = plsensors;
    }

    console.log(xdels);
    setDeliveries(xdels);

    var minx = 0;
    var miny = 1000;
    var maxx = -1000;
    var maxy = -1000;
    for (var nx = 0; nx < xdels.length; nx++) {
      var xdel = xdels[nx];
      if (xdel.playersensors === undefined) continue;
      for (var n = 0; n < xdel.playersensors.length; n++) {
        var ps = xdel.playersensors[n];
        if (ps.lat === 0 || ps.long === 0) continue;
        maxx = ps.lat > maxx ? ps.lat : maxx;
        maxy = ps.long > maxy ? ps.long : maxy;
        minx = ps.lat < minx ? ps.lat : minx;
        miny = ps.long < miny ? ps.long : miny;
      }
    }
    setMinLat(minx);
    setMinLong(miny);
    setMaxLat(maxx);
    setMaxLong(maxy);

    var bobj = { activityId: activity.id, activityName: activity.name, videoUrl: videoFileUrl, deliveries: xdels };
    localStorage.setItem("BowlingObject", JSON.stringify(bobj));
    setBowlingObject(bobj)
  }, [activity.id]);

  const playerReady = () => {
    if (!isReady) {
      setIsReady(true);
      playerRef.current.seekTo(0, "seconds");
    }
  };

  const onBowlerSelected = (bowler) => {
    setSelectedBowler(bowler);
  };

  const onParameterSelected = (parameter) => {
    setSelectedParameter(parameter);
  };

  const onDeliveryClicked = (del) => {
    setSelectedDelivery(del);
    var fdel = deliveries[0];
    var vo =
      localStorage.getItem("videoOffset") !== null
        ? Number.parseFloat(localStorage.getItem("videoOffset"))
        : 0;
    if (del.cricket_delivery_au !== undefined) {
      var loc =
        del.cricket_delivery_au.start_time -
        fdel.cricket_delivery_au.start_time +
        vo;
      playerRef.current.seekTo(loc, "seconds");
    } else {
      var loc =
        timeStringToSeconds(del.TimeofDayFull) -
        timeStringToSeconds(fdel.TimeofDayFull) +
        vo;
      playerRef.current.seekTo(loc, "seconds");
    }
  };

  const timeStringToSeconds = (stime) => {
    var tokens = stime.split(":");
    if (tokens.length === 3) {
      var hours = Number.parseInt(tokens[0]);
      var mins = Number.parseInt(tokens[1]);
      var secs = Number.parseInt(tokens[2]);
      return hours * 3600 + mins * 60 + secs;
    }
    return 0;
  };

  const onSynchVideo = () => {
    let firstdel = deliveries[0];
    setFirstTime(timeStringToSeconds(firstdel.TimeofDayFull));
    const voffset = playerRef.current.getCurrentTime()
    setVideoOffset(voffset);
    localStorage.setItem("videoOffset", voffset.toString());
    bowlingObject.videoOffset = voffset
  };

  const onSaveData = () => {
    if (bowlingObject !== undefined)
    {
      saveToPC(JSON.stringify(bowlingObject))
    }
  };

  const saveToPC = (fileData) => {
    // const fileData = JSON.stringify(contactsData);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = bowlingObject.activityName + ".json";
    link.href = url;
    link.click();
  };

  useEffect(() => {
    const vu = (videoFileUrl === null || videoFileUrl === "") ? onlineVideoFileUrl : videoFileUrl
    setVideoUrl(vu);

    if (activity.id === undefined)
    {
      loadSavedData(vu)
    }
    else
    {
      var bobj = bowlingObject;
      if (bobj === null) {
        bobj = localStorage.getItem("BowlingObject");
      }
      if (bobj !== null) {
        var bo = JSON.parse(bobj);
        setBowlingObject(bo);
        if (bo.activityId === activity.id) {
          loadBowlingObject(bo)
          if (vu !== null)
          {
            bo.videoUrl = vu
          }
        }
        else
        {
          setDeliveries([]);
          getAthletesDeliveries();
        }  
      }
      else
      {
        setDeliveries([]);
        getAthletesDeliveries();
      }
    }
  }, [activity.id]);

  const loadBowlingObject = (bo) =>
  {
    setDeliveries(bo.deliveries);
    var minx = 0;
    var miny = 1000;
    var maxx = -1000;
    var maxy = -1000;
    for (var nx = 0; nx < bo.deliveries.length; nx++) {
      var xdel = bo.deliveries[nx];
      if (xdel.playersensors === undefined) continue;
      for (var n = 0; n < xdel.playersensors.length; n++) {
        var ps = xdel.playersensors[n];
        if (ps.lat === 0 || ps.long === 0) continue;
        maxx = ps.lat > maxx ? ps.lat : maxx;
        maxy = ps.long > maxy ? ps.long : maxy;
        minx = ps.lat < minx ? ps.lat : minx;
        miny = ps.long < miny ? ps.long : miny;
      }
    }
    setMinLat(minx);
    setMinLong(miny);
    setMaxLat(maxx);
    setMaxLong(maxy);
  }

  const loadSavedData = (vu) => {
    var bo = JSON.parse(deliveriesFileData);
    if (vu != null)
    {
      bo.videoUrl = vu      
    }
    setVideoUrl(bo.videoUrl);
    setVideoOffset(bo.videoOffset);
    localStorage.setItem("videoOffset", bo.videoOffset);
    setBowlingObject(bo);
    loadBowlingObject(bo)
  }

  if (!loading) {
    if (deliveries.length === 0) {
      return <></>;
    }
    return (
      <>
      <div className="flex h-full">
      <div className="w-80">
          <BowlingPanel
            activityName={activityName}
            deliveries={deliveries}
            deliveryClicked={(dindex) => onDeliveryClicked(dindex)}
            bowlerSelected={(bowler) => onBowlerSelected(bowler)}
            parameterSelected={(parameter) => onParameterSelected(parameter)}
          />
        </div>
        <div className="ml-4 w-full">
           {/* <div className="h-12">
             <BowlerStatsPanel
               deliveries={deliveries}
               bowler={selectedBowler}
               parameter={selectedParameter}
             />
           </div> */}
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
           <DeliveryDetail
             delivery={selectedDelivery}
             minLat={minLat}
             maxLat={maxLat}
             minLong={minLong}
             maxLong={maxLong}
             onSynchVideo={() => onSynchVideo()}
             onSaveData={() => onSaveData()}
           />
        </div>
      </div>
      </>
    );
  } else {
    return <Spinner />;
  }
}

export default BowlingReport;

// return (
//   <div>
//     <div className="drawer drawer-mobile">
//       <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content">
//         <div className="mx-2 w-100 h-full">
//           <div className="h-12">
//             <BowlerStatsPanel
//               deliveries={deliveries}
//               bowler={selectedBowler}
//               parameter={selectedParameter}
//             />
//           </div>
//           <div className="flex justify-center">
//             <ReactPlayer
//               ref={playerRef}
//               url={videoUrl}
//               playing={true}
//               width="100%"
//               height="100%"
//               controls={true}
//               onReady={() => playerReady()}
//             />
//           </div>
//           <DeliveryDetail
//             delivery={selectedDelivery}
//             minLat={minLat}
//             maxLat={maxLat}
//             minLong={minLong}
//             maxLong={maxLong}
//             onSynchVideo={() => onSynchVideo()}
//           />
//         </div>
//       </div>
//       <div className="drawer-side">
//         <label htmlFor="my-drawer-5" className="drawer-overlay"></label>
//         <div className="" style={{"width" : "320px"}}></div>
//         <DeliveriesList
//           activityName={activityName}
//           deliveries={deliveries}
//           deliveryClicked={(dindex) => onDeliveryClicked(dindex)}
//           bowlerSelected={(bowler) => onBowlerSelected(bowler)}
//           parameterSelected={(parameter) => onParameterSelected(parameter)}
//         />
//       </div>
//     </div>
//   </div>
// );
