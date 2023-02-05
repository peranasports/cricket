import { useEffect, useState } from "react";
import PitchMap from "./PitchMap";
import DeliveriesPanel from "./DeliveriesPanel";

function PitchReport({ deliveries, selectedBowler, handleDeliveryClick }) {
  const [selectedDeliveries, setSelectedDeliveries] = useState(0);
  const [batters, setBatters] = useState([])
  const [selectedBatter, setSelectedBatter] = useState({name: "All Batters", hand:""})
  const [, forceUpdate] = useState(0);

  const doHandleClick = (ret) => {
    setSelectedDeliveries(ret)
    forceUpdate((n) => !n);
  };

  const doHandleDeliveryClick = (ret) =>
  {
    handleDeliveryClick(ret)
  }

  function onBatterSelected(e) {
    if (e === undefined) return;
    for (var nb=0; nb<batters.length; nb++)
    {
        if (batters[nb].name === e.target.value)
        {
            setSelectedBatter(batters[nb]);
            break
        }
    }
    setSelectedDeliveries([])    
    // forceUpdate((n) => !n);
  }

  useEffect(() => {
    var bts = [{name: "All Batters", hand:""}]
    for (var nd = 0; nd < deliveries.length; nd++) {
        const del = deliveries[nd];
        if (del.Bowler !== selectedBowler) continue;
        var exists = false
        for (var nb=0; nb<bts.length; nb++)
        {
            if (bts[nb].name === del.Striker)
            {
                exists = true
                break
            }
        }
        if (exists === false)
        {
            bts.push({name:del.Striker, hand:del.StrikerHand})
        }
    }
    setBatters(bts)
    setSelectedBatter({name: "All Batters", hand:""})
    setSelectedDeliveries([])    
    forceUpdate((n) => !n);
}, [selectedBowler]);

  return (
    <>
      <div className="my-2">
          <select
            className="select select-info text-xl w-full"
            value={selectedBatter.name}
            onChange={onBatterSelected}
          >
            {batters.map((batter, i) => (
              <option key={i}>{batter.name}</option>
            ))}
          </select>
        </div>
      <div className="flex-col h-[312px]">
        <PitchMap
          deliveries={deliveries}
          selectedBowler={selectedBowler}
          selectedBatter={selectedBatter}
          handleClick={(ret) => doHandleClick(ret)}
        />
      </div>
      <div className="overflow-y-auto h-[33vh] ">
        <DeliveriesPanel
          style={{ width: "200px" }}
          selectedDeliveries={selectedDeliveries}
          selectedBowler={selectedBowler}
          parameter={null}
          handleClick={(del) => doHandleDeliveryClick(del)}
        />
      </div>
    </>
  );
}

export default PitchReport;
