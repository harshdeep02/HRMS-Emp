import { useState, useEffect, useRef } from 'react';
import './AddEmloyee.scss';
import BasicDetailsForm from './BasicDetailsForm';
import ContactsForm from './ContactsForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import DocumentsForm from './DocumentsForm.jsx';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from '../../../Redux/Actions/employeeActions.js';
import dayjs from 'dayjs';
import { handleFormError } from '../../../utils/helper.js';
import { BookOpenText, BookUser, Briefcase, Calendar, Files, Folder, List, MapPinHouse, SquarePen, Ticket, Trophy } from 'lucide-react';
import Tooltips from '../../../utils/common/Tooltip/Tooltips.jsx';
import RemarksForm from './RemarksForm.jsx';
import Loader from '../../../utils/common/Loader/Loader.jsx';
import { getCityList, getStateList } from '../../../Redux/Actions/locationActions.js';
import { getDepartmentList } from '../../../Redux/Actions/departmentActions.js';
import { getDesignationList } from '../../../Redux/Actions/designationActions.js';
import { getEmployeeList } from '../../../Redux/Actions/employeeActions.js';
import { getShiftList } from '../../../Redux/Actions/shiftActions.js';
import { EmpProject } from '../EmpProject/EmpProject.jsx';
import { getWorkLocList } from '../../../Redux/Actions/Settings/organizationActions.js';
import { getUserData } from '../../../services/login.js';
import AttendanceCalendar from '../Attendance/AttendanceCalendar.jsx';
import { EmpTickets } from '../EmpTickets/EmpTickets.jsx';
import { EmpPerformance } from '../Performance/EmpPerformance.jsx';
import { LeaveSummary } from '../../Leave Tracker/Leave/LeaveSummary.jsx';




const AddEmployee = () => {

    const { id } = getUserData();
    const location = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const path = location.pathname
    const [isEditMode, setIsEditMode] = useState(false);

    const employeeDetails = useSelector((state) => state?.employeeDetails);
    const employeeDetail = employeeDetails?.data?.result;
    const userDetail = employeeDetails?.data?.user;
    const employeeLoading = employeeDetails?.loading || false;

    const formNames = ['Basic Information', 'Address', 'Experience', 'Education', 'Documents', 'Remarks', 'Projects'];
    let navItems = [
        { name: 'Basic Information', icon: BookUser },
        { name: 'Address', icon: MapPinHouse },
        { name: 'Experience', icon: Briefcase },
        { name: 'Education', icon: BookOpenText },
        { name: 'Documents', icon: Files },
        { name: 'Remarks', icon: SquarePen },
        { name: 'Attendance', icon: List },
        { name: 'Leaves', icon: Calendar },
        { name: 'Performance', icon: Trophy },
        { name: 'Projects', icon: Folder },
        { name: 'Tickets', icon: Ticket },
    ];

    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const [filledForms, setFilledForms] = useState({
        'Basic Information': false,
        'Address': false,
        'Experience': false,
        'Education': false,
        'Documents': false,
        'Remarks': false,
        'Projects': false,
        'Attendance': false,
        'Leaves': false,
        'Performance': false,
        'Projects': false,
        'Tickets': false,
    });

    const [errors, setErrors] = useState({
        basicDetails: {},
        contactDetails: {},
        educationDetails: {},
        experienceDetails: {},
        documentDetails: {},
        remarksDetails: {},
        AttendanceDetails: {},
    });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        display_name: '',
        email: '',
        mobile_no: '',
        pan: '',
        date_of_birth: '',
        age: '',
        marital: '',
        gender: '',
        joining_date: '',
        designation_id: '',
        password: '',
        user_expiry_date: dayjs().format('DD-MM-YYYY'),
        shift_id: '',
        role: '',
        department_id: '',
        reporting_manager_id: '',
        date_of_exit: '',
        job_location_id: '',
        work_location_id: '',
        differently_abled_type: '',
        is_metro: '',
        employment_type: '',
        employee_status: 1,
        source_of_hire: '',
        image: "", //
        // experience: '',
        contact_name: '',
        emergency_contact_no: '',
        personal_email_id: '',
        employee_relation: '',
        contacts: [
            {
                address_type: "Present",
                street_1: '',
                street_2: '',
                zip_code: '',
                city_id: '',
                city_name: '',
                state_id: '',
                state_name: '',
                country_id: '',
                country_name: '',
                personal_contact_no: '',
                emergency_contact_no: '',
                personal_email_id: '',
                is_present_address: "1"
            },
            {
                address_type: "Permanent",
                street_1: '',
                street_2: '',
                zip_code: '',
                city_id: '',
                city_name: '',
                state_id: '',
                state_name: '',
                country_id: '',
                country_name: '',
                personal_contact_no: '',
                emergency_contact_no: '',
                personal_email_id: '',
                is_present_address: "0"
            }
        ],
        experiences: [],
        educations: [],
        documents: [],
        remarks: []
    }
    );

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const fetchDesignation = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDesignationList(sendData));
    };

    const fetchEmployee = (search = "") => {
        const sendData = { employee_status: "1,5" };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    const fetchShift = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getShiftList(sendData));
    };

    const fetchWorkLocation = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getWorkLocList(sendData));
    };

    const fetchState = (search = "", id = "") => {
        const sendData = {
            country_id: id
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getStateList(sendData));
    };

    const fetchCity = (search = "", id = "") => {
        const sendData = {
            state_id: id,
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getCityList(sendData));
    };

    const handleSearch = (query, type, id = "") => {
        if (type === "department_id") fetchDepartments(query);
        if (type === "designation_id") fetchDesignation(query);
        if (type === "employee") fetchEmployee(query);
        if (type === "shift_id") fetchShift(query);
        if (type === "work_location_id") fetchWorkLocation(query);
    };

    useEffect(() => {
        if (path.includes("edit-employee") || path.includes("add-employee")) {
            fetchDepartments();
            fetchDesignation();
            fetchEmployee();
            fetchShift();
            fetchWorkLocation();
        }
    }, [location.pathname]);

    useEffect(() => {
        if (id && employeeDetail?.user_id != id) {
            dispatch(getEmployeeDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && employeeDetail) {
            // Extract only the necessary fields from contacts
            const filteredContacts = (employeeDetail?.contacts?.length > 0) ? employeeDetail?.contacts?.map((item) => ({
                id: item?.id,
                address_type: item?.address_type,
                street_1: item?.street_1 ? item?.street_1 : '',
                street_2: item?.street_2 ? item?.street_2 : '',
                zip_code: item?.zip_code ? item?.zip_code : '',
                city_id: item?.city ? item?.city?.id : '',
                city_name: item?.city ? item?.city?.name : '',
                state_id: item?.state ? item?.state?.id : '',
                state_name: item?.state ? item?.state?.name : '',
                country_id: item?.country ? item?.country?.id : '',
                country_name: item?.country ? item?.country?.name : '',
                personal_contact_no: item?.personal_contact_no ? item?.personal_contact_no : "",
                emergency_contact_no: item?.emergency_contact_no ? item?.emergency_contact_no : "",
                personal_email_id: item?.personal_email_id ? item?.personal_email_id : "",
                is_present_address: item?.is_present_address
            })) : [
                {
                    address_type: "Present",
                    street_1: '',
                    street_2: '',
                    zip_code: '',
                    city_id: '',
                    city_name: '',
                    state_id: '',
                    state_name: '',
                    country_id: '',
                    country_name: '',
                    personal_contact_no: '',
                    emergency_contact_no: '',
                    personal_email_id: '',
                    is_present_address: "1"
                },
                {
                    address_type: "Permanent",
                    street_1: '',
                    street_2: '',
                    zip_code: '',
                    city_id: '',
                    city_name: '',
                    state_id: '',
                    state_name: '',
                    country_id: '',
                    country_name: '',
                    personal_contact_no: '',
                    emergency_contact_no: '',
                    personal_email_id: '',
                    is_present_address: "0"
                }
            ];

            // Extract only the necessary fields from experiences
            const filteredExperiences = (employeeDetail?.experiences?.length > 0) ? employeeDetail?.experiences?.map((item) => ({
                id: item?.id,
                company_name: item?.company_name ? item?.company_name : "",
                industry: item?.industry ? item?.industry : "",
                job_title: item?.job_title ? item?.job_title : "",
                duration: item?.duration ? item?.duration : "",
                from_date: item?.from_date ? item?.from_date : null,
                to_date: item?.to_date ? item?.to_date : null,
                description: item?.description ? item?.description : "",
                experience_letter: JSON.parse(item?.experience_letter || null),
            })) : [];

            // Extract only the necessary fields from educations
            const filteredEducations = (employeeDetail?.educations?.length > 0) ? employeeDetail?.educations?.map((item) => ({
                id: item?.id,
                institute_name: item?.institute_name ? item?.institute_name : "",
                education_level: item?.education_level ? item?.education_level : "",
                degree: item?.degree ? item?.degree : "",
                specialization: item?.specialization ? item?.specialization : "",
                certificate_attachment: JSON.parse(item?.certificate_attachment || null),
                date_of_completion: item?.date_of_completion ? item?.date_of_completion : "",
                from_date: item?.from_date,
                to_date: item?.to_date
            })) :
                [];

            // Extract only the necessary fields from documents
            const filteredDocuments = (employeeDetail?.documents?.length > 0) ? employeeDetail?.documents?.map((item) => ({
                id: item?.id,
                document_type: item?.document_type ? item?.document_type : "",
                document_no: item?.document_no ? item?.document_no : "",
                expiry_date: item?.expiry_date ? item?.expiry_date : "",
                issued_date: item?.issued_date ? item?.issued_date : "",
                front_side_attachment: JSON.parse(item?.front_side_attachment || null),
                back_side_attachment: JSON.parse(item?.back_side_attachment || null)
            })) : [];

            // Extract only the necessary fields from remarks
            const filteredRemarks = (employeeDetail?.remarks?.length > 0) ? employeeDetail?.remarks?.map((item) => ({
                id: item?.id,
                remark_type: item?.remark_type ? item?.remark_type : "",
                issued_date: item?.issued_date ? item?.issued_date : "",
                description: item?.description ? item?.description : "",
                remark_attachment: JSON.parse(item?.remark_attachment || null),
            })) : [];

            // const employeeImage =  JSON?.parse(employeeDetail?.image);
            const employeeImage = employeeDetail?.image
                ? (() => {
                    try {
                        return JSON?.parse(employeeDetail.image);
                    } catch {
                        return employeeDetail.image;
                    }
                })()
                : "";

            const work_location = employeeDetail?.work_location
                ? {
                    id: employeeDetail?.work_location?.id,
                    label: `${employeeDetail?.work_location?.work_location_name} (${[
                            employeeDetail?.work_location?.street_address1,
                            employeeDetail?.work_location?.street_address2 || null,
                            employeeDetail?.city || null,
                            employeeDetail?.state,
                            employeeDetail?.zip_code ? `-${employeeDetail.zip_code}` : null,
                        ]
                            .filter(Boolean) // removes null/undefined/empty
                            .join(", ")
                        })`,
                }
                : "";

            setFormData((prev) => ({
                ...prev,
                first_name: employeeDetail?.first_name ? employeeDetail?.first_name : "",
                last_name: employeeDetail?.last_name ? employeeDetail?.last_name : "",
                display_name: employeeDetail?.display_name ? employeeDetail?.display_name : "",
                // password: userDetail?.password,
                // user_expiry_date: userDetail?.user_expiry_date,
                email: employeeDetail?.email,
                mobile_no: employeeDetail?.mobile_no ? employeeDetail?.mobile_no : "",
                pan: employeeDetail?.pan ? employeeDetail?.pan : "",
                date_of_birth: employeeDetail?.date_of_birth ? employeeDetail?.date_of_birth : "",
                age: employeeDetail?.age ? employeeDetail?.age : "",
                marital: employeeDetail?.marital ? employeeDetail?.marital : "",
                gender: employeeDetail?.gender ? employeeDetail?.gender : "",
                joining_date: employeeDetail?.joining_date ? employeeDetail?.joining_date : null,
                designation_id: employeeDetail?.designation?.id ? employeeDetail?.designation?.id : "",
                designation_name: employeeDetail?.designation?.designation_name ?? "",
                shift_id: employeeDetail?.shift_id ? employeeDetail?.shift_id : "",
                shift_name: employeeDetail?.shift?.shift_name ?? "",
                job_location_id: employeeDetail?.job_location_id ? employeeDetail?.job_location_id : "",
                work_location_id: employeeDetail?.work_location_id ? employeeDetail?.work_location_id : "",
                work_location: work_location?.label,
                role: employeeDetail?.role ? employeeDetail?.role : '',
                department_id: employeeDetail?.department?.id ? employeeDetail?.department?.id : "",
                department_name: employeeDetail?.department?.department_name ?? "",
                reporting_manager_id: employeeDetail?.reporting_manager_id ? employeeDetail?.reporting_manager_id : "",
                date_of_exit: employeeDetail?.date_of_exit ? employeeDetail?.date_of_exit : "",
                employment_type: employeeDetail?.employment_type ? employeeDetail?.employment_type : "",
                employee_status: employeeDetail?.employee_status ? employeeDetail?.employee_status : "",
                source_of_hire: employeeDetail?.source_of_hire ? employeeDetail?.source_of_hire : "",
                differently_abled_type: employeeDetail?.differently_abled_type ? employeeDetail?.differently_abled_type : "",
                is_metro: employeeDetail?.is_metro ? employeeDetail?.is_metro : "",
                contact_name: employeeDetail?.contact_name ? employeeDetail?.contact_name : "",
                emergency_contact_no: employeeDetail?.emergency_contact_no ? employeeDetail?.emergency_contact_no : "",
                personal_email_id: employeeDetail?.personal_email_id ? employeeDetail?.personal_email_id : "",
                employee_relation: employeeDetail?.employee_relation ? employeeDetail?.employee_relation : "",
                image: employeeImage,
                // experience: employeeDetail?.experience,
                contacts: filteredContacts,
                experiences: filteredExperiences,
                educations: filteredEducations,
                documents: filteredDocuments,
                remarks: filteredRemarks
            }))
        }
    }, [employeeDetail]);

    const isEditPage = location.pathname.includes("edit-employee");

    return (
        <>
            <button onClick={() => navigate(`/employee-dashboard`)} className="close_nav header_close">Close</button>
            {employeeLoading ? (
                <Loader />
            ) : (
                <div className='form_page_'>
                    <div className="top-bar">
                        <div className='left' style={{ marginLeft: '-17px' }}>
                            <h2>My Profile</h2>
                            {/* <h2>{id ? "Edit Employee Details" : "Add new Employee Details"}</h2> */}
                            {/* <p>Please fill out your employee details below.</p> */}
                        </div>
                    </div>
                    <div className="employee-form">
                        <div className='employee_form_header'>
                            <div className='header_emp'>
                                <div className="navbar-container"> {/* Ek wrapper div add karein */}
                                    <div className="navbar-items">
                                        {navItems.map((item, index) => {

                                            return (
                                                <span
                                                    key={index}
                                                    className={`${index === activeFormIndex ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setActiveFormIndex(index);
                                                    }}
                                                >
                                                    <item.icon size={20} strokeWidth={1.5} /> {/* Icon render karein */}
                                                    <p>{item.name}</p> {/* Text render karein */}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${activeFormIndex === 0 ? 'BasicDetailsForm' : 'form-content'}`}>
                            <div className={`${activeFormIndex === 5 ||activeFormIndex === 6 || activeFormIndex === 10 || activeFormIndex === 9 || activeFormIndex === 8 || activeFormIndex === 7 ? '' : 'form_box'}`}>
                                <form>

                                    {activeFormIndex === 0 && <BasicDetailsForm formData={formData}/>}
                                    {activeFormIndex === 1 && <ContactsForm formData={formData}/>}
                                    {activeFormIndex === 2 && <ExperienceForm formData={formData}/>}
                                    {activeFormIndex === 3 && <EducationForm formData={formData} />}
                                    {activeFormIndex === 4 && <DocumentsForm formData={formData} />}
                                    {activeFormIndex === 5 && <RemarksForm formData={formData} />}
                                    {activeFormIndex === 6 && <AttendanceCalendar />}
                                    {activeFormIndex === 7 && <LeaveSummary/>}
                                    {activeFormIndex === 8 && <EmpPerformance />}
                                    {activeFormIndex === 9 && <EmpProject />}
                                    {activeFormIndex === 10 && <EmpTickets />}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddEmployee;
