import { useEffect, useContext, useRef } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const printControlRef = useRef(null);
  const handlePrintClick = () => {
    if (printControlRef.current && printControlRef.current.printMap) {
      printControlRef.current.printMap("A4Portrait");
    }
  };
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
      printControlRef.current = L.easyPrint({
        title: "Easy print",
        position: "topleft",
        sizeModes: ["A4Portrait", "A4Landscape", customSize],
      }).addTo(map);

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
        map.removeControl(printControlRef.current);
      };
    }
  }, [routedMapRef]);

  return (
    <div>
      <button
        onClick={handlePrintClick}
        style={{ position: "absolute", zIndex: 1600 }}
      >
        Print A4 Portrait
      </button>
    </div>
  );
};

export default EasyPrintControl;
