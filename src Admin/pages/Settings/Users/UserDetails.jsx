import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    IdCard,
    FolderPen,
    Mail,
    LogOut
} from 'lucide-react';
import bannerImg from '../../../assets/Download.svg';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import './UserDetails.scss'
import { UserProfileImageUpload } from '../../../utils/common/UserProfileImageUpload/UserProfileImageUpload';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDetails } from '../../../Redux/Actions/employeeActions';
import Loader from '../../../utils/common/Loader/Loader';
import { getUserList, setUserRole, updateUserStatus } from '../../../Redux/Actions/Settings/userAction';
import { toast } from 'react-toastify';
import { handleFormError } from '../../../utils/helper';
import { userStatusOption } from '../../../utils/Constant';
import defaultImage from "../../../assets/default-user.png";
import SaveBtn from '../../../utils/common/SaveBtn';
import ConfirmPopup from '../../../utils/common/ConfirmPopup';

export const UserDetails = () => {
    const { id } = useParams()
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const employee_ref = useRef(null);

    const [errors, setErrors] = useState({
        employee_id: false,
    });

    const basicRequiredFields = [
        { key: "employee_id", label: "Please select employee", required: true, ref: employee_ref },
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
                setErrors(prev => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };

    //states
    const userData = useSelector((state) => state?.userList);
    const userList = userData?.data?.result || [];

    const employeeDetails = useSelector((state) => state?.employeeDetails);
    const employeeDetail = employeeDetails?.data?.result;
    const userDetail = employeeDetails?.data?.user;
    const employeeDetailsLoading = employeeDetails?.loading;

    const userRoleState = useSelector((state) => state?.userRole);
    const userRoleLoading = userRoleState?.loading || false;

    const updateStatus = useSelector((state) => state?.userStatus);

    const [formData, setFormData] = useState({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        is_disabled: 0,
        image: null,
        role_id: 0
    });

    const fetchEmployees = (search = "") => {
        const sendData = { employee_status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getUserList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "employee_id") fetchEmployees(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/settings/assign-role') || path.includes('/settings/edit-user-details')) {
            // if (userList?.length === 0) 
            fetchEmployees();
        }
    }, [location.pathname]);

    useEffect(() => {
        if (id && employeeDetail?.user_id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getEmployeeDetails(queryParams));
        }
    }, [id]);

    const employeeImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })() : defaultImage;

    useEffect(() => {
        if (id && employeeDetail) {
            setFormData((prev) => ({
                ...prev,
                employee_id: employeeDetail?.user_id,
                first_name: employeeDetail?.first_name ? employeeDetail?.first_name : "",
                last_name: employeeDetail?.last_name ? employeeDetail?.last_name : "",
                email: employeeDetail?.email,
                is_disabled: userDetail?.is_disabled,
                role_id: userDetail?.role_id,
                image: employeeImage(employeeDetail?.image)
            }))
        }
    }, [employeeDetail]);

    const [viewMode, setViewMode] = useState('');

    const employeeOptions = useMemo(
        () =>
            userList?.map((e) => {
                const fullName = [e?.employee?.first_name, e?.employee?.last_name]
                    .filter(Boolean)
                    .join(" ");
                return {
                    id: e?.employee?.user_id,
                    label: `${fullName} (${e?.employee?.employee_id})`,
                };
            }),
        [userList]
    );

    const handleSelect = (name, item) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: item?.id,
        }));
        if (name === "employee_id") {
            const selectedEmployee = userList?.find(emp => emp?.id === item?.id);
            if (selectedEmployee) {
                setFormData(prevData => ({
                    ...prevData,
                    first_name: selectedEmployee?.employee?.first_name,
                    last_name: selectedEmployee?.employee?.last_name,
                    email: selectedEmployee?.employee?.email,
                    is_disabled: selectedEmployee?.is_disabled,
                    role_id: selectedEmployee?.role_id,
                    image: employeeImage(selectedEmployee?.employee?.image),
                }));
            }
        }
    };

    //update status
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleStatus = (val) => {
        if (viewMode === "detail") {
            setShowModal(true);
            setSelectedStatus(val);
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                is_disabled: val,
            }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //User login enable disable options
    const enableDisableOptions = [
        { id: 1, label: "Employee" },
        { id: 2, label: "Admin" }
    ];

    useEffect(() => {
        if (location.pathname.includes("/settings/assign-role")) {
            // setFormData(emptyUser);
            setViewMode('add')
        }
        else if (location.pathname.includes("/settings/edit-user-details")) {
            setViewMode('edit');
        }
        else if (location.pathname.includes("/settings/user-details")) {
            setViewMode('detail');
        }
    }, [location])

    const handleEditClick = () => {
        navigate(`/settings/edit-user-details/${id}`)
        setViewMode("edit");
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSubmit = {
            user_id: formData?.employee_id,
            is_disabled: selectedStatus !== "" ? selectedStatus : formData?.is_disabled,
            role_id: formData?.role_id
        };

        dispatch(setUserRole(dataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    if (selectedStatus) {
                        setFormData(prev => ({ ...prev, "is_disabled": selectedStatus }));
                        setShowModal(false);
                    }
                    navigate(viewMode === 'add' ? '/settings/users-list' : `/settings/user-details/${id}`);
                    if (id) dispatch(getEmployeeDetails({ id }));
                    setSelectedStatus("");
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Assign Role';
            case 'edit': return 'Edit User Details';
            case 'detail': default: return 'User Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit User Details';
            case 'detail': default: return 'Provided Details!';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're Just One Step Away From Assigning The New Role!  ";
            case 'edit': return "Edit The Information About The User Details You’ve Filled. ";
            case 'detail': default: return "see details that Role has been assigned for specific user";
        }
    };


    if (employeeDetailsLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="userDetailsMain">
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleSaveOrUpdate}
                type={formData?.is_disabled === 0 ? "disable" : "enable"}
                module="login"
                role={formData?.role_id === 1 ? "User" : formData?.role_id === 2 ? "Admin" : ""}
                loading={userRoleLoading}
            />
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/settings/user-details/${id}` : '/settings/users-list'}`)} className="close_nav header_close">Close</button>

            <div className="dept-page-container">
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img className='imgBlacked White' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel seeting_form_2">
                        <div className="dept-page-cover-section dept-page-cover-section_2">
                            {/* <div className="dept-page-image-placeholder"> */}
                            <div className="form-group attachment_form">
                                <UserProfileImageUpload
                                    formData={formData}
                                    setFormData={setFormData}
                                    fieldName="image"
                                    isEditMode={false}
                                />
                            </div>
                            {/* </div> */}
                            <StatusDropdown
                                options={userStatusOption?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.is_disabled}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/* */}
                                Edit
                            </button>
                        )}
                        <div className="dept-page-basic-info-section">
                            <h3>Basic Information</h3>
                            <p className="dept-page-subtitle">Please Provide Employee Basic Details Below.</p>
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><IdCard size={20} strokeWidth={1.5} /></div>
                                <label className={viewMode === "add" && "redCol"}>Employee ID {viewMode === "add" && <span className='redCol mandat'>*</span>}</label>
                                <SelectDropdown
                                    selectedValue={formData?.employee_id}
                                    options={employeeOptions}
                                    onSelect={handleSelect}
                                    searchPlaceholder="Search Employee"
                                    handleSearch={handleSearch}
                                    type="employee_id"
                                    loading={userData?.loading}
                                    showSearchBar={true}
                                    disabled={viewMode === 'detail' || viewMode === 'edit'}
                                />
                            </div>
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><FolderPen size={20} strokeWidth={1.5} /></div>
                                <label className={viewMode === "add" && "redCol"}>First Name {viewMode === "add" && <span className='redCol mandat'>*</span>}</label>
                                <input
                                    type="text"
                                    name='First_Name'
                                    value={formData?.first_name}
                                    onChange={(e) => handleChange(e)}
                                    disabled={viewMode === 'detail'}
                                />
                            </div>
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><FolderPen size={20} strokeWidth={1.5} /></div>

                                <label className={viewMode === "add" && "redCol"}>Last Name {viewMode === "add" && <span className='redCol mandat'>*</span>}</label>
                                <input
                                    name='Last_Name'
                                    value={formData?.last_name}
                                    onChange={(e) => handleChange(e)}
                                    disabled={viewMode === 'detail'}
                                    className="text-area-disabled"
                                />
                            </div>
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><Mail size={20} strokeWidth={1.5} /></div>
                                <label className={viewMode === "add" && "redCol"}>Email Address {viewMode === "add" && <span className='redCol mandat'>*</span>}</label>
                                <input
                                    name='Email'
                                    value={formData?.email}
                                    disabled={viewMode === 'detail'}
                                    onChange={(e) => handleChange(e)}
                                    className="text-area-disabled"
                                />
                            </div>

                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><LogOut size={20} strokeWidth={1.5} /></div>
                                <label>Role</label>
                                <SelectDropdown
                                    selectedValue={formData?.role_id}
                                    options={enableDisableOptions}
                                    onSelect={handleSelect}
                                    type="role_id"
                                    disabled={viewMode === 'detail'}
                                />
                            </div>
                        </div>
                        {/* {(viewMode === 'add' || viewMode === 'edit') && (
                            <button className="dept-page-action-btn" onClick={handleSaveOrUpdate}>
                                {userRoleLoading ?
                                    <LoadingButton loading={userRoleLoading} color='#fff' />
                                    :
                                    <>
                                        {viewMode === 'add' ? 'Assign Role' : 'UPDATE'}
                                    </>
                                }
                            </button>
                        )} */}
                        {(viewMode === "add" || viewMode === "edit") && (
                            <SaveBtn
                                handleSubmit={handleSaveOrUpdate}
                                viewMode={viewMode}
                                loading={userRoleLoading}
                                btntype='buttom_fix_btn'
                                color='#fff' />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
