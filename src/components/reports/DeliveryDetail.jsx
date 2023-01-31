import React from "react";
import FieldingPosition from "../Deliveries/FieldingPosition";
import FieldingMap from "../Deliveries/FieldingMap";

function DeliveryDetail({ delivery, minLat, maxLat, minLong, maxLong, onSynchVideo }) {
  const doSynchVideo = () => {
    onSynchVideo();
  };

  function getRuns(del) {
    const r1 = del.BatScore === undefined ? 0 : Number.parseInt(del.BatScore);
    const r2 = del.Wides === undefined ? 0 : Number.parseInt(del.Wides);
    const r3 = del.NoBalls === undefined ? 0 : Number.parseInt(del.NoBalls);
    const r4 = del.LegByes === undefined ? 0 : Number.parseInt(del.LegByes);
    const r5 = del.Byes === undefined ? 0 : Number.parseInt(del.Byes);
    const r6 =
      del.PenaltyRuns === undefined ? 0 : Number.parseInt(del.PenaltyRuns);

    return r1 + r2 + r3 + r4 + r5 + r6;
  }

  function getExtras(del) {
    var s = " ";
    const r2 = del.Wides === undefined ? 0 : Number.parseInt(del.Wides);
    const r3 = del.NoBalls === undefined ? 0 : Number.parseInt(del.NoBalls);
    const r4 = del.LegByes === undefined ? 0 : Number.parseInt(del.LegByes);
    const r5 = del.Byes === undefined ? 0 : Number.parseInt(del.Byes);
    const r6 =
      del.PenaltyRuns === undefined ? 0 : Number.parseInt(del.PenaltyRuns);

    if (r2 > 0) s += del.Wides + "w ";
    if (r3 > 0) s += del.NoBalls + "nb ";
    if (r4 > 0) s += del.LegByes + "lb ";
    if (r5 > 0) s += del.Byes + "b ";
    if (r6 > 0) s += del.PenaltyRuns + "pr";
    if (r2 + r3 + r4 + r5 + r6 === 0) return "no extras";
    return s;
  }

  if (delivery === null || delivery === undefined) {
    return <></>;
  }
  return (
    <>
      <div className="flex justify-between">
        <div className="m-4 h-50 w-50 bg-base-100">
          <FieldingMap 
            delivery={delivery} 
            minLat={minLat}
            maxLat={maxLat}
            minLong={minLong}
            maxLong={maxLong}
      />
        </div>
        {/* <div className="h-60 w-80 bg-base-100">
          <FieldingPosition 
            delivery={delivery} 
            minLat={minLat}
            maxLat={maxLat}
            minLong={minLong}
            maxLong={maxLong}
            />
        </div> */}
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="flex mx-6 justify-between">
            <h2 className="card-title">
              Over {delivery.Over - 1}.{delivery.BallInOver}
            </h2>
            <button className="btn btn-sm btn-primary" onClick={doSynchVideo}>
              Synch Video
            </button>
          </div>
          <h2 className="ml-6 card-title">
              {delivery.Bowler}{" "}
              to {delivery.Striker}
            </h2>
          <div className="flex justify-between">
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">BALL SPEED</div>
                <div className="stat-value">{delivery.BallSpeed}</div>
                <div className="stat-desc">kph</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">RUNS</div>
                <div className="stat-value text-secondary">
                  {getRuns(delivery)}
                </div>
                <div className="stat-desc">{getExtras(delivery)}</div>
              </div>

{/* <p>Angle {delivery.HitToAngle}</p>
<p>Len {delivery.HitToLen}</p>
<p>Octant {delivery.HitToOctant}</p>
<p>X {delivery.HitToXPhysical}</p>
<p>Y {delivery.HitToYPhysical}</p> */}


              {/* <div className="stat place-items-center">
              <div className="stat-title">New Registers</div>
              <div className="stat-value">1,200</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div> */}
            </div>
            {/* <p>Speed: {delivery.BallSpeed} kph</p> */}
            {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Synch Video</button>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default DeliveryDetail;
