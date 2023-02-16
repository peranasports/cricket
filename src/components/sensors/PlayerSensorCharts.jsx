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

const chartHeight = 40

function PlayerSensorCharts( { sensordata }) {

  const canvasRef = useRef(null);
  const ref = useRef(null);

  const draw = (ctx, scale) => {
    const canvas = canvasRef.current;
    var w = canvas.width;
    ctx.fillStyle = "#588c7e";
    ctx.fillRect(0, 0, w / 2, chartHeight * scale);

    if (sensordata === undefined || sensordata === null)
    {
        writeTextCentre(
            { ctx: ctx, text: "Loading...", x: 20, y: chartHeight/2, width: 1 },
            { fontSize: 24 * scale, color: "white" }
          );        
    }
    else
    {
        for (var n=0; n<2000; n+=100)
        {
            writeTextCentre(
                { ctx: ctx, text: n.toString(), x: n, y: chartHeight/2, width: 1 },
                { fontSize: 24 * scale, color: "white" }
              );
        }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 2000 * 2; //320 * 2; //canvas.offsetWidth;
    canvas.height = 40 * 2; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // // var scale = (canvas.width * 0.8) / ((maxLat - minLat) * 100000);
    // var sc = (canvas.width / 4 / allwidth) * 0.8;
    // setXscale(sc);
    var sc = 1
    draw(context, sc);
  }, []);

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

export default PlayerSensorCharts