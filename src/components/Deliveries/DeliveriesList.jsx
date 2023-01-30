import { useEffect, useState } from "react";
import BowlerStatsPanel from "./BowlerStatsPanel";
import DeliveriesPanel from "./DeliveriesPanel";

function DeliveriesList({
  activity,
  deliveries,
  deliveryClicked,
  bowlerSelected,
  parameterSelected,
}) {
  const [bowlers, setBowlers] = useState([]);
  const [parameter, setParameter] = useState(0);
  const [selectedBowler, setSelectedBowler] = useState(null);
  const [bowlerDeliveries, setBowlerDeliveries] = useState([]);
  const [, forceUpdate] = useState(0);
  const parameters = [
    "Run up velocity",
    "Run up distance",
    "Run up average velocity",
    "Run up maximum velocity",
    "Delivery load",
    "Delivery yaw",
    "Delivery roll",
    "Delivery resultant",
  ];

  const handleClick = (del) => {
    deliveryClicked(del);
  };

  function onBowlerSelected(e) {
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

  function onParameterSelected(e) {
    setParameter(parameters.indexOf(e.target.value));
    parameterSelected(parameters.indexOf(e.target.value));
    forceUpdate((n) => !n);
  }

  useEffect(() => {
    var bs = [];
    for (var n = 0; n < deliveries.length; n++) {
      var del = deliveries[n];
      if (bs.filter((obj) => obj === del.Bowler).length === 0) {
        bs.push(del.Bowler);
      }
    }
    setBowlers(bs);
    if (selectedBowler === null)
    {
      setSelectedBowler(bs[0])
      bowlerSelected(bs[0]);

      var dd = [];
      for (var n = 0; n < deliveries.length; n++) {
        if (deliveries[n].Bowler === bs[0]) {
          dd.push(deliveries[n]);
        }
      }
      setBowlerDeliveries(dd);
      }
  }, [selectedBowler]);

  return (
    <>
      <div className="w-full h-full">
        <div className="mt-2 text-xl font bold">{activity.name}</div>
        <div className="mt-2">
          <select
            className="select select-info w-full max-w-xs"
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
        <div className="mt-2">
          <select
            className="select select-info w-full max-w-xs"
            value={parameters[parameter]}
            onChange={onParameterSelected}
          >
            <option disabled selected>
              Select delivery parameter
            </option>
            {parameters.map((parameter, i) => (
              <option key={i}>{parameter}</option>
            ))}
          </select>
        </div>
        <div>
          <DeliveriesPanel
            selectedDeliveries={bowlerDeliveries}
            selectedBowler={selectedBowler}
            parameter={parameter}
            handleClick={(del) => handleClick(del)}
          />
        </div>
      </div>
    </>
  );
}

export default DeliveriesList;
