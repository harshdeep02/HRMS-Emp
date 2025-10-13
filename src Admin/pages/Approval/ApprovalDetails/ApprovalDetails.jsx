import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Briefcase, CreditCard, Pencil, User, X } from "lucide-react";
import bannerImg from "../../../assets/Comment_rivew.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import { ApprovalForm } from "./ApprovalForm.jsx";
// import { EmpPerformance } from "./EmpPerformance.jsx";
import defaultUser from "../../../assets/default-user.png";
// import './PerformanceDetails.scss'; // New SCSS file for this specific page
import { UserProfileImageUpload } from "../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import { performanceStatusOptions } from "../../../utils/Constant.js";
import { getPerformanceDetails, SendApproval } from "../../../Redux/Actions/performanceActions.js";
import './ApprovalDetailsForm.scss'
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";

export const ApprovalDetails = () => {
      const location = useLocation();
      const navigate = useNavigate();
      const { id } = useParams();
      const dispatch = useDispatch()
  
      const [showModal, setShowModal] = useState(false);
      const [ModalData, setModalData] = useState('');
      const [viewMode, setViewMode] = useState("detail");
      const [formData, setFormData] = useState({
          user: '',
          user_id: "",
          image: '',
          department: "",
          designation: "",
          appraisal_date: null,
          status: 1,
          technical: [
              {
                  customer_experience: "",
                  marketing: "",
                  management: "",
                  administration: "",
                  presentation: "",
                  production_quality: "",
                  efficiency: "",
              },
          ],
          organisation: [
              {
                  ability_to_meet_deadline: "",
                  conflict_management: "",
                  critical_thinking: "",
                  integrity: "",
                  team_work: "",
                  professionalism: "",
                  efficiency: ''
              },
          ]
      });
          const sendForApproval = useSelector((state) => state?.sendForApproval);
      
      const employeeData = useSelector((state) => state?.employeeList);
      const employeeList = employeeData?.data || [];
  
      const performanceData = useSelector((state) => state?.performanceDetails);
      const performanceDetails = performanceData?.data?.result;
  
      const fetchEmployee = (search = "") => {
          const sendData = {};
          if (search) {
              sendData["search"] = search;
          }
          dispatch(getEmployeeList(sendData));
      };
  
      useEffect(() => {
          const path = location.pathname;
          if (path.includes('/add-performance') || path.includes('/edit-performance')) {
              if (employeeList?.length === 0) fetchEmployee("");
          }
      }, [location]);
  
      useEffect(() => {
        //   if (id && performanceDetails?.id != id) {
              dispatch(getPerformanceDetails({ id }));
        //   }
      }, [id]);
  
      const handleEmployeeSearch = (query, type) => {
          fetchEmployee(query);
      };
  
      useEffect(() => {
          const path = location.pathname;
          if (path.includes("/add-performance")) {
              setViewMode("add");
          } else if (path.includes("/edit-performance")) {
              setViewMode("edit");
          } else if (path.includes("/performance-details")) {
              setViewMode("detail");
          }
      }, [location.pathname, id]);
      useEffect(() => {
          if (id && performanceDetails) {
              const technicalDetails = JSON.parse(performanceDetails?.technical)
              const organisationDetails = JSON.parse(performanceDetails?.organisation)
              setFormData((prev) => ({
                  ...prev,
                  // user: [performanceDetails?.employee?.first_name, performanceDetails?.employee?.last_name]?.filter(Boolean)?.join(" "),
                  user: performanceDetails?.employee?.employee_id,
                  user_id: performanceDetails?.user_id,
                  image: performanceDetails?.employee?.image?.length > 0 ? JSON.parse(performanceDetails?.employee?.image) : '',
                  appraisal_date: performanceDetails?.appraisal_date,
                  department: performanceDetails?.employee?.department?.department_name,
                  designation: performanceDetails?.employee?.designation?.designation_name,
                  status: performanceDetails?.status,
                  technical: [
                      {
                          customer_experience: technicalDetails?.customer_experience,
                          marketing: technicalDetails?.marketing,
                          management: technicalDetails?.management,
                          administration: technicalDetails?.administration,
                          presentation: technicalDetails?.presentation,
                          production_quality: technicalDetails?.production_quality,
                          efficiency: technicalDetails?.efficiency,
                      },
                  ],
                  organisation: [
                      {
                          ability_to_meet_deadline: organisationDetails?.ability_to_meet_deadline,
                          conflict_management: organisationDetails?.conflict_management,
                          critical_thinking: organisationDetails?.critical_thinking,
                          integrity: organisationDetails?.integrity,
                          team_work: organisationDetails?.team_work,
                          professionalism: organisationDetails?.professionalism,
                          efficiency: organisationDetails?.efficiency
                      },
                  ]
              }));
          }
  
      }, [viewMode, performanceDetails]);
  
      const handleEditClick = () => navigate(`/edit-performance/${id}`);
  
      const renderHeader = () => {
          switch (viewMode) {
              case "add": return "Add New Approval";
              case "edit": return "Edit Approval";
              default: return "Approval Details";
          }
      };
  
      const renderMark = () => {
          switch (viewMode) {
              case "add": return "Fill The Information";
              case "edit": return "Edit Information";
              default: return "Provided Details";
          }
      };
  
      const renderHeaderInfo = () => {
          switch (viewMode) {
              case "add": return "You're just one step away from adding the new Approval details!";
              case "edit": return "Here’s the information about the Approval details you’ve filled.";
              default: return "Check Out Approval Information!";
          }
      };
  
      if (performanceData?.loading) {
          return <div className="loading-state"><Loader /></div>;
      }
      const handleStatus = (val) => {
          setFormData((prevData) => ({
              ...prevData,
              status: val,
          }));
      };

          const handleApprovalBtn= async()=>{
              try{
                  const dataToSend= {
                      id,
                      status:ModalData?.type === "Approve"? 1 : 3 
                  }
             const res=  await dispatch(SendApproval(dataToSend))
             if(res?.data?.status){
              setShowModal(false);
              dispatch(getPerformanceDetails({ id }));
             }
          }
          catch(error){
                      setShowModal(false);
                      console.log("error-", error);
                  };
          }
  return (
     <div className="performanceDetailMain performanceDetailMainHead">
         <ConfirmPopup
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleApprovalBtn}
                    type={ModalData?.type}
                    module={ModalData?.module}
                    loading={sendForApproval?.loading}
                />
                <button onClick={() => navigate('/approval-list')} className="close_nav header_close">
                    Close
                </button>
                <div className="dept-page-container">
                    <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                    <div className="dept-page-content-wrapper">
                        <div className="dept-page-left-panel">
                            <h3 className="dept-page-mark-text">{renderMark()}</h3>
                            <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                            <div className="dept-page-illustration-box">
                                <img
                                    className="imgB lackedWhite"
                                    src={bannerImg}
                                    alt="Illustration"
                                />
                            </div>
                        </div>
    
                        <div className="dept-page-right-panel">
                            <div className="approvedHeadWrapper">
                            <div className="dept-page-cover-section dept-page-cover-section_2">
                                <UserProfileImageUpload
                                    formData={formData}
                                    setFormData={setFormData}
                                    fieldName="image"
                                    isEditMode={false}
                                />
                                {/* {viewMode !== "detail" ? ( */}
                                <StatusDropdown
                                    options={performanceStatusOptions
                                        ?.filter((item) => item?.label !== "All")
                                        ?.map((item) => ({
                                            value: item?.id,
                                            label: item?.label,
                                            icon: item?.icon,
                                        }))}
                                    defaultValue={formData?.status}
                                    onChange={(val) => handleStatus(val)}
                                    disabled={true}
                                // viewMode={viewMode !== "detail"}
                                />
                                {/* ) : (
                                    <div className="status-dropdown">
                                        <div className={`status-label dropdown-trigger`}>
                                            {performanceStatusOptions?.filter((item) => item?.id == formData?.status)?.[0]?.label}
    
                                        </div>
                                    </div>
                                )} */}
                                {/* {viewMode === 'detail' && (
                                    <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                        Edit
                                    </button>
                                )} */}
                            </div>

                           <div class="approvalHeadRight">
                            <button style={formData?.status != 4?{opacity:0.5, cursor:"default", pointerEvents:"none"}:{}} onClick={() =>{ setShowModal(true);setModalData({type:"Approve", module:"Approval"})}} class="approvedBtn status-label status-approved">Approved</button>
                            <button style={formData?.status != 4?{opacity:0.5, cursor:"default", pointerEvents:"none"}:{}} onClick={() => {setShowModal(true);setModalData({type:"Declined", module:"Approval"})}} class="declined status-label status-declined">Declined</button>
                            </div>
                            </div>
    
    
                            <ApprovalForm
                                viewMode={viewMode}
                                formData={formData}
                                setFormData={setFormData}
                                handleSearch={handleEmployeeSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>
  )
}
