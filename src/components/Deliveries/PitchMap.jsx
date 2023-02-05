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

const pitchtop = 20;
const xmargin = 20;
const ymargin = 40;
const pitchwidth = 305;
const poppingcreasewidth = 366;
const bowlingcreasewidth = 264;
const poppingcreaselength = 122;
const divy = 122;
const poppingcreaseinset = 43.2;
const stumpswidth = 22.86;
const stumpsheight = 71.12;
const allwidth = 380;
const allheight = pitchtop + ymargin + divy * 6 + 140;
var wids = [
  "OUTSIDE OFF",
  "OFF STUMP",
  "MIDDLE STUMP",
  "LEG STUMP",
  "OUTSIDE LEG",
];
var lens = [
  "FULL TOSS",
  "YORKER",
  "HALF VOLLEY",
  "GOOD LENGTH",
  "SHORT OF A LENGTH",
  "VERY SHORT",
];

function PitchMap({ deliveries, selectedBowler, selectedBatter, handleClick }) {
  const [xscale, setXscale] = useState(1);
  const [pattern, setPattern] = useState(null);
  const [, forceUpdate] = useState(0);

  const canvasRef = useRef(null);
  const ref = useRef(null);

  const drawPitch = (ctx, scale, origx, origy, title, hand, selectedZone) => {
    // calulate stats
    let vals = Array(5)
      .fill(0)
      .map((row, index) => new Array(6).fill(0));
    let runs = Array(5)
      .fill(0)
      .map((row, index) => new Array(6).fill(0));
    let wkts = Array(5)
      .fill(0)
      .map((row, index) => new Array(6).fill(0));
    for (var nd = 0; nd < deliveries.length; nd++) {
      const del = deliveries[nd];
      if (del.Bowler !== selectedBowler) continue;
      if (
        selectedBatter.name !== "All Batters" &&
        selectedBatter.name !== del.Striker
      )
        continue;
      if (
        (selectedBatter.name === "All Batters" &&
          ((title === "RHB" && del.StrikerHand === "Right") ||
            (title === "LHB" && del.StrikerHand === "Left"))) ||
        selectedBatter.name !== "All Batters"
      ) {
        const yidx = lens.indexOf(del.PitchYCodedDescription.toUpperCase());
        var xidx = wids.indexOf(del.PitchXCodedDescription.toUpperCase());
        if (
          xidx >= 0 &&
          xidx < wids.length &&
          yidx >= 0 &&
          yidx < lens.length
        ) {
          if (hand === 1) {
            // left hand then reserse
            xidx = 4 - xidx;
          }
          vals[xidx][yidx]++;
          runs[xidx][yidx] += Number.parseInt(del.BatScore);
          if (del.BatterOut.length > 0) {
            wkts[xidx][yidx]++;
          }
        } else {
          console.log(del);
        }
      }
    }

    const pw = pitchwidth * scale;
    const popw = poppingcreasewidth * scale;
    const popl = poppingcreaselength * scale;
    const popi = poppingcreaseinset * scale;
    const bw = bowlingcreasewidth * scale;
    const sw = stumpswidth * scale;
    const xm = xmargin * scale;
    const ym = ymargin * scale;
    const dy = divy * scale;
    const ph = 6 * dy;
    const hh = ph;
    ctx.fillStyle = "gray";
    var x = origx + ((allwidth - pitchwidth) / 2) * scale;
    var y = origy + ym;
    ctx.fillRect(x, y, pw, hh);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    x = origx + ((allwidth - poppingcreasewidth) / 2) * scale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + popw, y);
    ctx.stroke();

    var xp = ((poppingcreasewidth - bowlingcreasewidth) / 2) * scale;
    ctx.beginPath();
    ctx.moveTo(x + xp, y);
    ctx.lineTo(x + xp, y + popl * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + xp + bw, y);
    ctx.lineTo(x + xp + bw, y + popl * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + xp + popi, y);
    ctx.lineTo(x + xp + popi, y + popl);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + xp + bw - popi, y);
    ctx.lineTo(x + xp + bw - popi, y + popl);
    ctx.stroke();

    x = origx + ((allwidth - bowlingcreasewidth) / 2) * scale;
    y = origy + ym + popl;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + bw, y);
    ctx.stroke();

    // draw grid
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 1;
    x = origx + ((allwidth - bowlingcreasewidth) / 2) * scale;
    y = origy + ym;
    if (selectedZone !== null && selectedZone.hand === hand) {
      ctx.fillStyle = "#d96459";
      ctx.fillRect(
        x + (selectedZone.x * bw) / 5,
        y + selectedZone.y * popl,
        bw / 5,
        popl
      );
    }
    for (var n = 0; n < 6; n++) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + ph);
      ctx.stroke();
      x += bw / 5;
    }
    x = origx + ((allwidth - bowlingcreasewidth) / 2) * scale;
    y = origy + ym + popl;
    for (var n = 0; n < 6; n++) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + bw, y);
      ctx.stroke();
      y += popl;
    }

    // draw stats
    x = origx + ((allwidth - bowlingcreasewidth) / 2) * scale;
    y = origy + ym;
    for (var nx = 0; nx < 5; nx++) {
      var ty = y;
      for (var ny = 0; ny < 6; ny++) {
        if (vals[nx][ny] !== 0) {
          writeTextCentre(
            { ctx: ctx, text: vals[nx][ny], x: x, y: ty + 1, width: bw / 5 },
            { fontSize: 36 * scale, color: "white" }
          );
        }
        if (runs[nx][ny] !== 0) {
          writeTextCentre(
            {
              ctx: ctx,
              text: runs[nx][ny],
              x: x,
              y: ty + popl * 0.4,
              width: bw / 5,
            },
            { fontSize: 32 * scale, color: "#ffcc5c" }
          );
        }
        if (wkts[nx][ny] !== 0) {
          const rad = 17 * scale
          const bw5 = bw/5
          drawCircle(ctx, x + bw5/2, ty + popl * 0.66 + rad, rad, '#588c7e', '#588c7e')
          writeTextCentre(
            {
              ctx: ctx,
              text: wkts[nx][ny],
              x: x,
              y: ty + popl * 0.69,
              width: bw5,
            },
            { fontSize: 30 * scale, color: "white" }
          );
        }
        ty += popl;
      }
      x += bw / 5;
    }

    // the wicket
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    x = origx + ((allwidth - stumpswidth) / 2) * scale;
    y = origy + ym + popl;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sw, y);
    ctx.stroke();

    writeTextCentre(
      {
        ctx: ctx,
        text: title.toUpperCase(),
        x: origx,
        y: origy - 10,
        width: allwidth * scale,
      },
      { fontSize: 40 * scale, color: "white" }
    );
  };

  const drawLengthLabels = (ctx, scale, x, y, width, height) => {
    for (var n=0; n<lens.length; n++)
    {
      writeTextWithLineBreak(
        {
          ctx: ctx,
          text: lens[n].toUpperCase(),
          x: x,
          y: y,
          width: width,
          height: height
        },
        { fontSize: 30 * scale, color: "lightgray", textAlign: "center", textBaseline: "center" }
      );
      y += poppingcreaselength * scale
    }
  }

  const draw = (ctx, scale, selectedZone) => {
    const canvas = canvasRef.current;
    var w = canvas.width;
    ctx.fillStyle = "#588c7e";
    ctx.fillRect(0, 0, w / 2, allheight * scale);

    const labelheight = poppingcreaselength * scale * 0.8
    const labely = poppingcreaselength * scale * 0.1
    const labelwidth = canvas.width / 2 - (poppingcreasewidth + xmargin) * 2 * scale
    if (selectedBatter.name === "All Batters") {
      drawPitch(ctx, scale, 0 + xmargin * scale, pitchtop, "RHB", 0, selectedZone);
      const midx = canvas.width / 4 + (canvas.width / 4 - allwidth * scale) - xmargin * scale;
      drawPitch(ctx, scale, midx, pitchtop, "LHB", 1, selectedZone);

      drawLengthLabels(ctx, scale, canvas.width / 4 - labelwidth / 2, pitchtop + ymargin * scale + labely, labelwidth, labelheight )
    } else {
      const midx = (canvas.width / 2 - allwidth * scale) / 2;
      const hand = selectedBatter.hand === "Right" ? 0 : 1;
      drawPitch(
        ctx,
        scale,
        midx,
        pitchtop,
        selectedBatter.name,
        hand,
        selectedZone
      );
    }

    if (selectedZone !== null) {
      const shand = selectedZone.hand === 0 ? "RHB" : "LHB";
      var s =
        shand + " - " + wids[selectedZone.x] + " - " + lens[selectedZone.y];
      writeTextWithLineBreak(
        {
          ctx: ctx,
          text: s,
          x: 0,
          y: (allheight - 60) * scale,
          width: canvas.width / 2,
        },
        { fontSize: 40 * scale, color: "white", textAlign: "center" }
      );
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 320 * 2; //320 * 2; //canvas.offsetWidth;
    canvas.height = 800 * 2; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // var scale = (canvas.width * 0.8) / ((maxLat - minLat) * 100000);
    var sc = (canvas.width / 4 / allwidth) * 0.8;
    setXscale(sc);
    draw(context, sc, null);
  }, [selectedBowler, selectedBatter]);

  function getDeliveries(x, y, hand) {
    var dels = [];
    for (var nd = 0; nd < deliveries.length; nd++) {
      const del = deliveries[nd];
      if (del.Bowler !== selectedBowler) continue;
      if (
        selectedBatter.name !== "All Batters" &&
        selectedBatter.name !== del.Striker
      )
        continue;
      if (
        (selectedBatter.name === "All Batters" &&
          ((hand === 0 && del.StrikerHand === "Right") ||
            (hand === 1 && del.StrikerHand === "Left"))) ||
        selectedBatter.name !== "All Batters"
      ) {
        // if (
        //   (hand === 0 && del.StrikerHand === "Right") ||
        //   (hand === 1 && del.StrikerHand === "Left")
        // ) {
        const yidx = lens.indexOf(del.PitchYCodedDescription.toUpperCase());
        var xidx = wids.indexOf(del.PitchXCodedDescription.toUpperCase());
        if (hand === 1) {
          // left hand then reserse
          xidx = 4 - xidx;
        }
        if (xidx === x && yidx === y) {
          dels.push(del);
        }
      }
    }
    return dels;
  }

  const onMouseDown = (e) => {
    const canvas = canvasRef.current;
    var hand =
      e.nativeEvent.offsetX >
      canvas.width / 4 + (canvas.width / 4 - allwidth * xscale)
        ? 1
        : 0;
    var origx =
      hand === 0
        ? 0 + xmargin * xscale
        : canvas.width / 4 + (canvas.width / 4 - allwidth * xscale) - xmargin * xscale;
    if (selectedBatter.name !== "All Batters") {
      origx = (canvas.width / 2 - allwidth * xscale) / 2;
      hand = selectedBatter.hand === "Right" ? 0 : 1;
    }
    var bx = origx + ((allwidth - bowlingcreasewidth) / 2) * xscale;
    var x = Math.floor(
      (e.nativeEvent.offsetX - bx) / ((bowlingcreasewidth / 5) * xscale)
    );
    var y = Math.floor(
      (e.nativeEvent.offsetY - pitchtop - ymargin * xscale) /
        (poppingcreaselength * xscale)
    );
    if (x < 0 || y < 0 || x > 5 || y > 6) {
      return;
    }
    var dels = getDeliveries(x, y, hand);
    // var idx = Math.floor((y - topmargin) / barheight);
    // // console.log("del idx " + idx)
    // setCurrentDeliveryIndex(idx);
    handleClick(dels);
    const ctx = canvas.getContext("2d");
    draw(ctx, xscale, { hand: hand, x: x, y: y });
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

export default PitchMap;
