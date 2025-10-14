import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookPlus, User, Briefcase } from "lucide-react";
import "./DepartmentDetail.scss";
import bannerImg from "../../../../assets/Kanban_board.svg";
import StatusDropdown from "../../../../utils/common/StatusDropdown/StatusDropdown";
import {
	getDepartmentDetails,
	getDepartmentList,
	updateDepartmentStatus,
} from "../../../../Redux/Actions/departmentActions";
import { getEmployeeList } from "../../../../Redux/Actions/employeeActions";
import Loader from "../../../../utils/common/Loader/Loader.jsx";
import EmployeeSummary from "./EmployeeSummary.jsx";
import ProjectSummary from "./ProjectSummary.jsx";
import DepartmentForm from "./DepartmentForm.jsx";
import { departmentStatusOptions } from "../../../../utils/Constant.js";
import ConfirmPopup from "../../../../utils/common/ConfirmPopup.jsx";

const texts = {
	add: {
		header: "Add New Department",
		mark: "Fill The Information",
		info: "You're Just One Step Away From Adding The New Department!",
	},
	edit: {
		header: "Edit Department Details",
		mark: "Edit The Information",
		info: "You're Just One Step Away From Making The Changes In Defined Department!",
	},
	detail: {
		header: "Department Details",
		mark: "Provided Details!",
		info: "Check out your department information!",
	},
};

const DepartmentDetail = () => {

	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch();

	const [viewMode, setViewMode] = useState("detail");
	const [formData, setFormData] = useState({
		department_name: "",
		parent_department: [],
		department_head: "",
		status: 1,
	});

	const departmentDetails = useSelector((state) => state?.departmentDetails);
	const departmentDetail = departmentDetails?.data?.department;
	const departmentLoading = departmentDetails?.loading || false;
	const updateStatus = useSelector((state) => state?.updateDeptStatus);

	const depHeadData = useSelector((state) => state?.employeeList);
	const depHeadList = depHeadData?.data?.result || [];

	const parentDepData = useSelector((state) => state?.departmentList);
	const parentDepLists = parentDepData?.data?.department || [];
	const [activeFormIndex, setActiveFormIndex] = useState(0);

	const navItems = [
		{ name: "Basic Information", icon: BookPlus },
		{ name: "Employee Summary", icon: User },
		{ name: "Projects Summary", icon: Briefcase },
	];
	const [filledForms, setFilledForms] = useState({
		"Basic Information": false,
		"Employee Summary": false,
		"Projects Summary": false,
	});

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
		const sendData = { status: 1 };
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
		if (path.includes("/add-department") || path.includes("/edit-department")) {
			// if (depHeadList?.length === 0) 
			fetchDepHead();
			// if (parentDepLists?.length === 0) 
			fetchParentDep();
		}
	}, [location.pathname]);

	useEffect(() => {
		const path = location.pathname;
		if (path.includes("/add-department")) {
			setViewMode("add");
		} else if (path.includes("/edit-department")) {
			setViewMode("edit");
		} else {
			setViewMode("detail");
		}
	}, [location.pathname, id, dispatch]);

	useEffect(() => {
		if (id && departmentDetail?.id != id) {
			dispatch(getDepartmentDetails({ id }));
		}
	}, [id]);

	useEffect(() => {
		if (id && departmentDetail) {
			setFormData((prev) => ({
				...prev,
				department_name: departmentDetail?.department_name
					? departmentDetail?.department_name
					: "",
				department_head: departmentDetail?.departmentDetail?.id
					? departmentDetail?.department_head?.id
					: "",
				department_head_name: departmentDetail?.department_head ? [departmentDetail?.department_head?.first_name, departmentDetail?.department_head?.last_name]?.filter(Boolean)?.join(" ") : "",
				parent_department: departmentDetail?.parent_department?.id
					? departmentDetail?.parent_department?.id
					: "",
				parent_department_name: departmentDetail?.parent_department ? departmentDetail?.parent_department?.department_name : "",
				status: departmentDetail?.status || 1,
			}));
		}
	}, [departmentDetail]);

	const handleEditClick = () => {
		navigate(`/edit-department/${id}`);
	};

	//update status
	const [showModal, setShowModal] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const handleUpdateStatus = () => {
		const sendData = {
			department_id: id,
			status: selectedStatus,
		};
		dispatch(updateDepartmentStatus(sendData))
			.then((res) => {
				if (res?.success) {
					setShowModal(false);
					dispatch(getDepartmentDetails({ id }));
				}
			})
			.catch((error) => {
				setShowModal(false);
				console.log("error-", error);
			});
	};

	const handleStatus = (val) => {
		if (viewMode === "add") {
			setFormData((prevData) => ({
				...prevData,
				status: val,
			}));
		}
		else {
			setShowModal(true);
			setSelectedStatus(val);
		}
	};

	if (departmentLoading) {
		return (
			<div className="loading-state">
				{" "}
				<Loader />{" "}
			</div>
		);
	}

	return (
		<>
			<ConfirmPopup
				open={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={handleUpdateStatus}
				type="update"
				module="Status"
				loading={updateStatus?.loading}
			/>
			<div className="dept-page-container">
				<button onClick={() => navigate(`${viewMode == 'edit' ? `/department-details/${id}` : '/department-list'}`)} className="close_nav header_close">Close</button>
				<h2 className="dept-page-main-heading">{texts[viewMode].header}</h2>
				<div className="dept-page-content-wrapper">
					{viewMode === "add" && (
						<div className="dept-page-left-panel">
							<h3 className="dept-page-mark-text">{texts[viewMode].mark}</h3>
							<p className="dept-page-info-text">{texts[viewMode].info}</p>
							<div className="dept-page-illustration-box">
								<img
									className=" "
									src={bannerImg}
									alt="Illustration"
								/>
							</div>
						</div>
					)}
					{viewMode !== "add" && (
						<>
							<div className="navbar-container">
								{" "}
								{/* Ek wrapper div add karein */}
								<div className="navbar-items">
									{navItems?.map((item, index) => {
										// Logic to determine if a tab should be clickable
										const isFirstTab = index === 0;
										// ✅ First tab always clickable
										const isClickable = isFirstTab || Boolean(id);
										return (
											<span
												key={index}
												className={`${index === activeFormIndex ? "active" : ""
													} ${filledForms[item.name] ? "filled" : ""} ${!isClickable ? "disabled" : ""
													}`}
												onClick={() => {
													if (isClickable) setActiveFormIndex(index);
												}}>
												<item.icon size={20} strokeWidth={1.5} />{" "}
												{/* Icon render karein */}
												<p>{item?.name}</p> {/* Text render karein */}
											</span>
										);
									})}
								</div>
							</div>
						</>
					)}

					{activeFormIndex == 0 && (
						<div className="dept-page-right-panel">
							<div className="dept-page-cover-section ">
								<div className="dept-page-basic-info-section dept-page-basic-info-section_2">
									<h3>Basic Information</h3>
									<p className="dept-page-subtitle">Basic profile overview</p>
								</div>
								<StatusDropdown
									options={departmentStatusOptions
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

							</div>
							{viewMode === "detail" && (
								<button className="dept-page-edit-btn " onClick={handleEditClick}>
									{/* <PencilLine size={16} /> */}
									Edit
								</button>
							)}

							<DepartmentForm
								viewMode={viewMode}
								formData={formData}
								setFormData={setFormData}
								handleSearch={handleSearch}
							/>
						</div>
					)}
					{/* {viewMode === "detail" && ( */}
						<>
							<div className="dept_page_table">
								{/* Employees Summary Section */}
								{activeFormIndex == 1 && <EmployeeSummary />}
								{/* Projects Summary Section */}
								{activeFormIndex == 2 && <ProjectSummary />}
							</div>
						</>
					{/* )} */}
				</div>
			</div>
		</>
	);
};

export default DepartmentDetail;
