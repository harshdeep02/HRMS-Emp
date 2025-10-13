import React, { useEffect, useState } from 'react'
import './PerformanceDetails.scss'
import { PerformancePolicy } from './PerformancePolicy'
import { useNavigate, useParams } from 'react-router-dom';


export const SettingPerformance = () => {
  const navigate = useNavigate();


  return (
    <div className="performanceDetailsMain">
      <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>

      <div className='form_page_' style={{display:"flex", justifyContent:"center"}}>

        <div className={`performanc_form_box`}>

          <div className='employee_form_header'>
          </div>

          {/* <div className='form-content'> */}
          <div>
            <PerformancePolicy />
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}
