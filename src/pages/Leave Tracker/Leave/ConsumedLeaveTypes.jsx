import React, { use, useCallback, useEffect } from "react";
import "./ConsumedLeaveTypes.scss";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveTypeList } from "../../../Redux/Actions/leaveMasterActions";
import { getMyLeaveReport } from "../../../../src Admin/Redux/Actions/report/myReport/reportActions";

const ConsumedLeaveTypes = () => {
      const dispatch = useDispatch()
      const myLeaveReport = useSelector((state) => state?.myLeaveReport);
      const LeaveReportLoading = myLeaveReport?.loading || false
      const leaveBalnceData = myLeaveReport?.data?.leave || []

    
const fetchLeaveReport = useCallback(async () => {
        try {
            const res = await dispatch(getMyLeaveReport());

        } catch (error) {
            console.error("Error fetching Leave report:", error);
        }
    }, []);

    useEffect(()=>{
      fetchLeaveReport()
    },[fetchLeaveReport])

  const leaveName = ["Sick Leave", "Annual Leave", "Casual Leave"]
    const findLeaveData = leaveBalnceData?.reduce((acc, curr)=>{  
      acc[curr?.leave_name] = curr
      return acc;
    },{})

  const leaveData = [
    { type: "SL", used: findLeaveData[leaveName[0]]?.taken_leaves, total: findLeaveData[leaveName[0]]?.total_leaves },
    { type: "AL", used: findLeaveData[leaveName[1]]?.taken_leaves, total: findLeaveData[leaveName[1]]?.total_leaves },
    { type: "CL", used: findLeaveData[leaveName[2]]?.taken_leaves, total: findLeaveData[leaveName[2]]?.total_leaves },
  ];

  const totalUsed = leaveData.reduce((sum, l) => sum + Number(l.used || 0), 0) || 0;
  const totalAvailable = leaveData.reduce((sum, l) => sum + Number(l.total || 0), 0) || 0;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = totalUsed / totalAvailable;

  return (
    <div className="consumed-leave-card">
      <h4>Consumed Leave Types</h4>

      <div className="consumed-leave-main">
        {/* Circular Progress */}
        <div className="leave-circle">
          <svg width="100" height="100" className="progress-ring">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="ring-bg"
            ></circle>
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="ring-progress"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            ></circle>
          </svg>
          <div className="circle-text">
            <h3>{String(totalUsed).padStart(2, "0")}</h3>
            <p>/{totalAvailable}</p>
          </div>
        </div>

        {/* Vertical Bars */}
        <div className="leave-bars">
          {leaveData.map((leave, idx) => {
            const heightPercent = (leave.used / leave.total) * 100;
            return (
              <div key={idx} className="bar-item">
                  <span className="bar-type">{leave.type}</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
                <span className="bar-count">{leave.used}</span>
                <span className="bar-total">/{leave.total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConsumedLeaveTypes;
