import { Status, Wrapper } from "@googlemaps/react-wrapper";
import logo from './logo.svg';
import { Map, MapListWithStore } from "./components/mapComponent";
import { Provider } from "react-redux";
import { Store } from "./reducer";
import { AutocompleteWidget } from "./components/Autocomplete/AutocompleteWidget";


const render = (status = Status) => {
  return <h1>{status}</h1>;
};
function App() {
  return ( <div> 
  
    <Wrapper apiKey={"AIzaSyCC-wNU3s8EZpAIP0Rdbp7M1w_9nriMeok"} render={render} libraries={["places"]}>
    <Provider store={Store}>
      <MapListWithStore/>
      <AutocompleteWidget/>
    </Provider>
      
    </Wrapper>
</div>
      


  );
}

export default App;
