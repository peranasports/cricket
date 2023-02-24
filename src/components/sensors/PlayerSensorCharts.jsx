import { useEffect, useRef, useState } from "react";
import Grass from "../assets/grass.png";
import {
  drawEllipseRectangle,
  drawPieSegment,
  writeTextCentre,
  writeTextWithLineBreak,
  writeText,
  drawGradientRect,
  drawCircle,
} from "../../utils/utils";

const chartHeight = 50;
const chartWidth = 2000;

const getValue = (sd, vtype) => {
  switch (vtype) {
    case "Velocity":
      return sd.v;
    case "Acceleration":
      return sd.a;
    case "Metabolic Power":
      return sd.mp;
    case "Player Load (instantaneous)":
      return sd.sl;
    case "Player Load (cummulative)":
      return sd.pl;
    default:
      return 0
  }
};

function PlayerSensorCharts({ sensordata, activity, value1, value2 }) {
  const canvasRef = useRef(null);
  const ref = useRef(null);

  const draw = (ctx, scale) => {
    const canvas = canvasRef.current;
    var w = canvas.width;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w / 2, chartHeight * scale);

    if (sensordata === undefined || sensordata === null) {
      writeTextCentre(
        { ctx: ctx, text: "Loading...", x: 40, y: chartHeight / 2, width: 1 },
        { fontSize: 20 * scale, color: "gray" }
      );
    } else {
      for (var n = 0; n < 2000; n += 100) {
        // writeTextCentre(
        //     { ctx: ctx, text: sensordata.athlete.last_name, x: 0, y: chartHeight/2, width: 1 },
        //     { fontSize: 24 * scale, color: "white" }
        //   );
        // writeTextCentre(
        //     { ctx: ctx, text: n.toString(), x: n + 1, y: chartHeight/2, width: 1 },
        //     { fontSize: 24 * scale, color: "white" }
        //   );
        var maxval1 = 0;
        var maxval2 = 0;
        for (var nn = 0; nn < sensordata.length; nn++) {
            const val1 = getValue(sensordata[nn], value1)
            const val2 = getValue(sensordata[nn], value2)
          maxval1 = val1 > maxval1 ? val1 : maxval1;
          maxval2 = val2 > maxval2 ? val2 : maxval2;
        }
        maxval1 = maxval1 * 1.1;
        maxval2 = maxval2 * 1.1;
        var yscale1 = chartHeight / maxval1;
        var yscale2 = chartHeight / maxval2;
        var xscale = chartWidth / (activity.end_time - activity.start_time);
        var lasty1 = 0;
        var lasty2 = 0;
        var lastx = 0;
        // draw bars first
        for (var nn = 0; nn < sensordata.length; nn++) {
            const x = (sensordata[nn].ts - activity.start_time) * xscale;
            const y2 = chartHeight - getValue(sensordata[nn], value2) * yscale2;
            if (nn > 0 && lasty2 != y2) {
              ctx.fillStyle = "green";
              ctx.fillRect(lastx, lasty2, x - lastx, chartHeight - y2)
            //   ctx.beginPath();
            //   ctx.moveTo(lastx, lasty2);
            //   ctx.lineTo(x, y2);
            //   ctx.stroke();
                lastx = x;
            }
            lasty2 = y2;
          }
  
        for (var nn = 0; nn < sensordata.length; nn++) {
          const x = (sensordata[nn].ts - activity.start_time) * xscale;
          const y1 = chartHeight - getValue(sensordata[nn], value1) * yscale1;
          const y2 = chartHeight - getValue(sensordata[nn], value2) * yscale2;
          if (nn > 0) {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(lastx, lasty1);
            ctx.lineTo(x, y1);
            ctx.stroke();
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(lastx, lasty2);
            ctx.lineTo(x, y2);
            ctx.stroke();
          }
          lastx = x;
          lasty1 = y1;
          lasty2 = y2;
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = chartWidth * 2; //320 * 2; //canvas.offsetWidth;
    canvas.height = chartHeight * 2; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // // var scale = (canvas.width * 0.8) / ((maxLat - minLat) * 100000);
    // var sc = (canvas.width / 4 / allwidth) * 0.8;
    // setXscale(sc);
    var sc = 1;
    draw(context, sc);
  }, [sensordata, value1, value2]);

  const onMouseDown = (e) => {
    const canvas = canvasRef.current;
    // var hand =
    //   e.nativeEvent.offsetX >
    //   canvas.width / 4 + (canvas.width / 4 - allwidth * xscale)
    //     ? 1
    //     : 0;
    // var origx =
    //   hand === 0
    //     ? 0 + xmargin * xscale
    //     : canvas.width / 4 + (canvas.width / 4 - allwidth * xscale) - xmargin * xscale;
    // if (selectedBatter.name !== "All Batters") {
    //   origx = (canvas.width / 2 - allwidth * xscale) / 2;
    //   hand = selectedBatter.hand === "Right" ? 0 : 1;
    // }
    // var bx = origx + ((allwidth - bowlingcreasewidth) / 2) * xscale;
    // var x = Math.floor(
    //   (e.nativeEvent.offsetX - bx) / ((bowlingcreasewidth / 5) * xscale)
    // );
    // var y = Math.floor(
    //   (e.nativeEvent.offsetY - pitchtop - ymargin * xscale) /
    //     (poppingcreaselength * xscale)
    // );
    // if (x < 0 || y < 0 || x > 5 || y > 6) {
    //   return;
    // }
    // var dels = getDeliveries(x, y, hand);
    // // var idx = Math.floor((y - topmargin) / barheight);
    // // // console.log("del idx " + idx)
    // // setCurrentDeliveryIndex(idx);
    // handleClick(dels);
    // const ctx = canvas.getContext("2d");
    // draw(ctx, xscale, { hand: hand, x: x, y: y });
  };

  return (
    <>
      <div ref={ref}>
        <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
      </div>
      <img src={Grass} id="grass" width="35" height="35"></img>
    </>
  );
}

export default PlayerSensorCharts;
