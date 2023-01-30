const CATAPULT_API_URL = process.env.REACT_APP_CATAPULT_API_URL; //"https://connect-au.catapultsports.com/api/v6/"

export const getActivities = async (token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var activitiesData = null;
  await fetch(CATAPULT_API_URL + "activities", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      var activities = JSON.parse(result);
      console.log(activities);
      var tgs = [];
      for (var na = 0; na < activities.length; na++) {
        var activity = activities[na];
        activity.selected = true;
        for (var nt = 0; nt < activity.tags.length; nt++) {
          var tag = activity.tags[nt];
          if (tgs.filter((obj) => obj === tag).length === 0) {
            tgs.push(tag);
          }
        }
      }
      activitiesData = { activities: activities, tags: tgs, token: token };
    })
    .catch((error) => console.log("error", error));

  return activitiesData;
};

export const getAthletesInActivity = async (token, activityId) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var athletesData = null;
  var activity = null;
  await fetch(CATAPULT_API_URL + "activities/" + activityId, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      activity = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  await fetch(
    CATAPULT_API_URL + "activities/" + activityId + "/athletes",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      var athletes = JSON.parse(result);
      athletesData = { athletes: athletes, activity: activity };
    })
    .catch((error) => console.log("error", error));

  return athletesData;
};

export const getSensorDataForAthletesInActivity = async (
  token,
  activityId,
  athleteId
) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var sensorData = null;
  var activity = null;
  var athlete = null;

  await fetch(CATAPULT_API_URL + "activities/" + activityId, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      activity = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  await fetch(CATAPULT_API_URL + "athletes/" + athleteId, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      athlete = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  await fetch(
    CATAPULT_API_URL +
      "activities/" +
      activityId +
      "/athletes/" +
      athleteId +
      "/sensor",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      var sensordata = JSON.parse(result);
      sensorData = {
        sensordata: sensordata,
        activity: activity,
        athlete: athlete,
      };
    })
    .catch((error) => console.log("error", error));

  return sensorData;
};

export const getDeliveriesForAthletesInActivity = async (
  token,
  activityId,
  athleteId
) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var deliveries = null;
  await fetch(
    CATAPULT_API_URL +
      "activities/" +
      activityId +
      "/athletes/" +
      athleteId +
      "/events?event_types=cricket_delivery_au",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      deliveries = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  return { deliveriesData: deliveries };
};

export const getDeliveriesAndSensorDataForAthletesInActivity = async (
  token,
  activityId,
  athleteId
) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var deliveries = null;
  var sensordata = null;
  await fetch(
    CATAPULT_API_URL +
      "activities/" +
      activityId +
      "/athletes/" +
      athleteId +
      "/events?event_types=cricket_delivery_au",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      deliveries = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  await fetch(
    CATAPULT_API_URL +
      "activities/" +
      activityId +
      "/athletes/" +
      athleteId +
      "/sensor",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      sensordata = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  return { deliveriesData: deliveries, sensordata: sensordata };
};
