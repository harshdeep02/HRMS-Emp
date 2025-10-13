// ticket details page
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import bannerImg from "../../../assets/tiket.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import "../../EmployeeModule/Applicant/ApplicantDetails.scss";
import '../../EmployeeModule/Job/JobDetails.scss'
import { FaTicketSimple } from "react-icons/fa6";
import { ticketStatusOptions } from "../../../utils/Constant.js";
import { useDispatch, useSelector } from "react-redux";
import { TicketForm } from "./TicketForm.jsx";
import './TicketDetails.scss'
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import { getTicketDetails } from "../../../Redux/Actions/ticketActions.js";

export const TicketDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;

    const ticketData = useSelector((state) => state?.ticketDetails);
    const ticketDetails = ticketData?.data?.result;

    const [viewMode, setViewMode] = useState("detail");
    const [formData, setFormData] = useState({
        user_id: "",
        user: "",
        requested_to: "",
        requested_to_id: "",
        priority: "",
        subject: "",
        date: '',
        description: "",
        status: 1,
        attachment: "",
    });

    const fetchEmployee = (search = "") => {
        const sendData = {};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-ticket') || path.includes('/edit-ticket')) {
            if (employeeList?.length === 0) fetchEmployee("");
        }
    }, [location]);

    useEffect(() => {
        if (id && ticketDetails?.id != id) {
            dispatch(getTicketDetails({ id }));
        }
    }, [id]);

    const handleSearch = (query, type) => {
        fetchEmployee(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/add-ticket")) {
            setViewMode("add");
        } else if (path.includes("/edit-ticket")) {
            setViewMode("edit");
        }
        else if (path.includes("/ticket-details")) {
            setViewMode("detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && ticketDetails) {
            setFormData((prev) => ({
                ...prev,
                user: ticketDetails?.user ? [ticketDetails?.user?.first_name, ticketDetails?.user?.last_name]
                    .filter(Boolean)
                    .join(" ") : "",
                user_id: ticketDetails?.user_id,
                requested_to: ticketDetails?.requested_to ? [ticketDetails?.requested_to?.first_name, ticketDetails?.requested_to?.last_name]
                    .filter(Boolean)
                    .join(" ") : "",
                requested_to_id: ticketDetails?.requested_to?.id,
                priority: ticketDetails?.priority,
                subject: ticketDetails?.subject,
                date: ticketDetails?.date,
                description: ticketDetails?.description,
                status: ticketDetails?.status,
                attachment: ticketDetails?.attachment?.length > 0 ? JSON.parse(ticketDetails?.attachment) : "",
            }));
        }
    }, [viewMode, ticketDetails]);

    const handleEditClick = () => navigate(`/edit-ticket/${id}`);

    const handleStatus = (val) => {
        setFormData((prevData) => ({
            ...prevData,
            status: val,
        }));
    };

    const renderHeader = () =>
        viewMode === "add"
            ? "Add New Ticket"
            : viewMode === "edit"
                ? "Edit Ticket"
                : "Ticket Details";
    const renderMark = () =>
        viewMode === "add" ? "Fill The Information" : viewMode === "edit"
            ? "Edit Information"
            : "Provided Details.";
    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from adding the new ticket!"
            : viewMode === "edit"
                ? "Here’s the information about the Ticket details you’ve filled."
                : "Check out your ticket information!";

    if (ticketData?.loading) {
        return (
            <div className="loading-state"> <Loader /> </div>
        )
    }

    return (
        <div className="ticketDetailMain">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/ticket-details/${id}` : '/ticket-list'}`)} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img
                                className=" "
                                src={bannerImg}
                                alt="Illustration"
                            />
                        </div>
                    </div>

                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Ticket’s Basic Details Below.</p>
                            </div>

                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={ticketStatusOptions
                                    ?.filter((item) => item?.label !== "All")
                                    ?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,
                                    }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {ticketStatusOptions?.filter((item) => item?.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>

                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}

                        <TicketForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                            employeeList={employeeList}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
