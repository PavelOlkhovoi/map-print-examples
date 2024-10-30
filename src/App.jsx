import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent>
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
