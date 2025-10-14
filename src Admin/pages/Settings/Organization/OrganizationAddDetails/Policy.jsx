// src/pages/Organization/Policy.js

import React, { useEffect, useState } from 'react';
import './Organization.scss';
import { FileText, ShieldUser } from 'lucide-react';
import PopUpEditor from '../../../../utils/common/PopUpEditor/PopUpEditor';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../../Redux/Actions/Settings/organizationActions';
import Loader from '../../../../utils/common/Loader/Loader';

// ## FIX: YAHAN IMPORT ADD KIYA GAYA HAI ##

// Policy ka initial content, jaisa image mein hai

const dummData = `
  <p><h3>Welcome to HRMS:</h3>This document outlines the policies and procedures that govern the conduct of employees within our organization. It aims to provide a clear understanding of our expectations and guidelines to ensure a productive, respectful, and compliant work environment.</p>
  <p><br></p>
  
  <h3>2. Code of Conduct</h3>
  <p><h3>Professionalism:</h3> Employees are expected to conduct themselves in a professional manner at all times, maintaining integrity, honesty, and respect towards colleagues, clients, and partners.</p>
  <p><h3>Confidentiality:</h3> Employees must safeguard confidential information and not disclose it to unauthorized individuals. This includes client data, company secrets, and proprietary information.</p>
  
  <p><h3>Equal Opportunity:</h3> [Your IT Company Name] is committed to providing equal employment opportunities without discrimination based on race, color, religion, gender, age, disability, or any other protected characteristic.</p>
  <p><br></p>

  <h3>3. Working Hours and Attendance</h3>
  <p><h3>Working Hours:</h3> The standard working hours are from 9:00 AM to 6:00 PM, Monday to Friday. Employees are expected to adhere to these hours unless otherwise agreed upon with their manager.</p>
  <p><h3>Attendance:</h3> Regular attendance is crucial. Employees must clock in and out using the provided attendance system. Any planned absences should be communicated in advance.</p>
  <p><h3>Remote Work:</h3> Remote work arrangements may be permitted based on role requirements and manager approval. Remote employees must be available during standard working hours and maintain productivity.</p>
  <p><br></p>

  <h3>4. Leave Policy</h3>
  <p><h3>Annual Leave:</h3> Employees are entitled to [number] days of paid annual leave per year. Leave requests should be submitted through the HRMS and approved by the manager.</p>
  <p><h3>Sick Leave:</h3> Employees are entitled to [number] days of paid sick leave per year. A medical certificate is required for absences longer than [number] consecutive days.</p>
  <p><h3>Maternity/Paternity Leave:</h3> Eligible employees are entitled to maternity/paternity leave as per legal requirements and company policy.</p>
  <p><br></p>

  <h3>5. Information Security</h3>
  <p> <h3>System Access: </h3>Access to company systems is restricted to authorized personnel. Employees must use their own credentials and not share them with others.</p>
  <p><h3>Data Protection:</h3> Employees must adhere to data protection regulations and company policies to protect sensitive information.</p>
  <p><h3>Device Security:</h3> Company-issued devices must be used responsibly. Employees should report any loss or theft of devices immediately.</p>
  <p><br></p>

  <h3>6. Internet and Email Usage</h3>
  <p><h3>Acceptable Use: </h3>Company internet and email systems should be used primarily for business purposes. Personal use should be limited and not interfere with work responsibilities.</p>
  <p><h3>Prohibited Activities:</h3> Employees must not engage in activities that are illegal, unethical, or harmful to the company’s reputation, including downloading unauthorized software or accessing inappropriate content.</p>
  <p><br></p>

  <h3>7. Dress Code</h3>
  <p> <h3>Professional Attire:</h3> Employees are expected to dress in a professional manner that is appropriate for the workplace and client interactions.</p>
  <p> <h3>Casual Fridays: </h3>Business casual attire is permitted on Fridays unless client meetings or other formal events are scheduled.</p>
  <p><br></p>

  <h3>8. Workplace Safety</h3>
  <p><h3>Safety Guidelines:</h3> Employees must follow all safety guidelines and procedures to ensure a safe working environment.</p>
  <p><h3>Incident Reporting:</h3> Any workplace accidents or incidents should be reported immediately to the HR department.</p>
  <p><br></p>

  <h3>9. Performance Evaluation</h3>
  <p><h3>Performance Reviews: </h3>Regular performance reviews will be conducted to assess employee performance, set goals, and provide feedback.</p>
  <p><h3>Continuous Improvement:</h3>Employees are encouraged to seek continuous improvement and professional development opportunities.</p>
  <p><br></p>

  <h3>10. Disciplinary Actions</h3>
  <p><h3>Policy Violations:</h3> Any violations of company policies may result in disciplinary actions, including warnings, suspension, or termination.</p>
  <p><h3>Grievance Procedure:</h3> Employees may report grievances or concerns through the appropriate channels outlined in the grievance policy.</p>
  <p><br></p>

  <h3>11. Amendments</h3>
  <p><h3>Policy Changes:</h3> [Your IT Company Name] reserves the right to amend or update these policies as necessary. Employees will be notified of any significant changes.</p>
  <p><br></p>

  <h3>12. Acknowledgment</h3>
  <p><h3>Employee Agreement:</h3> All employees are required to read, understand, and acknowledge their agreement to comply with these policies.</p>
`

const Policy = () => {
    const { id } = useParams()
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const createPolicy = useSelector((state) => state?.addPolicy);
    const organizationDeails = useSelector((state) => state?.organizationDetail);
    const organizationDeail = organizationDeails?.data?.data;
    const organizationDeailLoading = organizationDeails?.loading || false;

    // State to manage popup visibility
    const [isEditorVisible, setIsEditorVisible] = useState(false);

    // State to hold the policy's HTML content
    const [policyContent, setPolicyContent] = useState('');

    // useEffect(() => {
    //     if (id && organizationDeail?.id != id) {
    //         const queryParams = {
    //             id: id,
    //         };
    //         dispatch(getOrganizationDetails(queryParams));
    //     }
    // }, [id]);

    useEffect(() => {
        if (id && organizationDeail) {
            setPolicyContent(organizationDeail?.policy)
            // setPolicyContent(dummData)
        }
    }, [organizationDeail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            policy: newContent
        };

        dispatch(createOrgPolicy(formDataToSubmit))
            .then((res) => {
                console.log("res", res)
                if (res?.success) {
                    // navigate(id ? `/holiday-details/${id}` : `/holiday-list`);
                    // if (id) ;
                    dispatch(getOrganizationDetails({ id }))
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
        // setPolicyContent(newContent);
        setIsEditorVisible(false); // Close the popup after saving
    };
    if (createPolicy?.loading || organizationDeailLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }
    return (
        <>
            <div className="policy-container performancePolicyBody ">
                <div className="policy-header">
                    <div className="policy-title">
                        <ShieldUser  size={30} strokeWidth={"1.5"}/>
                        <h2 style={{fontWeight:"500"}}>Organization Policy</h2>
                    </div>
                    {/* Button to open the popup */}
                    <button className="edit-policy-btn" onClick={() => setIsEditorVisible(true)}>
                        Edit Policy
                    </button>
                </div>

                {/* Display the policy content from the state */}
                <div
                    className="policy-body"
                    dangerouslySetInnerHTML={{ __html: policyContent }}
                />
            </div>

            {/* Your PopUpEditor component */}
            <PopUpEditor
                visible={isEditorVisible}
                onHide={() => setIsEditorVisible(false)}
                headerText="Edit Organization Policy"
                initialValue={policyContent}
                onSave={handleSavePolicy}
            />
        </>
    );
};

export default Policy;