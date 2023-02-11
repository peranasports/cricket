const CATAPULT_API_URL = process.env.REACT_APP_CATAPULT_API_URL; //"https://connect-au.catapultsports.com/api/v6/"
const CATAPULT_API_WRAPPER_URL = process.env.REACT_APP_CATAPULT_API_WRAPPER_URL; //"https://connect-au.catapultsports.com/api/v6/"

export const getActivities = async (token) => {
  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", "Bearer " + token);

  // var requestOptions = {
  //   method: "GET",
  //   headers: myHeaders,
  //   redirect: "follow",
  // };
  // var activitiesData = null;
  // await fetch(CATAPULT_API_URL + "activities", requestOptions)

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var activitiesData = null;
  const surl =
    CATAPULT_API_WRAPPER_URL +
    "GetActivities?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL;
  await fetch(surl, requestOptions)
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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var athletesData = null;
  var activity = null;
  var surl =
    CATAPULT_API_WRAPPER_URL +
    "GetActivityDetails?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId;
  await fetch(surl, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      activity = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  var surl =
    CATAPULT_API_WRAPPER_URL +
    "GetAthletesInActivity?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId;
  await fetch(surl, requestOptions)
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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var sensorData = null;
  var activity = null;
  var athlete = null;

  var surl =
    CATAPULT_API_WRAPPER_URL +
    "GetActivityDetails?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId;
  await fetch(surl, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      activity = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  surl =
    CATAPULT_API_WRAPPER_URL +
    "GetAthleteDetails?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&athleteid=" +
    athleteId;
  await fetch(surl, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      athlete = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  surl =
    CATAPULT_API_WRAPPER_URL +
    "GetSensorDataForAthletesInActivity?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId +
    "&athleteid=" +
    athleteId;
  await fetch(surl, requestOptions)
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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var deliveries = null;

  var surl =
    CATAPULT_API_WRAPPER_URL +
    "GetDeliveriesForAthletesInActivity?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId +
    "&athleteid=" +
    athleteId;
  await fetch(surl, requestOptions)
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
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var deliveries = null;
  var sensordata = null;
  var surl =
    CATAPULT_API_WRAPPER_URL +
    "GetDeliveriesForAthletesInActivity?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId +
    "&athleteid=" +
    athleteId;
  await fetch(surl, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      deliveries = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  surl =
    CATAPULT_API_WRAPPER_URL +
    "GetSensorDataForAthletesInActivity?token=" +
    token +
    "&apiurl=" +
    CATAPULT_API_URL +
    "&activityid=" +
    activityId +
    "&athleteid=" +
    athleteId;
  await fetch(surl, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      sensordata = JSON.parse(result);
    })
    .catch((error) => console.log("error", error));

  return { deliveriesData: deliveries, sensordata: sensordata };
};
