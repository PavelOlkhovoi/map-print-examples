import { useEffect, useContext, useState } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const [print, setPrint] = useState(null);
  const handlePrintClick = () => {
    if (print) {
      console.log(print);
      print.printMap("A4Portrait page", "MyFileName");
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
        exportOnly: true,
        hideControlContainer: true,
      };
      const printControl = L.easyPrint({
        title: "Easy print",
        position: "topleft",
        sizeModes: ["A4Portrait", "A4Landscape", customSize],
      }).addTo(map);

      setPrint(printControl);

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
