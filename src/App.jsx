import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import BrowserPrintControl from "./components/mapprint/MapPrint";
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <TopicMapContextProvider>
      {/* <button onClick={handlePrint}>Print</button> */}
      <TopicMapComponent>
        <BrowserPrintControl />
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
