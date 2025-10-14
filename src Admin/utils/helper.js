import { formatDate2 } from "./common/DateTimeFormat.js";
import { isPartiallyInViewport } from "./is_scroll_focus";
import { useSelector } from "react-redux";

export const objectToQueryString = (obj) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const value = obj[p];

      // ✅ Include 0 and false, exclude only null and undefined
      if (value !== null && value !== undefined && String(value).trim().length > 0) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(value)}`);
      }
    }
  }
  return str.length ? `?${str.join("&")}` : "";
};

// Function to get dates for the week in "MM/DD/YYYY" format
// export const getFormattedDate = (date) => {
//     const options = { year: "numeric", month: "2-digit", day: "2-digit" };
//     return date.toLocaleDateString("en-US", options); // Returns date in MM/DD/YYYY format
// };

export const isDateInRange = (dateStr, startDate, endDate) => {
  const date = new Date(dateStr.split("-").reverse().join("-"));
  const start = new Date(startDate.split("-").reverse().join("-"));
  const end = new Date(endDate.split("-").reverse().join("-"));

  return date >= start && date <= end;
};

export const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

// Function to get the date for each day of the current week
export const getDatesForWeek = (startDate) => {
  const dates = [];

  // Find the previous Sunday based on the given startDate
  const firstDayOfWeek = new Date(startDate);
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay()); // Adjust to previous Sunday

  // Generate 7 dates starting from Sunday
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i); // Add days incrementally
    dates.push(date);
  }
  return dates;
};

// Helper function to get the start of the selected week
// function getStartOfWeek(date) {
//     const day = date.getDay(); // Sunday: 0, Monday: 1, etc.
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
//     return new Date(date.setDate(diff));
// }
export function getStartOfWeek(date) {
  const currentDate = new Date(date); // Create a new Date object to avoid modifying the original date
  const day = currentDate.getDay(); // Sunday: 0, Monday: 1, etc.
  const diff = currentDate.getDate() - day + (day === 0 ? +6 : 1); // Adjust when day is Sunday
  return new Date(currentDate.setDate(diff));
}

export const calculateAge = (startDate) => {
  // Destructure the startDate assuming DD-MM-YYYY format
  const [day, month, year] = startDate?.split("-").map(Number);

  const birthDate = new Date(year, month - 1, day); // JavaScript Date uses 0-based months
  const currentDate = new Date(); // Current date using JavaScript Date

  // Calculate the age
  const age = currentDate?.getFullYear() - birthDate?.getFullYear();

  const hasBirthdayOccurred = currentDate?.getMonth() > birthDate?.getMonth() || (currentDate?.getMonth() === birthDate?.getMonth() && currentDate?.getDate() >= birthDate?.getDate());

  const calculatedAge = hasBirthdayOccurred ? age : age - 1;
  return calculatedAge;
};

// export const calculateDaysDifference = (start, end) => {
//   if (!start || !end) return 0;
//   // Convert DD-MM-YYYY format to YYYY-MM-DD for JavaScript's Date object
//   const parseDate = (dateStr) => {
//     const [day, month, year] = dateStr.split("-").map(Number);
//     return new Date(year, month - 1, day); // JavaScript uses 0-based months
//   };
//   const startDate = parseDate(start);
//   const endDate = parseDate(end);
//   // Calculate the difference in time (in milliseconds)
//   const diffTime = Math.abs(endDate - startDate);
//   // Convert milliseconds to days, adding 1 to include both dates
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
// };

export const calculateDuration = (from_date, to_date) => {
  if (!from_date || !to_date) return "";

  // Helper function to parse DD-MM-YYYY to a Date object
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // JavaScript uses 0-based months
  };

  const from = parseDate(from_date);
  const to = parseDate(to_date);

  if (to < from) return "Invalid Date Range";

  // Calculate the difference in time (in milliseconds)
  const diffTime = Math.abs(to - from);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Calculate years, months, and days
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  // Build the duration string
  let durationStr = "";
  if (years > 0) durationStr += `${years} year${years > 1 ? "s" : ""} `;
  if (months > 0) durationStr += `${months} month${months > 1 ? "s" : ""} `;
  if (days > 0) durationStr += `${days} day${days > 1 ? "s" : ""}`;
  return durationStr.trim();
};

const calculateTotalDays = (start, end) => {
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalDays(diffDays + 1); // Add 1 to include both start and end dates
  }
};

export const calculateDays = (fromDate, toDate) => {
  if (!fromDate || !toDate) return "-";

  // Function to handle multiple date formats (yyyy-mm-dd or dd-mm-yyyy)
  const parseDate = (dateStr) => {
    let dateParts = dateStr.split("-");

    // Check if the format is dd-mm-yyyy or yyyy-mm-dd
    if (dateParts[0].length === 4) {
      // yyyy-mm-dd format
      return new Date(dateStr); // Valid Date object
    } else if (dateParts[2].length === 4) {
      // dd-mm-yyyy format
      // Reformat to yyyy-mm-dd for standard Date parsing
      return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    } else {
      // Invalid date format
      return null;
    }
  };

  // Convert strings to Date objects
  const from = parseDate(fromDate);
  const to = parseDate(toDate);

  // Check if either of the dates is invalid
  if (!from || !to) return "-";

  // Calculate the difference in milliseconds
  const diffInMs = to - from;

  // Convert milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // Add 1 day for inclusive counting
  return diffInDays + 1;
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getDateRange = () => {
  const today = new Date();
  const month = today.getMonth(); // 0-based, 0 = January, 11 = December
  const year = today.getFullYear();

  // Set the first date of the current month
  const fromDate = new Date(year, month, 1);
  const formattedFromDate = formatDate2(fromDate);
  const formattedToDate = formatDate2(today); // today's date
  return { formattedFromDate, formattedToDate };
};

// Helper to convert time to 24-hour format
const convertTo24Hour = (time) => {
  const [timePart, modifier] = time.toUpperCase().split(/(AM|PM)/);
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
};

// Calculate difference between two times in minutes
const calculateDifferenceInMinutes = (start, end) => {
  const { hours: startHours, minutes: startMinutes } = convertTo24Hour(start);
  const { hours: endHours, minutes: endMinutes } = convertTo24Hour(end);

  let difference = (endHours - startHours) * 60 + (endMinutes - startMinutes);
  if (difference < 0) {
    difference += 24 * 60; // Handle time crossing midnight
  }
  return difference;
};

// Convert minutes into hours and minutes
const convertMinutesToHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours: hours.toString().padStart(2, "0"), // Always 2-digit
    minutes: minutes.toString().padStart(2, "0"), // Always 2-digit
  };
};

export const calculateActiveTime = (punchInTime, punchOutTime, startTime, endTime) => {
  // console.log({ punchInTime, punchOutTime, startTime, endTime });

  if (!punchInTime) {
    return {
      activeDuration: { hours: '-', minutes: '-' },
      totalDuration: { hours: '-', minutes: '-' },
      remainingDuration: { hours: '-', minutes: '-' },
    };
  }

  // Calculate active duration (always calculated if punchInTime exists)
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes()}`;
  const isValidPunchOutTime = punchOutTime && punchOutTime.trim() !== '-' && punchOutTime.trim() !== '';
  const referenceTime = isValidPunchOutTime ? punchOutTime : currentTime;
  const activeMinutes = calculateDifferenceInMinutes(punchInTime, referenceTime);

  // Handle totalDuration and remainingDuration only if startTime and endTime exist
  if (!startTime || !endTime) {
    return {
      activeDuration: convertMinutesToHoursAndMinutes(activeMinutes), // { hours, minutes }
      totalDuration: { hours: '-', minutes: '-' }, // { hours, minutes }
      remainingDuration: { hours: '-', minutes: '-' }, // { hours, minutes }
    };
  }

  // Total duration between startTime and endTime
  const totalMinutes = calculateDifferenceInMinutes(startTime, endTime);

  // Remaining time
  const remainingMinutes = Math.max(totalMinutes - activeMinutes, 0);

  return {
    activeDuration: convertMinutesToHoursAndMinutes(activeMinutes), // { hours, minutes }
    totalDuration: convertMinutesToHoursAndMinutes(totalMinutes), // { hours, minutes }
    remainingDuration: convertMinutesToHoursAndMinutes(remainingMinutes), // { hours, minutes }
  };
};

export const handleFormError = (ref) => {
  if (!isPartiallyInViewport(ref.current)) {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  setTimeout(() => {
    ref.current.focus();
  }, 500);
  return true;
};

export const showMasterData = (type) => {
  const masterData = useSelector((state) => state?.masterData?.data);  
  const filteredData = masterData?.filter((item) => item?.type == type);
  const options = filteredData?.map((item) => ({
    id: item?.labelid,
    label: item?.label,
  })) || [];
  return options;
};

export const showMastersValue = (masterData, type, id) => {
  const allMasters = masterData?.filter(item => item?.type == type);
  const label = allMasters?.find(unit => unit?.labelid == id);
  return label ? label?.label : "";
};


const STORAGE_KEY = "dropdownSearchParams";

// Get full object
export const getAllSearchParams = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
};

// Get params for specific type
export const getSearchParams = (type) => {
  const allParams = getAllSearchParams();
  return allParams[type] || null;
};

// Save params for specific type
export const setSearchParams = (type, params) => {
  const allParams = getAllSearchParams();
  allParams[type] = params;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allParams));
};

// Clear params for specific type
export const clearSearchParams = (type) => {
  const allParams = getAllSearchParams();
  delete allParams[type];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allParams));
};

export const mergeAttendanceAndHolidays = (attendanceData = [], holidayData = []) => {
    const holidayMap = holidayData.reduce((acc, h) => {
    const d = new Date(h.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    acc[key] = h.name; // holiday name
    return acc;
  }, {});

  console.log(holidayMap)
  const mergedData = attendanceData.map(entry => {
    if (holidayMap[entry.date]) {
      return {
        ...entry,
        status: "4", // Holiday status code
        holiday_name: holidayMap[entry.date]
      };
    }
    return entry;
  });
 console.log('mergedData', mergedData)
  return mergedData
}


export function getOrgData() {
    const orgData = localStorage.getItem("loggedInORG");
    return orgData ? JSON.parse(orgData) : null;
}