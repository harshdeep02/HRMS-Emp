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
      console.log(leaveBalnceData)

    
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

      console.log(leaveBalnceData)
const leaveName = ["Annual Leave", "Sick Leave", "Casual Leave"]
const findLeaveData = leaveBalnceData?.map((item)=>({  [item.leave_name]:item}))

  const leaveData = [
    { type: "SL", used: 4, total: 10 },
    { type: "AL", used: 2, total: 10 },
    { type: "CL", used: 3, total: 10 },
  ];

  const totalUsed = leaveData.reduce((sum, l) => sum + l.used, 0);
  const totalAvailable = leaveData.reduce((sum, l) => sum + l.total, 0);

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
