import { useEffect, useRef, useState } from "react";
import {
  drawEllipseRectangle,
  drawPieSegment,
  writeTextCentre,
  writeText,
  drawGradientRect,
  drawCircle,
} from "../../utils/utils";

function FieldingMap({ delivery, minLat, maxLat, minLong, maxLong }) {
  const [defaultLat, setDefaultLat] = useState(0);
  const [defaultLong, setDefaultLong] = useState(0);
  const [positions, setPositions] = useState([]);
  const [, forceUpdate] = useState(0);

  const canvasRef = useRef(null);
  const ref = useRef(null);

  const draw = (ctx, scale) => {
    const canvas = canvasRef.current;
    var w = canvas.width * 0.8;
    var xmargin = (canvas.width - w) / 2;
    var h = w;

    // ctx.fillStyle = "green";
    // ctx.fillRect(0, 0, canvas.width/2, canvas.width/2)

    drawEllipseRectangle(
      ctx,
      0,
      0,
      canvas.width / 2 - 1,
      canvas.width / 2 - 1,
      "darkgreen",
      "white",
      1
    );

    var octant = delivery.HitToOctant
    var quarterpi = Math.PI/4
    var leftangles = [-quarterpi * 2, -quarterpi, 0, quarterpi, quarterpi * 2, quarterpi * 3, quarterpi * 4, -quarterpi * 3, -quarterpi * 2]
    var rightangles = [-quarterpi * 2, -quarterpi * 3, quarterpi * 4, quarterpi * 3, quarterpi * 2, quarterpi, 0, -quarterpi, -quarterpi * 2]
    if (delivery.StrikerHand === 'Right')
    {
        var startangle = rightangles[octant - 1]
        var endangle = rightangles[octant]
        drawPieSegment(ctx, canvas.width/4, canvas.width/4, canvas.width/4, startangle, endangle, 'lightgreen', 'lightgreen', 1, true)
        var angle = (delivery.HitToAngle / 180) * Math.PI + Math.PI / 2
        var len = (delivery.HitToLen / 100) * canvas.width/4
        drawPieSegment(ctx, canvas.width/4, canvas.width/4, len, angle, angle, 'black', 'black', 1, true)
    }
    else
    {
        var startangle = leftangles[octant - 1]
        var endangle = leftangles[octant]
        drawPieSegment(ctx, canvas.width/4, canvas.width/4, canvas.width/4, startangle, endangle, 'lightgreen', 'lightgreen', 1, false)
        var angle = (-delivery.HitToAngle / 180) * Math.PI + Math.PI / 2
        var len = (delivery.HitToLen / 100) * canvas.width/4
        drawPieSegment(ctx, canvas.width/4, canvas.width/4, len, angle, angle, 'black', 'black', 1, true)
    }

    var pos = [];
    for (var n = 0; n < delivery.playersensors.length; n++) {
      var ps = delivery.playersensors[n];
      if (ps.lat === 0 || ps.long === 0) continue;
      var name = ps.athlete.last_name + ", " + ps.athlete.first_name;
      var initials =
        ps.athlete.first_name.substring(0, 1) +
        ps.athlete.last_name.substring(0, 1);
      pos.push({
        x: ps.lat,
        y: ps.long,
        initials: initials,
        name: name,
      });
    }

    var midx = (minLat + maxLat) / 2;
    var midy = (minLong + maxLong) / 2;
    for (var n = 0; n < pos.length; n++) {
      var ps = pos[n];
      var px = (ps.y - midy) * 100000;
      var py = (ps.x - midx) * 100000;
    
      px = canvas.width / 4 + px * scale;
      py = canvas.width / 2 - (canvas.width / 4 + py * scale);

      if (delivery.NorthernEnd === 'N')
      {
        px = canvas.width / 2 - px
        py = canvas.width / 2 - py
      }

      // py = (canvas.width/2 - py)
      // px = px
      // var py = (xmargin/2 + (ps.x - midx) / 2)
      // var px = xmargin/2 + (ps.y - midy) / 2
      if (delivery.Bowler === ps.name) {
        drawCircle(ctx, px, py, 4, "red", "white", 1);
      } else if (delivery.Keeper === ps.name) {
        drawCircle(ctx, px, py, 4, "blue", "white", 1);
      } else {
        drawCircle(ctx, px, py, 4, "gray", "white", 1);
      }
    }
  };

  const onMouseDown = (e) => {
    var x = e.nativeEvent.offsetX;
    var y = e.nativeEvent.offsetY;
    // var idx = Math.floor((y - topmargin) / barheight);
    // // console.log("del idx " + idx)
    // setCurrentDeliveryIndex(idx);
    // handleClick(selectedDeliveries[idx]);
  };

  useEffect(() => {
    if (delivery.playersensors === undefined) {
      return;
    }
    // var pos = [];
    // for (var n = 0; n < delivery.playersensors.length; n++) {
    //   var ps = delivery.playersensors[n];
    //   if (ps.lat === 0 || ps.long === 0) continue;
    //   var name = ps.athlete.last_name + ", " + ps.athlete.first_name;
    //   var initials =
    //     ps.athlete.first_name.substring(0, 1) +
    //     ps.athlete.last_name.substring(0, 1);
    //   pos.push({
    //     x: ps.lat,
    //     y: ps.long,
    //     initials: initials,
    //     name: name,
    //   });
    // }
    // setPositions(pos);
    setDefaultLat((maxLat + minLat) / 2);
    setDefaultLong((maxLong + minLong) / 2);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = 300; //320 * 2; //canvas.offsetWidth;
    canvas.height = 300; //320 * 2; //canvas.offsetHeight;
    canvas.style.width = (canvas.width / 2).toString() + "px";
    canvas.style.height = (canvas.height / 2).toString() + "px";
    const dpi = window.devicePixelRatio;
    context.scale(dpi, dpi);

    // var scale = (canvas.width * 0.8) / ((maxLat - minLat) * 100000);
    var scale = (canvas.width/2) / ((maxLat - minLat) * 100000)
    scale = scale * 0.7

    // draw(context, -37.8201, 144.9824);
    draw(context, scale);
  }, [delivery]);

  return (
    <div ref={ref}>
      <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
    </div>
  );
}

export default FieldingMap;
