import { useEffect, useRef, useState } from "react";
import { drawEllipseRectangle, writeTextCentre, writeText, drawGradientRect, drawCircle } from "../../utils/utils";
import GoogleMaps from "./Maps";

function FieldingPosition({delivery, minLat, maxLat, minLong, maxLong}) {
  const [defaultLat, setDefaultLat] = useState(0)
  const [defaultLong, setDefaultLong] = useState(0)
  const [positions, setPositions] = useState([])
    const [, forceUpdate] = useState(0);

    const canvasRef = useRef(null);
    const ref = useRef(null);
  
    const draw = (ctx, midx, midy) => {
        const canvas = canvasRef.current;
        var w = canvas.width * 0.8
        var xmargin = (canvas.width - w) / 2
        var h = w

        ctx.fillstyle = 'green'
        ctx.fillRect(0, 0, canvas.width, canvas.width)
        drawEllipseRectangle(ctx, xmargin/2, xmargin/2, w/2, h/2, 'green', 'black', 2)
        for (var n=0; n<delivery.playersensors.length; n++)
        {
            var ps = delivery.playersensors[n]
            var px = xmargin/2 + ps.x - midx
            var py = xmargin/2 + ps.y - midy
            drawCircle(ctx, px, py, 4, 'red', 'white', 1)
        }
    }

    const onMouseDown = (e) => {
        var x = e.nativeEvent.offsetX;
        var y = e.nativeEvent.offsetY;
        // var idx = Math.floor((y - topmargin) / barheight);
        // // console.log("del idx " + idx)
        // setCurrentDeliveryIndex(idx);
        // handleClick(selectedDeliveries[idx]);
      };
    
    useEffect(() => {
        if (delivery.playersensors === undefined)
        {
          return
        }
        var maxx = -100000
        var maxy = -100000
        var minx = 1000000
        var miny = 1000000
        var pos = []
        for (var n = 0; n < delivery.playersensors.length; n++) {
          var ps = delivery.playersensors[n]
          if (ps.lat === 0 || ps.long === 0) continue
            maxx = ps.lat > maxx ? ps.lat : maxx
            maxy = ps.long > maxy ? ps.long : maxy
            minx = ps.lat < minx ? ps.lat : minx
            miny = ps.long < miny ? ps.long : miny
            var name = ps.athlete.first_name.substring(0, 1) + ps.athlete.last_name.substring(0,1)
            pos.push({
              lat: ps.lat,
              lng: ps.long,
              id: name
            })
        }
        setDefaultLat((maxLat + minLat) / 2)
        setDefaultLong((maxLong + minLong) / 2)
        setPositions(pos)
        forceUpdate((n) => !n);
        // const canvas = canvasRef.current;
        // const context = canvas.getContext("2d");
        // canvas.width = 200 //320 * 2; //canvas.offsetWidth;
        // canvas.height = 200 //320 * 2; //canvas.offsetHeight;
        // canvas.style.width = (canvas.width / 2).toString() + "px";
        // canvas.style.height = (canvas.height / 2).toString() + "px";
        // const dpi = window.devicePixelRatio;
        // context.scale(dpi, dpi);
        // draw(context, midx, midy);
      }, [delivery]);
    
      return (
        // <div ref={ref}>
        //   <canvas id="canvas" ref={canvasRef} onMouseDown={onMouseDown} />
        // </div>
        <>
            <GoogleMaps latitude={defaultLat} longitude={defaultLong} positions={positions} ball={delivery.Over + "." + delivery.BallInOver} />
        </>
      );
    }

export default FieldingPosition