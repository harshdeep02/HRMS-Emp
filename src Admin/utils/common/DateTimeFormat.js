//show date in ( dd/month name/yy) format
export const formatDate = (date) => {
  if (!date) return ""; // Handle undefined or null date

  let parsedDate;

  if (typeof date === "string") {
    if (date.includes("-") && date.includes("T")) {
      // ISO format (e.g., "2024-12-02T08:41:32.000000Z")
      parsedDate = new Date(date);
    } else if (date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // "DD-MM-YYYY" format
      const [day, month, year] = date.split("-");
      parsedDate = new Date(`${year}-${month}-${day}`);
    } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // "YYYY-MM-DD" format (e.g., "2025-03-24")
      parsedDate = new Date(date);
    } else {
      return ""; // Invalid date string
    }
  } else {
    // If date is already a Date object or valid for `new Date`
    parsedDate = new Date(date);
  }
  // Format the parsed date
  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

//show date in yy/mm/dd
export const formatDate2 = (date) => {
  if (!date) return "";

  // Handle DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  }

  // Otherwise try normal Date parsing
  const d = new Date(date);
  if (isNaN(d)) return ""; // invalid date
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDate3 = (dateString) => {
  const date = new Date(dateString); // "YYYY-MM-DD" format expected
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() zero-based hota hai
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Utility to get the current month
export const getCurrentMonth = () => {
  const today = new Date();
  return { month: today.getMonth() + 1 }; // Months are 0-based
};

export const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight
  return today;
};

export const formatTime = (time) => {
  const [hour, minute] = time?.split(":");
  const hour12 = hour % 12 || 12; // Convert to 12-hour format
  const ampm = hour < 12 ? "AM" : "PM"; // Determine AM/PM
  return `${hour12}:${minute} ${ampm}`; // Return formatted time
};

//day
export const formatDay = (date) => {
  return new Date(date).toLocaleDateString("en-GB", { weekday: "long" });
};


//overtimeCalculate
export const calculateOvertime = (totalHoursWorked) => {
  // Check if the input is a valid string
  if (typeof totalHoursWorked !== 'string' || !totalHoursWorked.trim()) {
    return "Invalid data"; // Return a default message if input is not a valid string
  }

  // Regex to match the hours and minutes from the string
  const match = totalHoursWorked.match(/(\d+)\s*Hrs\s*and\s*(\d+)\s*min/);

  // If the string doesn't match the expected format, return an error message
  if (!match) {
    return "Invalid data"; // Return a default message if input format is incorrect
  }

  const hoursWorked = parseInt(match[1], 10); // Extract hours as a number
  const minutesWorked = parseInt(match[2], 10); // Extract minutes as a number

  const standardHours = 8; // Standard workday in hours
  const totalMinutesWorked = (hoursWorked * 60) + minutesWorked; // Convert total hours and minutes worked to minutes
  const overtimeMinutes = totalMinutesWorked - (standardHours * 60); // Subtract 8 hours in minutes

  // If no overtime, return "0 hrs 0 min"
  if (overtimeMinutes <= 0) {
    return "0 hrs 0 min";
  }

  // Calculate overtime hours and minutes
  const overtimeHours = Math.floor(overtimeMinutes / 60);
  const overtimeRemainingMinutes = overtimeMinutes % 60;

  // Return the overtime in the format "X hrs Y min"
  return `${overtimeHours} hrs ${overtimeRemainingMinutes} min`;
};
