import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bannerImg from "../../../assets/detail_man.png";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import { UserProfileImageUpload } from "../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import "./ApplicantDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import { getJobList } from "../../../Redux/Actions/jobActions.js";
import { getApplicantDetails, updateApplicantStatus } from "../../../Redux/Actions/applicantActions.js";
import { applicantStatusOptions } from "../../../utils/Constant.js";
import { getCityList, getStateList } from "../../../Redux/Actions/locationActions.js";
import ApplicantForm from "./ApplicantForm.jsx";
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";

const ApplicantDetails = () => {

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	//Data from redux
	const applicantDetails = useSelector((state) => state?.applicantDetails);
	const applicantDetail = applicantDetails?.data?.result;
	const applicantDetailLoading = applicantDetails?.loading || false;
	const updateStatus = useSelector((state) => state?.updateApplicantStatus);

	const jobData = useSelector((state) => state?.jobList);
	const jobList = jobData?.data?.job_opening || [];

	const [viewMode, setViewMode] = useState("detail");
	const [formData, setFormData] = useState({
		user_image: "",
		first_name: "",
		last_name: "",
		email: "",
		mobile_no: "",
		job_opening_id: "",
		resume: "",
		other_document: "",
		country_id: "",
		state_id: "",
		city_id: "",
		pin_code: "",
		source: "",
		availability_date: null,
		expected_salary: "",
		// referred_by: "",
		status: 1,
		description: ""
	});

	// Fetch data based on current state
	const fetchJobs = (search = "") => {
		const sendData = {status: 2};
		if (search) {
			sendData["search"] = search;
		}
		dispatch(getJobList(sendData));
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

	const handleSearch = (query, type) => {
		if (type === "job_opening_id") fetchJobs(query);
	};

	useEffect(() => {
		const path = location.pathname;
		if (path.includes('/add-applicant') || path.includes('/edit-applicant')) {
			// if (jobList?.length === 0) 
			fetchJobs();
		}
	}, [location.pathname]);

	useEffect(() => {
		const path = location.pathname;
		if (path.includes("/add-applicant")) {
			setViewMode("add");
		} else if (id) {
			setViewMode(path.includes("/edit-applicant") ? "edit" : "detail");
		}
	}, [location.pathname, id]);

	useEffect(() => {
		if (id && applicantDetail?.id != id) {
			dispatch(getApplicantDetails({ id }));
		}
	}, [id]);

	useEffect(() => {
		if (id && applicantDetail) {
			setFormData((prev) => ({
				...prev,
				user_image: applicantDetail?.user_image ? JSON.parse(applicantDetail?.user_image) : "",
				first_name: applicantDetail?.first_name || "",
				last_name: applicantDetail?.last_name || "",
				email: applicantDetail?.email || "",
				mobile_no: applicantDetail?.mobile_no || "",
				job_opening_id: applicantDetail?.job_opening_id || "",
				job_title: applicantDetail?.job_opening?.job_title || "",
				resume: applicantDetail?.resume ? JSON.parse(applicantDetail?.resume) : "",
				other_document: applicantDetail?.other_document ? JSON.parse(applicantDetail?.other_document) : "",
				country_id: applicantDetail?.country_id || "",
				state_id: applicantDetail?.state_id || "",
				city_id: applicantDetail?.city_id || "",
				pin_code: applicantDetail?.pin_code || "",
				source: applicantDetail?.source || "",
				availability_date: applicantDetail?.availability_date || "",
				expected_salary: applicantDetail?.expected_salary || "",
				status: applicantDetail?.status ? applicantDetail?.status : 1,
				description: applicantDetail?.description || ""
			}));
			if (applicantDetail?.state_id) fetchCity("", applicantDetail?.state_id);
			if (applicantDetail?.country_id) fetchState("", applicantDetail?.country_id);
		}
	}, [applicantDetail]);

	const handleEditClick = () => navigate(`/edit-applicant/${id}`);
	const [showModal, setShowModal] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");

	const handleUpdateStatus = () => {
		const sendData = {
			id: id,   // applicant ke liye job_id nahi applicant_id bhejna hai
			status: selectedStatus,
		};
		dispatch(updateApplicantStatus(sendData))
			.then((res) => {
				if (res?.success) {
					setShowModal(false);
					dispatch(getApplicantDetails({ id }));
					setFormData((prevData) => ({
						...prevData,
						status: selectedStatus,
					}));
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

	const isDetailView = viewMode === "detail";

	const renderHeader = () =>
		viewMode === "add"
			? "Add New Applicant Details"
			: viewMode === "edit"
				? "Edit Applicant Details"
				: "Applicant Details";
	const renderMark = () =>
		viewMode === "add" ? "Fill The Information" : "Provided Details!";
	const renderHeaderInfo = () =>
		viewMode === "add"
			? "You're just one step away from adding the new applicant!"
			: viewMode === "edit" ?
				"Here’s the information about the applicant details you’ve filled."
				:
				"Here’s the information about the applicant you’ve filled.";

	if (applicantDetailLoading)
		return (
			<div className="loading-state">
				<Loader />
			</div>
		);

	return (
		<div className="applicantDetailMain ">
			<ConfirmPopup
				open={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={handleUpdateStatus}
				type="update"
				module="Status"
				loading={updateStatus?.loading}
			/>

			<div className="dept-page-container">
				<button onClick={() => navigate(`${viewMode == 'edit' ? `/applicant-details/${id}` : '/applicant-list'}`)} className="close_nav header_close">Close</button>
				<h2 className="dept-page-main-heading">{renderHeader()}</h2>
				<div className="dept-page-content-wrapper">
					<div className="dept-page-left-panel">
						<h3 className="dept-page-mark-text">{renderMark()}</h3>
						<p className="dept-page-info-text">{renderHeaderInfo()}</p>
						<div className="dept-page-illustration-box">
							<img
								className="imgBlackedWhite"
								src={bannerImg}
								alt="Illustration"
							/>
						</div>
					</div>
					<div className="dept-page-right-panel">
						<div className="dept-page-cover-section dept-page-cover-section_2">
							<div className="profile_pic_head">
								<UserProfileImageUpload
									formData={formData}
									setFormData={setFormData}
									fieldName="user_image"
									isEditMode={!isDetailView}
								/>
							</div>
							<StatusDropdown
								options={applicantStatusOptions
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

						{isDetailView && (
							<button className="dept-page-edit-btn" onClick={handleEditClick}>
								Edit
							</button>
						)}

						<ApplicantForm
							viewMode={viewMode}
							formData={formData}
							setFormData={setFormData}
							handleSearch={handleSearch}
							handleState={fetchState}
							handleCity={fetchCity}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ApplicantDetails;
