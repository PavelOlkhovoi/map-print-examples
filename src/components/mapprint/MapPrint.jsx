import React, { useContext, useEffect } from "react";
import "leaflet.browser.print/dist/leaflet.browser.print.js";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";

const BrowserPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);

  useEffect(() => {
    if (routedMapRef && L.control.browserPrint) {
      const map = routedMapRef.leafletMap.leafletElement;
      const browserControl = L.control
        .browserPrint({
          position: "topleft",
        })
        .addTo(map);

      const polyline = L.polyline(
        [
          [51.046, 7.6],
          [51.05, 7.61],
          [51.04, 7.62],
        ],
        { color: "blue" }
      ).addTo(map);

      const polygon = L.polygon(
        [
          [51.046, 7.64],
          [51.046, 7.67],
          [51.05, 7.67],
          [51.05, 7.64],
        ],
        { color: "red" }
      ).addTo(map);

      return () => {
        map.removeControl(browserControl);
        map.removeLayer(polyline);
        map.removeLayer(polygon);
      };
    }
  }, [routedMapRef]);

  return null;
};

export default BrowserPrintControl;
