import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
//import Json Data
// import data from "./data.json";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const GoogleMaps = ({ latitude, longitude, positions, ball }) => {
  const ModelsMap = (map, maps) => {
    //instantiate array that will hold your Json Data
    let dataArray = positions;
    // //push your Json Data in the array
    // {
    //   data.map((markerJson) => dataArray.push(markerJson));
    // }

    //Loop through the dataArray to create a marker per data using the coordinates in the json
    for (let i = 0; i < dataArray.length; i++) {
      let marker = new maps.Marker({
        position: { lat: dataArray[i].lat, lng: dataArray[i].lng },
        map,
        label: dataArray[i].id,
      });
    }
  };

  useEffect(() => {

  }, [positions])
  
  return (
    <div style={{ height: "240px", width: "300px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}//"AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg" }}
        defaultCenter={{ lat: latitude, lng: longitude }}
        defaultZoom={17}
        yesIWantToUseGoogleMapApiInternals
        key={ball}
        onGoogleApiLoaded={({ map, maps }) => ModelsMap(map, maps)}
      ></GoogleMapReact>
    </div>
  );
};

export default GoogleMaps;
