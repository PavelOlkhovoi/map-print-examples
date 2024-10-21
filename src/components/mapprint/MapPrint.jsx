import { useContext, useEffect, useState } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";

const Shapes = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const [rectangle, setRectangle] = useState(null);

  const getRectangleSizes = () => {
    if (rectangle && routedMapRef) {
      const bounds = rectangle.getBounds();
      const northWest = bounds.getNorthWest();
      const southEast = bounds.getSouthEast();

      const map = routedMapRef.leafletMap.leafletElement;

      const nwPoint = map.latLngToContainerPoint(northWest);
      const sePoint = map.latLngToContainerPoint(southEast);

      const width = sePoint.x - nwPoint.x;
      const height = sePoint.y - nwPoint.y;
    }
  };

  useEffect(() => {
    if (routedMapRef) {
      const map = routedMapRef.leafletMap.leafletElement;

      const a4Polygon = [
        [51.2266, 7.1548],
        [51.2266 + 0.023, 7.1548],
        [51.2266 + 0.023, 7.1548 + 0.032],
        [51.2266, 7.1548 + 0.032],
      ];

      const rect = L.rectangle(a4Polygon, { color: "black" }).addTo(map);
      setRectangle(rect);
    }
  }, [routedMapRef]);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1600,
        top: 120,
        left: 12,
        display: "flex",
        gap: 4,
      }}
    >
      <button onClick={getRectangleSizes} className="print-control">
        Rect
      </button>
    </div>
  );
};

export default Shapes;
