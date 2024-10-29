import { useEffect, useContext, useState } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";
import { easyPrintExtension } from "../helper/easyPrintHelper";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const [print, setPrint] = useState(null);
  const [showPrintSettings, setShowPrintSettings] = useState(false);

  const customPrint = () => {
    if (print && routedMapRef) {
      removePrevRec(routedMapRef.leafletMap.leafletElement);
      setShowPrintSettings(true);
      print.customPrintMap("a3CssClass");
    }
  };

  const removePrevRec = (map) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Rectangle) {
        map.removeLayer(layer);
      }
    });
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
        sizeModes: [customSize],
        hidden: true,
        hideClasses: ["print-btn"],
      }).addTo(map);

      printControl.customPrintMap = easyPrintExtension.customPrintMap;
      printControl._customCreateImagePlaceholder =
        easyPrintExtension._customCreateImagePlaceholder;
      printControl._customResizeAndPrintMap =
        easyPrintExtension._customResizeAndPrintMap;
      printControl._customPrintOpertion =
        easyPrintExtension._customPrintOpertion;
      printControl._customSendToBrowserPrint =
        easyPrintExtension._customSendToBrowserPrint;
      printControl._customCreateNewWindow =
        easyPrintExtension._customCreateNewWindow;
      printControl._customCreateOuterContainer =
        easyPrintExtension._customCreateOuterContainer;

      setPrint(printControl);

      const addRectangleToMap = () => {
        if (!showPrintSettings) {
          removePrevRec(map);

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
        } else {
          removePrevRec(map);
        }
      };

      if (!showPrintSettings) {
        addRectangleToMap();
      }

      map.on("zoom", addRectangleToMap);
      map.on("move", () => {
        addRectangleToMap();
      });
      map.on("easyPrint-start", () => {});
      map.on("easyPrint-finished", () => {
        setShowPrintSettings(false);
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
        if (print) {
          map.removeControl(print);
        }
      };
    }
  }, [routedMapRef, showPrintSettings]);

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
      <button onClick={customPrint} className="print-btn">
        Print
      </button>
    </div>
  );
};

export default EasyPrintControl;

// const landscapePrint = () => {
//   if (print) {
//     print.printMap("A4Landscape page");
//   }
// };
