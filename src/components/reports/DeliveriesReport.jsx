import { useEffect, useState, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import CatapultAPIContext from "../../context/CatapultAPI/CatapultAPIContext";
import {
  getDeliveriesForAthletesInActivity,
  getSensorDataForAthletesInActivity,
} from "../../context/CatapultAPI/CatapultAPIAction";
import Spinner from "../layout/Spinner";
import DeliveriesChart from "./DeliveriesChart";
import { useUser } from "../../context/UserContext";

function DeliveriesReport() {
  const location = useLocation();
  const { athletes, activity, deliveriesFile, videoFile } = location.state;
  const [deliveries, setDeliveries] = useState([]);
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

    var dd = []
    const hds = []
    for (var nc=0; nc<arrData[0].length; nc++)
    {
      hds.push(arrData[0][nc].replace(/ /g, ''))
    }
    for (var n=1; n<arrData.length; n++)
    {
      var obj = {}
      for (var nc=0; nc<arrData[0].length; nc++)
      {
        obj[hds[nc]] = arrData[n][nc]
      }
      dd.push(obj)
    }
    // Return the parsed data.
    return dd;
  }

  const getAthletesDeliveries = useCallback(
    async (athindex) => {
      if (athindex === undefined) {
        return;
      }
      dispatch({ type: "SET_LOADING" });
      var athlete = athletes[athindex];

      var xdels = [];
      const fileReader = new FileReader();
      fileReader.readAsText(deliveriesFile, "UTF-8");
      fileReader.onload = (e) => {
        const ddd = CSVToArray(e.target.result, "\t");
        for (var nd = 1; nd < ddd.length; nd++) {
          if (
            ddd[nd].Bowler !== undefined &&
            ddd[nd].Bowler.includes(athlete.first_name) &&
            ddd[nd].Bowler.includes(athlete.last_name)
          ) {
            xdels.push(ddd[nd]);
          }
        }
        console.log(xdels);
      }

      var athid = athlete.id;
      const dd = await getDeliveriesForAthletesInActivity(
        catapultToken,
        activity.id,
        athid
      );
      dispatch({
        type: "GET_DELIVERIES_FOR_ATHLETES_IN_ACTIVITY",
        payload: dd,
      });
      const dels = dd.deliveriesData[0].data.cricket_delivery_au;
      const sensordata = dd.sensordata[0].data;
      var ddels = []
      for (var nr = 0; nr < dels.length; nr++) {
        const del = dels[nr];
        if (del.runup_distance > 3)
        {
          ddels.push(del)
        }
      }  

      var maxpl = 0;
      var sdindex = 0;
      for (var nd = 0; nd < ddels.length; nd++) {
        const del = ddels[nd];
        del.opta = xdels[nd]
        var lastsdd = 0;
        for (var ns = sdindex; ns < sensordata.length; ns++) {
          sdindex = ns;
          const sdd = sensordata[ns];
          if (sdd.ts > del.start_time && del.start_time > lastsdd) {
            //get seconds from ticks
            var ts = del.start_time;
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(ts);
            del.time = t.toLocaleTimeString()
            maxpl = sdd.pl > maxpl ? sdd.pl : maxpl;
            del.sensordata = sdd;
            break;
          }
          lastsdd = sdd.ts;
        }
      }
      for (var nd = 0; nd < ddels.length; nd++) {
        const del = ddels[nd];
        del.avepl =
          del.sensordata != undefined && maxpl > 0
            ? (del.sensordata.pl * 100) / maxpl
            : 0;
      }

      setDeliveries(ddels);
    },
    [activity.id]
  );

  useEffect(() => {
    setDeliveries([]);
    getAthletesDeliveries(0);
  }, [getAthletesDeliveries]);

  if (activity === undefined || athletes === undefined) {
    return <></>;
  }

  if (!loading) {
    if (deliveries.length === 0) {
      return <></>;
    }
    return (
      <DeliveriesChart
        activity={activity}
        athlete={athletes}
        deliveries={deliveries}
        videoFile={videoFile}
      />
    );
  } else {
    return <Spinner />;
  }
}

export default DeliveriesReport;
