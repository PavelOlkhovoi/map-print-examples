import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
('import Shapes from "./components/mapprint/MapPrint";');
import EasyPrintControl from "./components/mapprint/easyPrint/EasyPrint";
function App() {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent>
        {/* <Shapes /> */}
        <EasyPrintControl />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
