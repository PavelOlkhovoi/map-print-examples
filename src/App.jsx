import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
function App() {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent showModalMenuOverride={false}></TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
