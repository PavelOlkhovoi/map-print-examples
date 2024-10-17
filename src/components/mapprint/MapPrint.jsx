import { useContext, useEffect } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";

const BrowserPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);

  useEffect(() => {
    if (routedMapRef) {
      const map = routedMapRef.leafletMap.leafletElement;

      L.polyline(
        [
          [51.046, 7.6],
          [51.05, 7.61],
          [51.04, 7.62],
        ],
        { color: "blue" }
      ).addTo(map);

      L.polygon(
        [
          [51.046, 7.64],
          [51.046, 7.67],
          [51.05, 7.67],
          [51.05, 7.64],
        ],
        { color: "red" }
      ).addTo(map);

      // return () => {
      //   map.removeControl(browserControl);
      // };
    }
  }, [routedMapRef]);

  return null;
};

export default BrowserPrintControl;
