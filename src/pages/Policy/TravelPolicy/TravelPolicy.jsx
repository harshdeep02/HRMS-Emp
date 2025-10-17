import React, { useEffect, useState } from 'react'
// import'../Organization/OrganizationAddDetails/Organization.scss'
import PopUpEditor from '../../../utils/common/PopUpEditor/PopUpEditor';
import { getUserData } from '../../../services/login';
import { useDispatch, useSelector } from 'react-redux';
import { createOrgPolicy, getOrganizationDetails } from '../../../Redux/Actions/Settings/organizationActions';
import Loader from '../../../utils/common/Loader/Loader';
import { getOrgData } from '../../../utils/helper';
import './TravelDetails.scss'
import { useNavigate } from 'react-router-dom';

const INITIAL_POLICY_HTML = `<h3>Business Travel Eligibility:</h3>
<p>All full-time employees are eligible for business travel based on project or client requirements. Travel must be approved in advance by the reporting manager and/or department head.</p>
x
<h3>Travel Booking:</h3>
<p>All official travel must be booked through the designated travel desk or the company-approved portal. Employees are not allowed to make personal bookings unless explicitly permitted.</p>

<h3>Transportation:</h3>
<ul>
    <li>Local Travel: Reimbursement is allowed for auto/taxi/public transport with valid receipts. Use of personal vehicle requires prior approval, and fuel reimbursements will be based on mileage (₹6/km for two-wheelers, ₹12/km for four-wheelers).</li>
    <li>Outstation Travel: Air, train, or bus travel should be as per entitlement:
        <ul>
            <li>Executives & Managers: Economy class airfare or AC 2-tier train.</li>
            <li>Senior Managers & Above: Economy/Premium Economy airfare or AC 1-tier train.</li>
        </ul>
        Tickets should be booked at least 7 days in advance to avoid high fares.
    </li>
</ul>

<h3>Accommodation:</h3>
<p>Accommodation will be provided in 3-star or business-class hotels. Employees must book through approved vendors. Reimbursement for self-booked accommodations will only be allowed with prior approval and valid GST invoices.</p>

<h3>Daily Allowance (Per Diem):</h3>
<p>Employees are entitled to daily allowances to cover meals and incidentals:</p>
<ul>
    <li>Tier 1 cities: ₹1000/day</li>
    <li>Tier 2 cities: ₹800/day</li>
    <li>Tier 3/rural areas: ₹600/day</li>
</ul>
<p>Expenses above the daily allowance must be supported with receipts and approved separately.</p>

<h3>Travel Advance:</h3>
<p>Employees may request a travel advance for outstation trips. The advance must be settled within 5 working days after returning by submitting a travel expense report.</p>

<h3>Travel Insurance:</h3>
<p>The company provides travel insurance coverage for all domestic and international official travel. Details of coverage will be shared at the time of ticket issuance.</p>

<h3>International Travel:</h3>
<p>All international business trips require CEO or Director-level approval. Visa fees, travel insurance, forex, and vaccinations (if required) will be covered by the company.</p>

<h3>Reimbursement Process:</h3>
<p>All reimbursement claims must be submitted via HRMS or the Expense module with scanned receipts and a travel summary report. Claims older than 30 days will not be accepted unless justified.</p>

<h3>Personal Travel During Business Trip:</h3>
<p>Employees combining personal travel with official business travel must get prior approval. The company will only cover the cost equivalent to business-related travel.</p>

<h3>Code of Conduct During Travel:</h3>
<p>Employees are expected to represent the company in a professional manner during travel. Any misconduct, misuse of funds, or deviation from policy may lead to disciplinary action.</p>
`

export const TravelPolicy = () => {
    
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
            setPolicyContent(organizationDetail?.travelpolicy)
        }
    }, [organizationDetail]);
    // Function to handle saving the content from the editor
    const handleSavePolicy = (newContent) => {
        const formDataToSubmit = {
            id,
            travelpolicy: newContent
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
      <button onClick={() => navigate(`/employee-dashboard`)} className="close_nav header_close">Close</button>

      <div className='form_page_' style={{display:"flex", justifyContent:"center"}}>

        <div className={`performanc_form_box`}>

          <div className='employee_form_header'>
          </div>

          {/* <div className='form-content'> */}
          <div>
            <div className="travelPolicyMain">
                <div className="travelPolicyHead">Travel</div>
                <div className="travelePolicyBody">
                    <div className="policy-container">
                        <div className="policy-header">
                            <div className="policy-title">
                                {/* <h2>Travel Policy</h2> */}
                                <p>Select the methods that you commonly use in your organization to track your employee performance</p>
                            </div>
                            {/* Button to open the popup */}
                            <button className="edit-policy-btn" onClick={() => setIsEditorVisible(true)}>
                                Edit Policy
                            </button>
                        </div>

                        {/* Display the policy content from the state */}
                        <div className="travelPolicyMain">
                        <div
                            className="policy-body"
                            dangerouslySetInnerHTML={{ __html: policyContent }}
                        />
                    </div>
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
    )
}
