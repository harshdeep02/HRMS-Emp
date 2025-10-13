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
import DepartmentForm from "./DepartmentForm.jsx";
import { departmentStatusOptions } from "../../../../utils/Constant.js";
import ConfirmPopup from "../../../../utils/common/ConfirmPopup.jsx";

const texts = {
	detail: {
		header: "Department Details",
		mark: "Provided Details!",
		info: "Check out your department information!",
	},
};

const DepartmentDetail = () => {

	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		department_name: "",
		parent_department: [],
		department_head: "",
		status: 1,
	});

	const departmentDetails = useSelector((state) => state?.departmentDetails);
	const departmentDetail = departmentDetails?.data?.department;
	const departmentLoading = departmentDetails?.loading || false;

	const [activeFormIndex, setActiveFormIndex] = useState(0);

	const navItems = [
		{ name: "Basic Information", icon: BookPlus },
		{ name: "Employee Summary", icon: User },
	];

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
				department_head: departmentDetail?.department_head?.id
					? departmentDetail?.department_head?.id
					: "",
				parent_department: departmentDetail?.parent_department?.id
					? departmentDetail?.parent_department?.id
					: "",
				status: departmentDetail?.status || 1,
			}));
		}
	}, [departmentDetail]);


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
			<div className="dept-page-container">
				<button onClick={() => navigate(`/department-list`)} className="close_nav header_close">Close</button>
				<h2 className="dept-page-main-heading">{texts?.detail?.header}</h2>
				<div className="dept-page-content-wrapper">
						<>
							<div className="navbar-container">
								{" "}
								{/* Ek wrapper div add karein */}
								<div className="navbar-items">
									{navItems?.map((item, index) => {
										return (
											<span
												key={index}
												className={`${index === activeFormIndex ? "active" : ""
													}`}
												onClick={() => {setActiveFormIndex(index)}}>
												<item.icon size={20} strokeWidth={1.5} />{" "}
												{/* Icon render karein */}
												<p>{item?.name}</p> {/* Text render karein */}
											</span>
										);
									})}
								</div>
							</div>
						</>

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
									disabled={true}
								/>

							</div>

							<DepartmentForm
								formData={formData}
							/>
						</div>
					)}
						<>
							<div className="dept_page_table">
								{activeFormIndex == 1 && <EmployeeSummary />}
							</div>
						</>
				</div>
			</div>
		</>
	);
};

export default DepartmentDetail;
