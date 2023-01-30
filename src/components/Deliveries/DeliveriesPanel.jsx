import { useEffect, useRef, useState } from "react";
import { writeTextCentre, writeText, drawGradientRect } from "../../utils/utils";

const barheight = 20;
const topmargin = 40;
const bottommargin = 40;

function DeliveriesPanel({
  selectedDeliveries,
  selectedBowler,
  parameter,
  handleClick,
}) {
  const [currentDeliveryIndex, setCurrentDeliveryIndex] = useState(-1);
  // const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const canvasRef = useRef(null);
  const ref = useRef(null);

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

  const getDeliveryValue = (del) => {
    if (del.cricket_delivery_au === undefined) return 0;
    switch (parameter) {
      case 0:
        return del.cricket_delivery_au.runup_velocity;
      case 1:
        return del.cricket_delivery_au.runup_distance;
      case 2:
        return del.cricket_delivery_au.delivery_runup_avg_velocity;
      case 3:
        return del.cricket_delivery_au.delivery_runup_max_velocity;
      case 4:
        return del.cricket_delivery_au.delivery_load;
      case 5:
        return del.cricket_delivery_au.delivery_yaw;
      case 6:
        return del.cricket_delivery_au.delivery_roll;
      case 7:
        return del.cricket_delivery_au.delivery_resultant;
      default:
        return 0;
    }
  };

  const draw = (ctx) => {
    const canvas = canvasRef.current;
    var xmargin = 40;
    var width = canvas.width / 2;
    var fontsize = 14;
    var maxval = 0;
    var y = topmargin;
    var x = xmargin;
    for (var ne = 0; ne < selectedDeliveries.length; ne++) {
      var del = selectedDeliveries[ne];
      var val = getDeliveryValue(del)
      maxval = val > maxval ? val : maxval;
      var selcol = currentDeliveryIndex === ne ? "lightgreen" : "lightgray";
      ctx.fillStyle = selcol;
      ctx.fillRect(x, y, width - xmargin, barheight - 2);
      drawGradientRect({ctx: ctx, x: x, y: y, width: del.BallSpeed * 1.5, height: barheight - 2},{colorStops: 2, color1:'#8ed6ff', color2:'#004cb3'})
      var label = (del.Over - 1).toString() + "." + del.BallInOver.toString();
      writeText(
        { ctx: ctx, text: label, x: 0, y: y, width: 100 },
        {
          textAlign: "left",
          fontFamily: "Arial",
          fontSize: fontsize,
          color: selcol,
        }
      );
      var runs = getRuns(del);
      ctx.fillStyle = "black";
      if (runs === 4) {
        ctx.fillStyle = "blue";
      }
      if (runs === 6) {
        ctx.fillStyle = "green";
      }
      ctx.fillRect(x + 1, y + 1, 20, barheight - 4);
      writeTextCentre(
        { ctx: ctx, text: runs.toString(), x: x + 1, y: y + 3, width: 20 },
        { fontsize: fontsize, color: "white" }
      );
      if (del.BatterOut.length > 0) {
        ctx.fillStyle = "red";
        ctx.fillRect(width - 20, y + 1, 18, barheight - 4);
        writeTextCentre(
          { ctx: ctx, text: "W", x: width - 20 - 1, y: y + 3, width: 20 },
          { fontsize: fontsize, color: "white" }
        );
      }
      y += barheight;
    }
    y = topmargin;
    x = xmargin;
    var scale = (width - xmargin) / (maxval * 1.2);
    var lastval = -1;
    var lasty = y;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    for (var ne = 0; ne < selectedDeliveries.length; ne++) {
      var del = selectedDeliveries[ne];
      var val = getDeliveryValue(del)
      if (lastval !== -1) {
        ctx.beginPath();
        ctx.moveTo(x + lastval * scale, lasty);
        ctx.lineTo(x + val * scale, y + barheight / 2);
        ctx.stroke();
      }
      lastval = val;
      lasty = y + barheight / 2;
      y += barheight;
    }
  };

  const onMouseDown = (e) => {
    var x = e.nativeEvent.offsetX;
    var y = e.nativeEvent.offsetY;
    var idx = Math.floor((y - topmargin) / barheight);
    // console.log("del idx " + idx)
    setCurrentDeliveryIndex(idx);
    handleClick(selectedDeliveries[idx]);
  };

  useEffect(() => {
    // var dd = [];
    // for (var n = 0; n < deliveries.length; n++) {
    //   if (selectedBowler === null || deliveries[n].Bowler === selectedBowler) {
    //     dd.push(deliveries[n]);
    //   }
    // }
    // setSelectedDeliveries(dd);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // context.translate(0.5, 0.5);
    canvas.width = 320 * 2; //canvas.offsetWidth;
    canvas.height = (selectedDeliveries.length * barheight + topmargin + bottommargin) * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);
    draw(context);
  }, [draw]);

  return (
    <div ref={ref}>
      <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
    </div>
  );
}

export default DeliveriesPanel;
