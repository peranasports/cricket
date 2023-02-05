import { useState, useEffect } from "react";
import DeliveriesList from "./DeliveriesList";
import BowlerStatsPanel from "./BowlerStatsPanel";
import PitchReport from "./PitchReport";

function BowlingPanel({
  activityName,
  deliveries,
  deliveryClicked,
  bowlerSelected,
  parameterSelected,
}) {
  const [bowlers, setBowlers] = useState([]);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [bowlerDeliveries, setBowlerDeliveries] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState(0)
  const [currentReport, setCurrentReport] = useState(0);
  const [, forceUpdate] = useState(0);

  function onBowlerSelected(e) {
    if (e === undefined) return;
    setSelectedBowler(e.target.value);
    bowlerSelected(e.target.value);
    var dd = [];
    for (var n = 0; n < deliveries.length; n++) {
      if (deliveries[n].Bowler === e.target.value) {
        dd.push(deliveries[n]);
      }
    }
    setBowlerDeliveries(dd);
    forceUpdate((n) => !n);
  }

  function onParameterSelected(par) {
    setSelectedParameter(par)
    parameterSelected(par);
  }

  const onDeliveryClicked = (del) => {
    deliveryClicked(del);
  };

  const doHandleDeliveryClick = (ret) =>
  {
    deliveryClicked(ret)
  }

  const renderReport = () => {
    if (currentReport === 0) {
      return (
        <DeliveriesList
          activityName={activityName}
          deliveries={bowlerDeliveries}
          deliveryClicked={(dindex) => onDeliveryClicked(dindex)}
          bowlerSelected={(bowler) => onBowlerSelected(bowler)}
          parameterSelected={(parameter) => onParameterSelected(parameter)}
        />
      );
    } else if (currentReport === 1) {
      return (
        <BowlerStatsPanel
          deliveries={bowlerDeliveries}
          bowler={selectedBowler}
          parameter={selectedParameter}
        />
      );
    } else if (currentReport === 2) {
      return (
        <PitchReport deliveries={deliveries} selectedBowler={selectedBowler} handleDeliveryClick={(ret)=>doHandleDeliveryClick(ret)}/>
      );
    }
    forceUpdate((n) => !n);
  };

  useEffect(() => {
    var bs = [];
    for (var n = 0; n < deliveries.length; n++) {
      var del = deliveries[n];
      if (bs.filter((obj) => obj === del.Bowler).length === 0) {
        bs.push(del.Bowler);
      }
    }
    setBowlers(bs);
    if (selectedBowler === null) {
      setSelectedBowler(bs[0]);
      bowlerSelected(bs[0]);

      var dd = [];
      for (var n = 0; n < deliveries.length; n++) {
        if (deliveries[n].Bowler === bs[0]) {
          dd.push(deliveries[n]);
        }
      }
      setBowlerDeliveries(dd);
      forceUpdate((n) => !n);
    }
  }, [selectedBowler]);

  return (
    <>
      <div className="w-full h-full">
        <div className="mt-2">
          <select
            className="select select-info text-xl w-full"
            value={selectedBowler}
            onChange={onBowlerSelected}
          >
            <option disabled selected>
              Select bowler
            </option>
            {bowlers.map((bowler, i) => (
              <option key={i}>{bowler}</option>
            ))}
          </select>
        </div>
        <div className="">
          <div className="tabs tabs-boxed">
            <a
              className={
                currentReport == 0
                  ? "tab tab-active"
                  : "tab"
              }
              onClick={() => {
                setCurrentReport(0);
              }}
            >
              Deliveries
            </a>
            <a
              className={
                currentReport == 1
                  ? "tab tab-active"
                  : "tab"
              }
              onClick={() => {
                setCurrentReport(1);
              }}
            >
              Stats
            </a>
            <a
              className={
                currentReport == 2
                  ? "tab tab-active"
                  : "tab"
              }
              onClick={() => {
                setCurrentReport(2);
              }}
            >
              Pitch Map
            </a>
          </div>
          <div>{renderReport()}</div>
        </div>
      </div>
    </>
  );
}

export default BowlingPanel;
