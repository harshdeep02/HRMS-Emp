import React, { useEffect, useState } from 'react';
import '../Organization.scss'
import PopUpEditor from '../../../utils/common/PopUpEditor/PopUpEditor';
import { getUserData } from '../../../services/login';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../Redux/Actions/Settings/organizationActions';
import Loader from '../../../utils/common/Loader/Loader';
import { getOrgData } from '../../../utils/helper';
import '../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss'
import './AttendanceDetails.scss'
import '../LeavesPolicy/LeaveDetails.scss'

// const INITIAL_POLICY_HTML = `
//     <h3>1. Purpose</h3>
//     <p>The purpose of this Attendance Policy is to establish guidelines and expectations regarding employee attendance to ensure a productive and efficient workplace.</p>
//     <h3>2. Scope</h3>
//     <p>This policy applies to all employees of [Your IT Company Name], including full-time, part-time, and contract employees.</p>
//     <h3>3. Working Hours</h3>
//     <li>Standard Working Hours: The standard working hours are from 9:00 AM to 6:00 PM, Monday to Friday.</li>
//     <li>Lunch Break: Employees are entitled to a one-hour lunch break, typically taken between 12:00 PM and 2:00 PM.</li>
//     <li>Flexible Working Hours: Flexible working hours may be arranged with the prior approval of the employee's manager.</li>
//     <h3>4. Attendance Tracking</h3>
//     <li>Clock-In/Clock-Out: Employees must clock in and out using the company’s attendance system. This can be done via the HRMS web app or designated physical time clocks.</li>
//     <li>Remote Work: Employees working remotely must log their working hours through the HRMS web app, ensuring they are available during standard working hours unless otherwise agreed upon.</li>
//     <h3>5. Absences</h3>
//     <li>Planned Absences: Employees should notify their manager and submit a leave request through the HRMS for any planned absences, including vacations and personal days, at least [number] days in advance.</li>
//     <li>Unplanned Absences: In case of illness or emergency, employees must inform their manager as soon as possible, preferably before the start of the working day, and log the absence in the HRMS.</li>
// `;

export const AttendancePolicy = () => {

    const {id} = getOrgData()
    const dispatch = useDispatch()

    const createPolicy = useSelector((state) => state?.addPolicy);
    const organizationDetails = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetails?.data?.data;
    const organizationDetailLoading = organizationDetails?.loading || false;

    // State to manage popup visibility
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    // State to hold the policy's HTML content
    const [policyContent, setPolicyContent] = useState('');

    useEffect(() => {
        if (id && organizationDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getOrganizationDetails(queryParams));
        }
    }, [id]);

    useEffect(() => {
        if (id && organizationDetail) {
            setPolicyContent(organizationDetail?.attendencepolicy)
        }
    }, [organizationDetail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            attendencepolicy: newContent
        };

        dispatch(createOrgPolicy(formDataToSubmit))
            .then((res) => {
                console.log("res", res)
                if (res?.success) {
                    dispatch(getOrganizationDetails({ id }))
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
        // setPolicyContent(newContent);
        setIsEditorVisible(false); // Close the popup after saving
    };
    
    if (createPolicy?.loading || organizationDetailLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <>
            <div className="performanceDetailsMain">
      <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>

      <div className='form_page_' style={{display:"flex", justifyContent:"center"}}>

        <div className={`performanc_form_box`}>

          <div className='employee_form_header'>
          </div>

          {/* <div className='form-content'> */}
          <div>
            <div className="leavePolicyMain">
                <div className="policy-container">
                    <div className="policy-header">
                        <div className="policy-title">
                            <h2>Attendance Policy</h2>
                        </div>
                        {/* Button to open the popup */}
                        <button className="edit-policy-btn" onClick={() => setIsEditorVisible(true)}>
                            Edit Policy
                        </button>
                    </div>

                    {/* Display the policy content from the state */}
                    <div className="attendanceDetailsMain">
                    <div
                        className="policy-body"
                        dangerouslySetInnerHTML={{ __html: policyContent }}
                    />
                </div>
                </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>

            {/* Your PopUpEditor component */}
            <PopUpEditor
                visible={isEditorVisible}
                onHide={() => setIsEditorVisible(false)}
                headerText="Edit Leave Policy"
                initialValue={policyContent}
                onSave={handleSavePolicy}
            />
        </>
    );
}
