// ticket details page
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import bannerImg from "../../assets/tiket.svg";
import Loader from "../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../utils/common/StatusDropdown/StatusDropdown.jsx";
import "../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import { FaTicketSimple } from "react-icons/fa6";
import { ticketStatusOptions } from "../../utils/Constant.js";
import { useDispatch, useSelector } from "react-redux";
import { TicketForm } from "./TicketForm.jsx";
import './TicketDetails.scss'
import { getEmployeeList } from "../../Redux/Actions/employeeActions.js";
import { getTicketDetails } from "../../Redux/Actions/ticketActions.js";

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
        const sendData = {employee_status: 1};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-ticket')) {
            // if (employeeList?.length === 0) 
            fetchEmployee("");
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
        }
        else if (path.includes("/ticket-details")) {
            setViewMode("detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && ticketDetails) {
            setFormData((prev) => ({
                ...prev,
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

    const renderHeader = () =>
        viewMode === "add"
            ? "Add New Ticket"
                : "Ticket Details";
    const renderMark = () =>
        viewMode === "add" ? "Fill The Information"
            : "Provided Details.";
    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from adding the new ticket!"
                : "Check out your ticket information!";

    if (ticketData?.loading) {
        return (
            <div className="loading-state"> <Loader /> </div>
        )
    }

    return (
        <div className="ticketDetailMain">
            <button onClick={() => navigate('/ticket-list')} className="close_nav header_close">Close</button>
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

                            {viewMode === "detail" &&
                            <StatusDropdown
                                options={ticketStatusOptions
                                    ?.filter((item) => item?.label !== "All")
                                    ?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,
                                    }))}
                                defaultValue={formData?.status}
                                viewMode={viewMode !== "detail"}
                                disabled={true}
                            />
                            }
                        </div>

                        <TicketForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
