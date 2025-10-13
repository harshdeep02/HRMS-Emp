import React, { useEffect, useState } from 'react';
import '../Organization/OrganizationAddDetails/Organization.scss'
import PopUpEditor from '../../../utils/common/PopUpEditor/PopUpEditor';
import { getUserData } from '../../../services/login';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../Redux/Actions/Settings/organizationActions';
import { useParams } from 'react-router-dom';
import Loader from '../../../utils/common/Loader/Loader';
import { getOrgData } from '../../../utils/helper';

const INITIAL_POLICY_HTML = `<h3>General Shift Hours:</h3>
<p>The company operates in multiple shifts to ensure smooth business operations. Each shift is 9 hours including 1-hour break, and employees are expected to follow the shift timings as per their assignment in the HRMS.</p>

<h3>Shift Types & Timings:</h3>
<p>
    Shift Name Start Time End Time Break Time Morning Shift7:00 AM4:00 PM12:00–1:00 PMDay Shift9:00 AM6:00 PM1:00–2:00 PM Evening Shift1:00 PM10:00 PM5:00–6:00 PM Night Shift9:00 PM6:00 AM1:00–2:00 AM
</p>

<h3>Shift Allocation:</h3>
<p>Shifts are allocated based on project, department, and operational requirements. Employees will be notified via the HRMS app, and any change in shift will be communicated at least 48 hours in advance.</p>

<h3>Shift Rotation Policy:</h3>
<p>In rotational shift roles, employees may rotate between shifts on a weekly or bi-weekly basis. The schedule will be managed and updated in the HRMS. Rotation ensures fair exposure to all shifts and equal work-life balance.</p>

<h3>Late Coming & Early Departure:</h3>
<p>Employees must adhere strictly to their assigned shift timings. More than 3 instances of late arrival or early departure in a month may lead to deduction of half-day leave or disciplinary action.</p>

<h3>Night Shift Allowance:</h3>
<p>Employees working in the Night Shift (9:00 PM to 6:00 AM) are eligible for a Night Shift Allowance, credited monthly. The amount will be defined in the employee’s offer or as per company policy.</p>

<h3>Overtime Policy:</h3>
<p>Employees required to work beyond their shift hours may be eligible for overtime compensation or Comp-Off, subject to prior managerial approval and HR guidelines.</p>

<h3>Break Time:</h3>
<p>Each shift includes 1 hour of break time (meal + tea/coffee). Employees are encouraged to take breaks during this window to maintain productivity and well-being.</p>

<h3>Emergency Shift Change:</h3>
<p>In case of personal emergencies or medical needs, employees may request a temporary shift change through the HRMS. Such requests will be approved based on urgency and availability.</p>

<h3>Attendance & Shift Tracking:</h3>
<p>All employees must mark attendance through the HRMS app using either geolocation or QR-based verification. Shifts will be tracked automatically, and discrepancies will be flagged for review.</p>
`

export const ShiftPolicy = () => {
    
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
            setPolicyContent(organizationDetail?.shiftpolicy)
        }
    }, [organizationDetail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            shiftpolicy: newContent
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
            <div className="ShiftPolicyMain">
                <div className="policy-container">
                    <div className="policy-header">
                        <div className="policy-title">
                            <h2>Shift Policy</h2>
                            <p>Select the methods that you commonly use in your organization to track your employee shift times</p>
                        </div>
                        {/* Button to open the popup */}
                        <button className="edit-policy-btn" onClick={() => setIsEditorVisible(true)}>
                            Edit Policy
                        </button>
                    </div>

                    {/* Display the policy content from the state */}
                    <div
                        className="policy-body otherDetailPageSroll"
                        dangerouslySetInnerHTML={{ __html: policyContent }}
                    />
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
