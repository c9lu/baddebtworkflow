import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ApprovalSteps  from './ApprovalSteps';
import Requests from './Requests'
import RequestDetails from './RequestDetails';
import SavedDrafts from './SavedDrafts';

function App() {

  //const [workflowInstances] = useState([]);
  //const workflowInstancesRequest = new Request('https://52.232.134.199/bin/getworkflowdata');
 
  
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/requests' component = {Requests}/>        
           <Route path='/requestDetails/:requestId' component = {RequestDetails}/>
           <Route path="/approvalsteps" component={ApprovalSteps}/>
           <Route path="/saveddrafts" component={SavedDrafts}/>
        </Switch>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
