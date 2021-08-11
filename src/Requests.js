import { useEffect, useState } from 'react';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import BTable from 'react-bootstrap/Table';
import getWorkflowStatus from './GetWorkflowStatus';
function Requests(props){
// eslint-disable-next-line
    var workflowInstances  = [];
    const [loadingData, setLoadingData] = useState(true);
    const [data, setData] = useState([]);
    useEffect(()=>{
      
      
          if(loadingData){
          $.ajax({
              url:"https://aemintegrationworkflowdata.azurewebsites.net/api/HttpTrigger1?code=vwzvADYPe8VIjwtfEgZuahddyQuFWbDgrs76aCW9SebXhegTLKLB7g==",
              type:"GET",
              crossDomain:true,
           
              success:function(data){
                let workflowdata = data['2021-06-22'] ;
                var counter =0;
                for (let [key, value] of Object.entries(workflowdata)) {
                  console.log(`${key}: ${value}`);
                  if(key.indexOf('review-submitted-form')>=0){
                     counter= counter+1;
                     var _value = value.metaData;
                     var workflowStatus=getWorkflowStatus(_value);
                    
                      var _workflowinstance = {
                        request_id : key.substring(key.lastIndexOf('_')+1,key.length),
                        initiator:  value.initiator,
                        startDate: value.startTime,
                        status:workflowStatus,
                        name:_value.requestName,
                        requestType:_value.requestType,// request type
                        building:_value.building,
                        amount: _value.amount,
                        city:_value.city
                      }
                      console.log(_workflowinstance.request_id);
                     // console.log("asdfasf"+_workflowinstance.initiator)
                      workflowInstances.push(_workflowinstance)
                      // eslint-disable-next-line
                      workflowInstances = workflowInstances.sort(function(a,b){
                        return (a.request_id - b.request_id)
                      }).reverse();
                  }
                }
                setData(workflowInstances);
                setLoadingData(false);
             
              },
              error:function(err){
                alert(err);
              }
          
          })
        }
        // eslint-disable-next-line
    },[workflowInstances, loadingData])
    return (
      <div className="App">
       
          <div>
            <h1>Welcome to the Bad debt workflow demo saljfsadf</h1>
{
  <br/>
 //            eslint-disable-next-line   
}              <a href="https://author-opgi-dev-4.adobecqms.net/content/dam/formsanddocuments/bad-debt-workflow/jcr:content?wcmmode=disabled" text-align="left"target="_blank">Create New Request</a>
         {<br/>}
           { 
           
           loadingData?(<p>Loading please wait</p>):(
            <div>
             <br/> 
            <BTable striped bordered hover> 
              <thead>
                <th>Request Id</th>
                <th>Request Name</th>
                <th>Initiator</th>
                <th>Date Initiated</th>
                <th>Request Type</th>
                <th>Amount</th>
                <th>Request Status</th>
                
              </thead>
              <tbody>
              {       
                  data.map((workflowinstance, index)=>
                  {
  
                  //  alert(workflowinstance.request_id);
                  return(
                      <tr>
                          <td><Link to={`requestDetails/${workflowinstance.request_id}`}>{workflowinstance.request_id}</Link></td>
                          <td>{workflowinstance.name}</td>
                          <td>{workflowinstance.initiator}</td>
                          <td>{workflowinstance.startDate}</td>
                          <td>{workflowinstance.requestType}</td>
                          <td>${workflowinstance.amount}</td>
                          <td>{workflowinstance.status}</td>
                      </tr>
                  )
                  })
              }
              </tbody>
  
            </BTable></div>
            )
          }
          </div>
      </div>
    );
}
export default Requests;
