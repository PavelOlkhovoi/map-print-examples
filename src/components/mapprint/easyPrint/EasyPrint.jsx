import React, { useEffect, useContext } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  useEffect(() => {
    if (routedMapRef && L.easyPrint) {
      const map = routedMapRef.leafletMap.leafletElement;
      const customSize = {
        name: "A3Landscape",
        width: 1684,
        height: 1190,
        className: "a3CssClass",
        tooltip: "A custom A3 size",
      };
      const browserControl = L.easyPrint({
        title: "Easy print",
        position: "topleft",
        sizeModes: ["A4Portrait", "A4Landscape", customSize],
      }).addTo(map);

      return () => {
        map.removeControl(browserControl);
      };
    }
  }, [routedMapRef]);

  return null;
};

export default EasyPrintControl;
