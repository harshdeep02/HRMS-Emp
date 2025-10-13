import React from 'react'
import { TravelPolicy } from './TravelPolicy'
import './TravelDetails.scss'
import { useNavigate } from 'react-router-dom';

export const TravelDetails = () => {
    const navigate = useNavigate();
  return (
    <div className="travelDetailsMain">
        <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>
             <div className='form_page_' style={{display:"flex", justifyContent:"center"}}>
    
                <div className={`performanc_form_box`}>
    
                        <div className='employee_form_header'>
                        </div>
    
                    {/* <div className='form-content'> */}
                        <div>
                            <TravelPolicy/>
                        </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
  )
}
