import React, { useEffect, useState } from 'react';
import '../Organization.scss'
import PopUpEditor from '../../../utils/common/PopUpEditor/PopUpEditor';
import { getUserData } from '../../../services/login';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../Redux/Actions/Settings/organizationActions';
import { getOrgData } from '../../../utils/helper';
import Loader from '../../../utils/common/Loader/Loader';
import '../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss'
import '../PerformancePolicy/PerformanceDetails.scss'
// ## FIX: YAHAN IMPORT ADD KIYA GAYA HAI ##

// Policy ka initial content, jaisa image mein hai
// const INITIAL_POLICY_HTML = `
//     <h3>Annual Leave:</h3>
//     <p>Employees are entitled to 12 days of paid annual leave per year. Leave requests should be submitted through the HRMS app at least 7 days in advance and must be approved by the reporting manager. Unused leave can be carried forward for up to 30 days.</p>
//     <h3>Sick Leave:</h3>
//     <p>Employees are entitled to 8 days of paid sick leave per year. A medical certificate is required for absences longer than 2 consecutive days. Sick leave cannot be carried forward or encashed.</p>
//     <h3>Casual Leave:</h3>
//     <p>Employees can avail up to 6 days of casual leave per year for personal matters. Casual leave should be applied at least 1 day prior, except in emergencies. It cannot be clubbed with annual leave.</p>
//     <h3>Maternity Leave:</h3>
//     <p>Female employees are entitled to 26 weeks of paid maternity leave as per the Maternity Benefit Act. This leave must be availed within 8 weeks before the expected delivery date. An official medical certificate confirming pregnancy is mandatory.</p>
//     <h3>Paternity Leave:</h3>
//     <p>Male employees are eligible for 7 days of paid paternity leave, which must be availed within 30 days of childbirth. A copy of the birth certificate or hospital letter must be submitted.</p>
//     <h3>Compensatory Off (Comp-Off):</h3>
//     <p>Employees who work on company-declared holidays may apply for a compensatory off within 30 days. Comp-off requests must be approved by the manager and HR.</p>
//     <h3>Loss of Pay (LOP) Leave:</h3>
//     <p>If an employee has exhausted all leave types and still takes time off, it will be counted as Loss of Pay (LOP). Salary will be deducted accordingly, and repeated LOPs may lead to disciplinary action.</p>
//     <h3>Public Holidays:</h3>
//     <p>The company observes 12 paid public holidays annually, declared at the start of each calendar year. These are separate from personal leave entitlements.</p>
// `;

export const LeavePolicy = () => {
    
    const {id} = getOrgData()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            setPolicyContent(organizationDetail?.leavepolicy)
        }
    }, [organizationDetail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            leavepolicy: newContent
        };

        dispatch(createOrgPolicy(formDataToSubmit))
            .then((res) => {
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
      <button onClick={() => navigate(`/employee-dashboard`)} className="close_nav header_close">Close</button>

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
                            <h2 className='policyH'>Leaves Policy</h2>
                        </div>
                    </div>

                    {/* Display the policy content from the state */}
                    <div className="LeaveDetailsMain">
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
};
