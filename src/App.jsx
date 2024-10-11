import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import BrowserPrintControl from "./components/mapprint/MapPrint";
function App() {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent>
        <BrowserPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
