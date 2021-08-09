function getWorkflowStatus(_value){

    var workflowStatus;
    if(_value.amount<=25){
        workflowStatus = "Approved";
      }
      else if((_value.amount<=3500 && _value.propertyManagerAction!=null) || (_value.amount>3500 &&_value.generalManagerAction==='pending')){
         if(_value.propertyManagerAction.indexOf('Reject')>=0){
            workflowStatus="Rejected";
         }
         else if(_value.propertyManagerAction.indexOf('Approve')>=0 && _value.amount<=3500){
            workflowStatus = "Approved";
         }
         else if(_value.propertyManagerAction.indexOf('Approve')>=0 && _value.amount>3500){
             workflowStatus = 'Pending general manager approval'
         }
         else if(_value.propertyManagerAction==='pending'){
            workflowStatus= "Pending property manager approval";
         }

      }
      else if((_value.amount<=10000 && _value.generalManagerAction!=null) ||(_value.amount>10000 && _value.directorAction === 'pending')){
         if(_value.generalManagerAction.indexOf('Reject')>=0){
           workflowStatus="Rejected";
         }
         else if(_value.generalManagerAction.indexOf('Approve')>=0 && _value.amount<=10000){
           workflowStatus = "Approved";
         }
         else if(_value.generalManagerAction.indexOf('Approve')>=0 && _value.amount>10000){
           workflowStatus= "Pending director approval";
         }
         else if(_value.generalManagerAction==='pending'){
             workflowStatus = 'Pending general manager approval';
         }
     }
     else if(_value.directorAction!=null){
         if(_value.directorAction.indexOf('Reject')>=0){
           workflowStatus="Rejected";
         }
         else if(_value.directorAction.indexOf('Approve')>=0){
           workflowStatus = "Approved";
         }
       else{
           workflowStatus= "Pending director approval";
         }
      
      }

      return workflowStatus;

}
export default getWorkflowStatus;