import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import BrowserPrintControl from "./components/mapprint/MapPrint";
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <TopicMapContextProvider featureCollectionEnabled={false}>
      {/* <button
        onClick={handlePrint}
        style={{ position: "absolute", top: "0", left: "0", zIndex: 50000 }}
      >
        {" "}
        Print
      </button> */}
      <TopicMapComponent>
        <BrowserPrintControl />
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
