import React, { useEffect, useContext } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  useEffect(() => {
    if (routedMapRef && L.easyPrint) {
      const map = routedMapRef.leafletMap.leafletElement;
      const wmsLayer = L.tileLayer
        .wms("https://geodaten.metropoleruhr.de/spw2/service", {
          layers: "spw2_light",
          format: "image/png",
          transparent: false,
          version: "1.3.0",
          crs: L.CRS.EPSG3857,
          tiled: false,
          width: 256,
          height: 256,
        })
        .addTo(map);
      const browserControl = L.easyPrint({
        title: "Easy print",
        position: "topleft",
        sizeModes: ["A4Portrait"],
        tileWait: 20000,
        tileLayer: wmsLayer,
      }).addTo(map);

      return () => {
        map.removeControl(browserControl);
      };
    }
  }, [routedMapRef]);

  return null;
};

export default EasyPrintControl;
