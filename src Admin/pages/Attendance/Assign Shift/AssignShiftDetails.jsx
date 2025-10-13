import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Assuming you have a similar banner image
import bannerImg from "../../../assets/Text_1.svg";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import { getDepartmentList, getEmpDepartmentDetails } from "../../../Redux/Actions/departmentActions.js";
import { getShiftList } from "../../../Redux/Actions/shiftActions.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import './AssignShiftDetails.scss'
import { toast } from "react-toastify";
import { BiSolidCalendarEdit } from "react-icons/bi";
import dayjs from 'dayjs';
import AssignShiftForm from "./AssignShiftForm.jsx";

// Initial state for the 'Add New Shift' form
const initialFormData = {
    department_id: '',
    department_name: '',
    employees: [],
    date: dayjs().format('DD-MM-YYYY'),
    shift_id: "",
    shift_name: ""
};

export const AssignShiftDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch()

    const [viewMode, setViewMode] = useState("add"); // 'add', 'edit', or 'detail'
    const [formData, setFormData] = useState(initialFormData);

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    //shift list from redux
    const shiftData = useSelector((state) => state?.shiftList);
    const shiftLists = shiftData?.data?.result || [];

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const fetchShifts = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getShiftList(sendData));
    };

    const fetchEmployees = async (search = "", id = formData?.department_id) => {
        const sendData = { department_id: id, };
        if (search) {
            sendData["search"] = search;
        }
        const res = await dispatch(getEmpDepartmentDetails(sendData))
        if (res?.status === 200) {
            if (res?.data?.getDepartmentEmp?.length === 0) {
                toast.error("There is no any employee in this department");
            }
        }
    };

    const handleSearch = (query, type) => {
        if (type === "department_id") fetchDepartments(query);
        if (type === "shift_id") fetchShifts(query);
        if (type === "employee") fetchEmployees(query, formData?.department_id);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/assign-shift') || path.includes('/edit-assign-shift')) {
            if (departmentLists?.length === 0) fetchDepartments();
            if (shiftLists?.length === 0) fetchShifts();
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/assign-shift")) {
            setViewMode("add");
            setFormData(initialFormData);
        } else if (path.includes("/edit-assign-shift")) {
            setViewMode("edit");
            // In a real app, you would fetch data by id here
        } else if (path.includes("/assign-shift-details")) {
            setViewMode("detail");
            // In a real app, you would fetch data by id here
        }
    }, [location.pathname, id]);


    // --- Dynamic Content Renderers ---
    const renderHeader = () =>
        viewMode === "add"
            ? "Assign Shift"
            : viewMode === "edit"
                ? "Edit Assigned Shift"
                : "Assigned Shift Details";

    const renderMark = () =>
        viewMode === "add"
            ? "Fill The Information"
            : viewMode === "edit"
                ? "Edit The Information"
                : "Provided Details.";

    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from Assigning the new Shift! Don't forget to check your profile for updates."
            : viewMode === "edit"
                ? "Here’s the information about the shift you can edit."
                : "Here’s the information about the shift you've assigned.";

    return (
        <div className="assignShiftMain">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/assign-shift-details/${id}` : '/assign-shift-list'}`)} className="close_nav header_close">Close</button>

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
                            
                        </div>

                        <AssignShiftForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                            handleEmployees={fetchEmployees}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};