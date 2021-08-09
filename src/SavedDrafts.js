import { useState } from "react";
import $ from "jquery";
import {Link} from 'react-router-dom'
function SavedDrafts(){

    var savedDrafts=[];
    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState([]);
    
    function getDrafts(){
       
        setLoadingData(true);
        $.ajax({
            url:"https://aemintegrationworkflowdata.azurewebsites.net/api/HttpTrigger4?code=KooYu3WUal5UT80uapr4ddSga37eWge1HFcEZwqrysRsa9IhGLsIFg==&name="+$("#networkUserName").val()+"@oxfordproperties.com",
            type:"GET",
            crossDomain:true,

            success:function(data){
               // let _draftData = [];
                for(let[key,value] of Object.entries(data)){
                    console.log(`${key}`);
                    if(key.indexOf('jcr')<0){
                        var _lastModified = value["jcr:lastModified"];
                        savedDrafts.push({key, _lastModified});

                    }

                }
                setData(savedDrafts);
                setLoadingData(false);
            }

        })
////https://52.232.134.199/crx/de/download.jsp?path=%2Fcontent%2Fforms%2Ffp%2Fclu%2540oxfordproperties.com%2Fdrafts%2Fdata%2F23TFIFDSZ5HIG3ZQDU4MI42LU4%2Fjcr%3Adata&index=0
    }

    return (<div>

            <h3>Saved Drafts</h3>
            <div>

                Please enter in your netowrk username without the underscore:&nbsp;&nbsp; &nbsp;&nbsp;
                <input width="150px" id="networkUserName"></input>
                <button id="draftsButton" onClick={getDrafts}>Submit</button>


            </div>
            {
                loadingData?(<p>Loading please wait</p>):(
                    
                    <div>
                    {
                        data.map((draft, index)=>{
                            return(
                            <div>{index}. {draft['_lastModified']}
                            
                       &nbsp;&nbsp;
                             <Link to={`https://52.232.134.199/crx/de/download.jsp?path=/content/forms/fp/`+$("#networkUserName").val()+`%40oxfordproperties.com/drafts/data/`+draft['key']+'jcr:data&index=0'}>Download</Link>                              
                            
                            </div>
                            )
                        })
                    }   

                    </div>)}
                


            


    </div>)



}
export default SavedDrafts;