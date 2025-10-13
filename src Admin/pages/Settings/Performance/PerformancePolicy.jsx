import React, { useEffect, useState } from 'react'
import '../Organization/OrganizationAddDetails/Organization.scss'
import PopUpEditor from '../../../utils/common/PopUpEditor/PopUpEditor';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../Redux/Actions/Settings/organizationActions';
import Loader from '../../../utils/common/Loader/Loader';
import { getUserData } from '../../../services/login';
import { getOrgData } from '../../../utils/helper';

// const INITIAL_POLICY_HTML = `<h3>Performance Review Cycle:</h3>
// <p>Employees will undergo performance reviews twice a year — Mid-Year (June) and Year-End (December). Reviews will be conducted via the HRMS platform and include feedback from managers, self-assessments, and performance metrics.</p>

// <h3>Key Performance Indicators (KPIs):</h3>
// <p>Each employee will be assigned role-specific KPIs at the beginning of the review cycle. These indicators will form the basis of performance evaluation and must be mutually agreed upon by the employee and manager.</p>

// <h3>Performance Rating Scale:</h3>
// <p>Employees will be rated on a 5-point scale:</p>
// <ol>
//     <li>Outstanding</li>
//     <li>Exceeds Expectations</li>
//     <li>Meets Expectations</li>
//     <li>Needs Improvement</li>
//     <li>Unsatisfactory</li>
// </ol>
// <p>Ratings will influence salary revisions, promotions, and training plans.</p>

// <h3>Self-Assessment:</h3>
// <p>Employees are required to submit a self-assessment before the review meeting. The form will be available in the HRMS under the Performance tab and must be completed within 7 working days of notification.</p>

// <h3>Manager Feedback:</h3>
// <p>Managers are responsible for providing constructive and honest feedback. It must cover achievements, challenges, goal completion, behavioral traits, and improvement areas. One-on-one discussions will be scheduled post-assessment.</p>

// <h3>Goal Setting:</h3>
// <p>Employees and managers must jointly set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) at the start of each review cycle. Progress will be monitored quarterly.</p>

// <h3>Performance Improvement Plan (PIP):</h3>
// <p>If an employee consistently scores “Needs Improvement” or “Unsatisfactory”, they may be placed on a Performance Improvement Plan (PIP) for 30 to 90 days. Clear targets and support will be defined, and failure to meet them may lead to further action.</p>

// <h3>Recognition & Rewards:</h3>
// <p>High-performing employees will be eligible for bonuses, awards, spot recognitions, or promotions. Recognitions are aligned with the rating and contribution to business success.</p>

// <h3>Training & Development:</h3>
// <p>Based on performance reviews, employees may be recommended for upskilling or reskilling programs. These will be made available via internal workshops or approved third-party courses.</p>

// <h3>Confidentiality:</h3>
// <p>All performance data, feedback, and ratings are considered confidential and accessible only to the employee, their reporting manager, and the HR department.</p>
// `

export const PerformancePolicy = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const {id} = getOrgData()
    const dispatch = useDispatch()

    const createPolicy = useSelector((state) => state?.addPolicy);
    const organizationData = useSelector((state) => state?.organizationDetail);
    console.log(organizationData)
    const organizationDetail = organizationData?.data?.data;
    const organizationDetailLoading = organizationData?.loading || false;

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
            setPolicyContent(organizationDetail?.performancepolicy)
        }
    }, [organizationDetail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            performancepolicy: newContent
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

            <div className="performancePolicyMain">
                <div className="performancePolicyHead">Performance</div>
                <div className="performancePolicyBody">
                    <div className="policy-container">
                        <div className="policy-header">
                            <div className="policy-title">
                                <h2>Performance Policy</h2>
                                <p>Select the methods that you commonly use in your organization to track your employee performance</p>
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
    )
}
