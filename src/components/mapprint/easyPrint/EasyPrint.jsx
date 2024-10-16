import { useEffect, useContext, useState } from "react";
import { TopicMapContext } from "react-cismap/contexts/TopicMapContextProvider";
import "leaflet-easyprint";

const EasyPrintControl = () => {
  const { routedMapRef } = useContext(TopicMapContext);
  const [print, setPrint] = useState(null);
  const PortraitPrint = () => {
    if (print) {
      print.printMap("A4Portrait page");
    }
  };
  const LandscapePrint = () => {
    if (print) {
      print.printMap("A4Landscape page");
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
        width: 1684,
        height: 1190,
        className: "a3CssClass",
        tooltip: "A custom A3 size",
      };
      const printControl = L.easyPrint({
        title: "Easy print",
        // position: "topleft",
        sizeModes: ["A4Portrait", "A4Landscape", customSize],
        hideClasses: ["print-control"],
        hidden: true,
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
      <button onClick={PortraitPrint} className="print-control">
        Portrait
      </button>
      <button onClick={LandscapePrint} className="print-control">
        Landscaoe
      </button>
      <button onClick={customPrint} className="print-control">
        Custom
      </button>
    </div>
  );
};

export default EasyPrintControl;
