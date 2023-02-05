import { useEffect, useRef, useState } from "react";
import {
  writeTextCentre,
  writeText,
  drawCircle,
  drawGradientRect,
} from "../../utils/utils";

const barheight = 24;
const topmargin = 10;
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
  const [scale, setScale] = useState(1);

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
    var s = "";
    if (del.Wides !== undefined && Number.parseInt(del.Wides) !== 0)
      s += del.Wides + "w ";
    if (del.NoBalls !== undefined && Number.parseInt(del.NoBalls) !== 0)
      s += del.NoBalls + "nb ";
    if (del.Byes !== undefined && Number.parseInt(del.Byes) !== 0)
      s += del.Byes + "b ";
    if (del.LegByes !== undefined && Number.parseInt(del.LegByes) !== 0)
      s += del.LegByes + "lb ";
    if (del.PenaltyRuns !== undefined && Number.parseInt(del.PenaltyRuns) !== 0)
      s += del.PenaltyRuns + "pr ";
    return s;
  }

  const getDeliveryValue = (del) => {
    if (del.cricket_delivery_au === undefined) return 0;
    switch (parameter) {
      case 0:
        return del.cricket_delivery_au.runup_velocity * 3.6;
      case 1:
        return del.cricket_delivery_au.runup_distance;
      case 2:
        return del.cricket_delivery_au.delivery_runup_avg_velocity * 3.6;
      case 3:
        return del.cricket_delivery_au.delivery_runup_max_velocity * 3.6;
      case 4:
        return del.cricket_delivery_au.delivery_load;
      case 5:
        return del.cricket_delivery_au.delivery_yaw;
      case 6:
        return del.cricket_delivery_au.delivery_roll;
      case 7:
        return del.cricket_delivery_au.delivery_resultant;
      case 8:
        return { air: del.MovementInAir, pitch: del.MovementOffPitch };
      default:
        return 0;
    }
  };

  const draw = (ctx) => {
    const canvas = canvasRef.current;
    var xmargin = 40;
    var cwidth = (canvas.width / 2) * scale;
    var width = cwidth * scale;
    var fontsize = 14 * scale;
    var bh = barheight * scale;
    var maxval = 0;
    var y = topmargin;
    var x = xmargin;
    for (var ne = 0; ne < selectedDeliveries.length; ne++) {
      var del = selectedDeliveries[ne];
      var val = getDeliveryValue(del);
      maxval = val > maxval ? val : maxval;
      var selcol = currentDeliveryIndex === ne ? "#d96459" : "#808f99";
      // ctx.fillStyle = selcol;
      // ctx.fillRect(x, y, width - xmargin, bh - 2);
      drawGradientRect(
        { ctx: ctx, x: x, y: y, width: width - xmargin, height: bh - 2 },
        { colorStops: 2, color1: "#808f99", color2: selcol }
      );
      drawGradientRect(
        { ctx: ctx, x: x, y: y, width: del.BallSpeed * 1.5, height: bh - 2 },
        { colorStops: 2, color1: "#294f7d", color2: "#294f7d" }
      );
      ctx.fillStyle = "black";
      ctx.fillRect(0, y, xmargin, bh - 2);
      var label = (del.Over - 1).toString() + "." + del.BallInOver.toString();
      writeText(
        { ctx: ctx, text: label, x: 2, y: y + 4, width: 100 },
        {
          textAlign: "left",
          fontFamily: "Arial",
          fontSize: fontsize,
          color: selcol,
        }
      );
      var runs = Number.parseInt(del.BatScore); //getRuns(del);
      if (runs > 0) {
        var fillcolors = [
          "gray",
          "#ffeead",
          "#ffcc5c",
          "#f2ae72",
          "#ff6f69",
          "#ff6f69",
          "#588c7e",
        ];
        var textcolors = [
          "white",
          "black",
          "black",
          "white",
          "white",
          "white",
          "white",
        ];
        var fs = fillcolors[runs];
        var tc = textcolors[runs];
        const rad = (bh - 4) / 2;
        drawCircle(ctx, x + 1 * scale + rad, y + rad, rad, fs, fs);
        writeTextCentre(
          {
            ctx: ctx,
            text: runs.toString(),
            x: x + 1 * scale,
            y: y + 4 * scale,
            width: 2 * rad * scale,
          },
          { fontSize: fontsize, color: tc }
        );
      }

      var sextra = getExtras(del);
      if (sextra !== "") {
        writeTextCentre(
          {
            ctx: ctx,
            text: sextra,
            x: x + 18 * scale,
            y: y + 4 * scale,
            width: 40 * scale,
          },
          { fontSize: 12 * scale, color: "white" }
        );
      }

      if (parameter === null) {
        writeText(
          {
            ctx: ctx,
            text: del.Striker.toUpperCase(),
            x: x + 60 * scale,
            y: y + 6,
            width: width - xmargin - 60 * scale,
          },
          {
            textAlign: "left",
            fontFamily: "Arial",
            fontSize: 10 * scale,
            color: "#808f99",
          }
        );
      }

      if (del.BatterOut.length > 0) {
        ctx.fillStyle = "#c83349";
        ctx.fillRect(width - 20 * scale, y + 1, 18 * scale, bh - 4);
        writeTextCentre(
          {
            ctx: ctx,
            text: "W",
            x: width - 20 * scale,
            y: y + 4,
            width: 18 * scale,
          },
          { fontSize: fontsize, color: "white" }
        );
      }
      y += bh;
    }

    y = topmargin;
    x = xmargin;
    var vscale = (width - xmargin) / (maxval * 1.2);
    var lastval = -1;
    var lasty = y;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    for (var ne = 0; ne < selectedDeliveries.length; ne++) {
      var del = selectedDeliveries[ne];
      var val = getDeliveryValue(del);
      if (val === 0) continue;
      if (parameter === 8) {
        writeText(
          {
            ctx: ctx,
            text: val.air,
            x: x  + 120 - 4,
            y: y + ((bh - 2) / 2) * scale,
            width: 40 * scale,
          },
          {
            textAlign: "right",
            fontFamily: "Arial",
            fontSize: fontsize * 0.8,
            color: "#ffcc5c",
          }
        );
        writeText(
          {
            ctx: ctx,
            text: val.pitch,
            x: x  + 120 + 4,
            y: y + 2 * scale,
            width: 40 * scale,
          },
          {
            textAlign: "left",
            fontFamily: "Arial",
            fontSize: fontsize * 0.8,
            color: "#ffcc5c",
          }
        );

        ctx.beginPath();
        ctx.moveTo(x + 120, y);
        ctx.lineTo(x + 120, y + bh - 2);
        ctx.stroke();
      } else {
        writeText(
          {
            ctx: ctx,
            text: val.toFixed(2),
            x: x - 4 + val * vscale * scale,
            y: y + 4 * scale,
            width: 200 * scale,
          },
          {
            textAlign: "right",
            fontFamily: "Arial",
            fontSize: fontsize,
            color: "#ffcc5c",
          }
        );
        ctx.beginPath();
        ctx.moveTo(x + val * vscale, y);
        ctx.lineTo(x + val * vscale, y + bh - 2);
        ctx.stroke();
      }

      // if (lastval !== -1) {
      //   ctx.beginPath();
      //   ctx.moveTo(x + lastval * vscale, lasty);
      //   ctx.lineTo(x + val * vscale, y + bh / 2);
      //   ctx.stroke();
      // }
      lastval = val;
      lasty = y + bh / 2;
      y += bh;
    }
  };

  const onMouseDown = (e) => {
    var x = e.nativeEvent.offsetX / scale;
    var y = e.nativeEvent.offsetY / scale;
    var idx = Math.floor(((y - topmargin) / barheight) * scale);
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
    var sc = canvas.offsetWidth / 300;
    setScale(sc);
    canvas.width = canvas.offsetWidth * 2; //canvas.offsetWidth;
    canvas.height =
      (selectedDeliveries.length * barheight * sc + topmargin + bottommargin) *
      2; //canvas.offsetHeight;
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
