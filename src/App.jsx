import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import Shapes from "./components/mapprint/MapPrint";
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  return (
    <TopicMapContextProvider>
      {/* <div
        style={{
          position: "absolute",
          zIndex: 1600,
          top: 174,
          left: 12,
          display: "flex",
          gap: 4,
        }}
      >
        <button>Portrait</button>
        <button>Landscaoe</button>
        <button>Custom</button>
      </div> */}
      <TopicMapComponent>
        <Shapes />
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
