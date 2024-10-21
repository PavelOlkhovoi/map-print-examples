import { useEffect, useContext, useState } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const [print, setPrint] = useState(null);

  const portraitPrint = () => {
    if (print) {
      print.printMap("A4Portrait page");
    }
  };

  const customPrint = () => {
    if (print) {
      print.printMap("a3CssClass");
    }
  };
  useEffect(() => {
    if (routedMapRef && L.easyPrint) {
      const map = routedMapRef.leafletMap.leafletElement;
      const customSize = {
        name: "Custom",
        width: 350,
        height: 495,
        className: "a3CssClass",
        tooltip: "A custom A3 size",
      };
      const printControl = L.easyPrint({
        title: "Easy print",
        // sizeModes: ["A4Portrait", "A4Landscape", customSize],
        sizeModes: [customSize],
        hidden: true,
      }).addTo(map);

      setPrint(printControl);

      const addRectangleToMap = () => {
        map.eachLayer((layer) => {
          if (layer instanceof L.Rectangle) {
            map.removeLayer(layer);
          }
        });

        const pixelWidth = 350;
        const pixelHeight = 495;

        const mapCenter = map.getCenter();
        const centerPoint = map.latLngToLayerPoint(mapCenter);
        const topLeftPoint = L.point(
          centerPoint.x - pixelWidth / 2,
          centerPoint.y - pixelHeight / 2
        );
        const bottomRightPoint = L.point(
          centerPoint.x + pixelWidth / 2,
          centerPoint.y + pixelHeight / 2
        );
        const topLeftLatLng = map.layerPointToLatLng(topLeftPoint);
        const bottomRightLatLng = map.layerPointToLatLng(bottomRightPoint);
        const rectangleBounds = [topLeftLatLng, bottomRightLatLng];
        L.rectangle(rectangleBounds, {
          color: "black",
          weight: 1,
        }).addTo(map);
      };

      addRectangleToMap();

      map.on("zoom", addRectangleToMap);
      map.on("move", () => {
        addRectangleToMap();
      });

      if (
        typeof SVGElement !== "undefined" &&
        SVGElement.prototype.hasOwnProperty("className")
      ) {
        Object.defineProperty(SVGElement.prototype, "className", {
          set: function (value) {
            this.setAttribute("class", value);
          },
          get: function () {
            return this.getAttribute("class");
          },
        });
      }
      return () => {
        map.removeControl(printControl);
      };
    }
  }, [routedMapRef]);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1600,
        top: 174,
        left: 12,
        display: "flex",
        gap: 4,
      }}
    >
      <button onClick={customPrint}>Custom</button>
    </div>
  );
};

export default EasyPrintControl;

// const landscapePrint = () => {
//   if (print) {
//     print.printMap("A4Landscape page");
//   }
// };
