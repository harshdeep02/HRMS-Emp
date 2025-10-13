import { Users, Building2, Parentheses, AppWindowMac, UserStar } from "lucide-react";
import SelectDropdown from "../../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import SaveBtn from "../../../../utils/common/SaveBtn.jsx";
import { toast } from "react-toastify";
import { handleFormError } from "../../../../utils/helper.js";
import bannerImg from "../../../../assets/detail_man.png";
import {
	createNewDepartment,
	getDepartmentList,
} from "../../../../Redux/Actions/departmentActions.js";
import { useLocation, useNavigate } from "react-router-dom";
// import '../../../Organization/Department/DepartmentDetail/DepartmentDetail.scss';
import '../../../Organization/Department/DepartmentDetail/DepartmentDetail.scss';
import { departmentStatusOptions } from "../../../../utils/Constant.js";
import { MdCreditCard } from "react-icons/md";
import StatusDropdown from "../../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import { getEmployeeList } from "../../../../Redux/Actions/employeeActions.js";

const AddDepartment = () => {

	const location = useLocation();
	const { orgId } = location?.state || {}
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		department_name: "",
		parent_department: [],
		department_head: "",
		status: 1,
	});
	//Data from redux
	const createUpdateDepartment = useSelector((state) => state?.createDepartment);
	const organizationDetailData = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetailData?.data?.data || {};

	const depHeadData = useSelector((state) => state?.employeeList);
	const depHeadList = depHeadData?.data?.result || [];

	const parentDepData = useSelector((state) => state?.departmentList);
	const parentDepLists = parentDepData?.data?.department || [];
	const departmentOptions = useMemo(
		() =>
			parentDepLists?.map((d) => ({ id: d?.id, label: d?.department_name })),
		[parentDepLists]
	);

	const headOptions = useMemo(
		() =>
			depHeadList?.map((e) => ({
				id: e?.employee?.user_id,
				label: [e?.employee?.first_name, e?.employee?.last_name]?.filter(Boolean)?.join(" "),
			})),
		[depHeadList]
	);

	const department_name_ref = useRef(null);
	const department_head_ref = useRef(null);

	const [errors, setErrors] = useState({
		department_name: false,
		department_head: false,
	});

	const basicRequiredFields = [
		{
			key: "department_name",
			label: "Please fill Department Name",
			required: true,
			ref: department_name_ref,
		},
		{
			key: "department_head",
			label: "Please select Department Head",
			required: true,
			ref: department_head_ref,
		},
	];

	const handleStatus = (val) => {
		setFormData((prevData) => ({
			...prevData,
			status: val,
		}));
	};

	const fetchDepHead = (search = "") => {
		//employee_status: "1,5"
		const sendData = { employee_status: 1 };
		if (search) {
			sendData["search"] = search;
		}
		dispatch(getEmployeeList(sendData));
	};

	// Fetch data based on current state
	const fetchParentDep = (search = "") => {
		const sendData = {status: 1};
		if (search) {
			sendData["search"] = search;
		}
		dispatch(getDepartmentList(sendData));
	};

	const handleSearch = (query, type) => {
		if (type === "department_head") {
			fetchDepHead(query);
		} else if (type === "parent_department") {
			fetchParentDep(query);
		}
	};

	useEffect(() => {
		const path = location.pathname;
		// if (depHeadList?.length === 0) 
		fetchDepHead();
		// if (parentDepLists?.length === 0) 
		fetchParentDep();
	}, [location.pathname]);

	const handleSelect = (name, item) => {
		setFormData((prevData) => ({
			...prevData,
			[name]: item?.id,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: false,
		}));
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
		// Update only basicDetails errors
		setErrors((prevState) => ({
			...prevState,
			[name]: false, // Clear error for this field
		}));
	};

	const validateForm = () => {
		for (let field of basicRequiredFields) {
			const value = formData[field.key];
			if (
				field.required &&
				(!value || (typeof value === "string" && !value.trim()))
			) {
				setErrors((prev) => ({ ...prev, [field.key]: field.label }));
				toast.error(field.label);
				handleFormError(field?.ref);
				return false;
			}
		}
		return true;
	};

	const handleSaveOrUpdate = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const formDataToSubmit = {
			...formData,
			organisation_id: organizationDetail?.organisation_id
		};
		dispatch(createNewDepartment(formDataToSubmit))
			.then((res) => {
				if (res?.status === 200) {
					navigate(`/settings/organization-department/${orgId}`)
				}
			})
			.catch((error) => {
				console.log("error-", error);
			});
	};

	return (
		<>

			<div className="dept-page-container">
				<button onClick={() => navigate(`/settings/organization-department/${orgId}`)} className="close_nav header_close">Close</button>
				<h2 className="dept-page-main-heading">Add New Department</h2>
				<div className="dept-page-content-wrapper">
					<div className="dept-page-left-panel">
						<h3 className="dept-page-mark-text">Fill The Information</h3>
						<p className="dept-page-info-text">You're Just One Step Away From Adding The New Department!</p>
						<div className="dept-page-illustration-box">
							<img
								className="imgBlackedWhite"
								src={bannerImg}
								alt="Illustration"
							/>
						</div>
					</div>

					<div className="dept-page-right-panel">
						<div className="dept-page-cover-section">
							<div className="dept-page-image-placeholder">
								<MdCreditCard color='#333333' size={50} />
							</div>
							<StatusDropdown
								options={departmentStatusOptions
									?.filter((item) => item?.label !== "All")
									?.map((item) => ({
										value: item?.id,
										label: item?.label,
									}))}
								defaultValue={formData?.status}
								onChange={(val) => handleStatus(val)}
							/>
						</div>
						<div
							className={`dept-page-basic-info-section`}>
							<h3>Basic Information</h3>
							<p className="dept-page-subtitle">Basic profile overview</p>
							<div className="dept-page-input-group">
								<div className="dept-page-icon-wrapper">
									<AppWindowMac size={20} strokeWidth={1.5} />
								</div>
								<label className="color_red">
									Department Name *
								</label>
								<input
									ref={department_name_ref}
									type="text"
									name="department_name"
									value={formData?.department_name}
									onChange={handleChange}
								/>
							</div>
							<div className="dept-page-input-group">
								<div className="dept-page-icon-wrapper">
									<Parentheses size={20} strokeWidth={1.5} />
								</div>
								<label>Parent Department</label>
								<SelectDropdown
									selectedValue={formData?.parent_department}
									options={departmentOptions}
									// placeholder="Select Department"
									onSelect={handleSelect}
									searchPlaceholder="Search department"
									handleSearch={handleSearch}
									type="parent_department"
									loading={parentDepData?.loading}
									showSearchBar={true}
								/>
							</div>
							<div className="dept-page-input-group">
								<div className="dept-page-icon-wrapper">
									<UserStar size={20} strokeWidth={1.5} />
								</div>
								<label className="color_red">
									Department Head *
								</label>
								<SelectDropdown
									ref={department_head_ref}
									selectedValue={formData?.department_head}
									options={headOptions}
									// placeholder="Select Department Head"
									onSelect={handleSelect}
									searchPlaceholder="Search head of Department"
									handleSearch={handleSearch}
									type="department_head"
									loading={depHeadData?.loading}
									showSearchBar={true}
								/>
							</div>
						</div>
						<SaveBtn
							handleSubmit={handleSaveOrUpdate}
							loading={createUpdateDepartment?.loading}
							color="#fff"
							viewMode='add'
							btntype='buttom_fix_btn'

						/>
					</div>
				</div>
			</div>
		</>
	);
};


export default AddDepartment;