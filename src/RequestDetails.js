import { useEffect, useState } from "react";
import $ from "jquery";
import './App.css';
import getWorkflowStatus from './GetWorkflowStatus';
import { Link } from 'react-router-dom';

function  GetApprovalSteps(requestDetails, workflowItems){

    let approvalSteps = {};
  
    var step1 = workflowItems.filter(a=>a._title==='To Property Manager');
    if(step1.length>0){
        approvalSteps.Property_Manager_Approver = step1[0].assignee;
     

    }
    var step2 = workflowItems.filter(a=>a._title==='To General Manager');
    if(step2.length>0){
        approvalSteps.General_Manager_Approver = step2[0].assignee;
        
    }

    var step3 = workflowItems.filter(a=>a._title==='To Director');
    if(step3.length>0){
        approvalSteps.Director_Approver = step3[0].assignee;
      

    }
    return approvalSteps;
}

function RequestDetails(props){
        
        let requestDetails = {};
        const workflowItems =[];
       
        const [loadingData, setLoadingData] = useState(true);
        const [data, setData] = useState(null);
       
        const requestId = props.match.params.requestId;

    
        useEffect(()=>{

            if(loadingData){
                $.ajax({
                    url:"https://aemintegrationworkflowdata.azurewebsites.net/api/HttpTrigger1?code=vwzvADYPe8VIjwtfEgZuahddyQuFWbDgrs76aCW9SebXhegTLKLB7g==",
                    type:"GET",
                    success: function(data){
                        let workflowData = data['2021-06-22'];
                        workflowData = Object.entries(workflowData);
                        var filtered = workflowData//Object.keys(workflowData)
                        .filter(key=> key[0].indexOf(requestId)>=0 && key[0].indexOf('review-submitted-form')>=0)
                       
                        console.log(filtered);

                        // eslint-disable-next-line
                        requestDetails = filtered[0][1].data.metaData;

                        var workflowHistory = Object.entries(filtered[0][1].history);
                        
                        var _value = requestDetails;
                        var workflowStatus = getWorkflowStatus(_value);
                        
                    
                        //$("#downloadData").setAttribute("href","data:application/xml;charset=utf-8," + dataStr);
                        //$("#downloadData").setAttribute("download","SubmittedData.xml");

                        requestDetails.requestLink='';
                        
                        for(var workflowItem of workflowHistory){
                            
                            if(workflowItem[1].workItem && workflowItem[1].workItem.assignee && workflowItem[1].workItem.assignee.indexOf('@')>=0)
                            {
                                workflowItems.push(workflowItem[1].workItem);
                            }
                            else if(workflowItem[1].workItem != null && workflowItem[1].workItem.metaData != null && workflowItem[1].workItem.metaData.title != null){
                                if(workflowStatus.indexOf('general')>=0 && workflowItem[1].workItem.metaData.title.indexOf('General')>=0){
                                    requestDetails.requestLink = workflowItem[1].workItem.metaData.workitem_url;
                                  
                                    localStorage.setItem('AEMLink'+requestId, requestDetails.requestLink);
                                    break;
                                }
                                else if(workflowStatus.indexOf('property')>=0 && workflowItem[1].workItem.metaData.title.indexOf('Property')>=0){
                                    requestDetails.requestLink = workflowItem[1].workItem.metaData.workitem_url;
                                   
                                    localStorage.setItem('AEMLink'+requestId,  requestDetails.requestLink);
                                    break;
                                }
                                else if(workflowStatus.indexOf('director')>=0 && workflowItem[1].workItem.metaData.title.indexOf('Director')>=0){
                                    requestDetails.requestLink = workflowItem[1].workItem.metaData.workitem_url;
                                    localStorage.setItem('AEMLink'+requestId,  requestDetails.requestLink)
                                    break;
                                }
                               else if(requestDetails.requestLink===''){
                                    requestDetails.requestLink = 'NA';
                                   // requestDetails.requestLink = workflowItem[1].workItem.metaData.workitem_url;
                                    localStorage.setItem('AEMLink'+requestId,  workflowItem[1].workItem.metaData.workitem_url);
                                    
                                }
                            }
                        }
                        let approvers = GetApprovalSteps(requestDetails,workflowItems);
                        requestDetails.propertyManagerApprover = approvers.Property_Manager_Approver;
                        requestDetails.generalManagerApprover = approvers.General_Manager_Approver;
                        requestDetails.directorApprover = approvers.Director_Approver;
                        requestDetails.requestStatus = workflowStatus;
                      //  requestDetails.requestLink = requestDetails.approvalLink;
                        //requestDetails.request_id = requestId;
                      //  setData(ApprovalSteps);
                        setData(workflowItems);
                        setData(requestDetails);
                        setLoadingData(false);
                     
                    }
                })
            }
        },[requestDetails, workflowItems])


        return (
            <div style={{padding:'50px', textAlign:'left'}}>
                {loadingData?(<p>Loading please wait</p>):(
               <div>
                   {// eslint-disable-next-line     
               <div><Link to='/Requests'>Home</Link></div>
            }
                   <h3>Request Details</h3>
               
               <div>
               <table cellPadding="5" cellSpacing="5">
                <tr>
                   

                    <td><b>Initiator:</b></td>
                    <td>{data.initiator}</td>
                    <td><b>Request Name:</b></td>
                    <td>{data.requestName}</td>
                    <td><b>Request Type:</b></td>
                    <td>{data.requestType}</td>
                    <td><b>Amount:</b></td>
                    <td>${data.amount}</td>
                </tr><tr>
                    
                    <td><b>City:</b></td>
                    <td>{data.city}</td>
                    <td><b>Building:</b></td>
                    <td>{data.building}</td>
                    <td><b>Comments:</b></td>
                    <td>{data.submitterComment}</td>
                    <td><b>Request status:</b></td>
                    <td>{data.requestStatus}</td>

                </tr>
                </table>
                <br/>
                <br/>
                
                {data.amount>25?
                <div>                   
                 <div><h3>Approval Steps</h3></div>   
                <table cellPadding = "5" cellSpacing="5"  className="stepsTable">
                    <tr style={{ border: "1px solid black"}}>
                        <th>Steps</th>
                        <th>Status</th> 
                        <th>Comments</th>
                        <th>Action taken by</th>
                    </tr>
                
                    <tr>
                        <td>Step 1 Property Manager Approval</td>
                        <td>{data.propertyManagerAction}</td>
                        <td>{data.propertyManagerComment}</td>
                        <td>{data.propertyManagerApprover}</td>
                    </tr>
                    {data.amount>3500 && data.propertyManagerAction.indexOf('Reject')<0?
                    <tr>
                        <td>Step 2 General Manager Approval</td>
                        <td>{data.generalManagerAction}</td>
                        <td>{data.generalManagerComment}</td>
                        <td>{data.generalManagerApprover}</td>
                    </tr>:null}
                    {data.amount>10000 && data.generalManagerAction.indexOf('Reject')<0 && data.propertyManagerAction.indexOf('Reject')<0?
                    <tr>
                        <td>Step 3 Director Approval</td>
                        <td>{data.directorAction}</td>
                        <td>{data.directorComment}</td>
                        <td>{data.directorApprover}</td>
                    </tr>:null}
                </table>
                </div>:null}
                </div>
                <br/>
                <br/>
                {data.amount>25 && data.requestLink!=='NA'?
                  // eslint-disable-next-line
                    <a href={data.requestLink} target="_blank">Go to AEM to approve or reject the request</a>
                :null}  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 

{(data.amount>25 && (data.requestStatus==='Approved' || data.requestStatus==='Rejected'))? 
                
                // eslint-disable-next-line                
                <a href={localStorage.getItem('AEMLink'+requestId)}target="_blank">View Request in AEM</a>
               :null
               }&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                <a href={'data:application/xml;charset=utf-8,'+data.submittedData} download={'SubmittedData_'+data.requestName+'.xml'}
                id="downloadData">1) Download submitted data</a> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 
               {
                // eslint-disable-next-line
                <a href="https://author-opgi-dev-4.adobecqms.net/aem/formdetails.html/content/dam/formsanddocuments/bad-debt-workflow#previewcustom" target="_blank">2) Preview submitted data in AEM</a>
               
                } 

                
            </div>
        
                
                )
                }
            </div>  
                


        );

}

export default RequestDetails;
