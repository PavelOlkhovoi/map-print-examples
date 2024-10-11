import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import BrowserPrintControl from "./components/mapprint/MapPrint";
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent>
        <BrowserPrintControl />
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
