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
import BowlerStatsPanel from "../components/Deliveries/BowlerStatsPanel";
import { useUser } from "../context/UserContext";

function NewBowlingReport() {
  return (
    <div>
      <table></table>
    </div>
  );
}

export default NewBowlingReport;
