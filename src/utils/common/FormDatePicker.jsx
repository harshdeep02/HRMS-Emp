import React, { useState } from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';
import './FormDatePicker.scss';

const FormDatePicker = React.forwardRef(
    ({ label, onDateChange, initialDate, type, error = false, required = false, restrict = false, isMonthPicker = false, disableFuture = false, disabled = false, fromDate, toDate // ✅ pass in from_date if available (for to_date validation)
    }, ref
    ) => {

        const format = isMonthPicker ? 'MMMM YYYY' : 'DD-MM-YYYY';
        const parsedDate = initialDate ? dayjs(initialDate, ["DD-MM-YYYY", "YYYY-MM-DD"]) : null;

        const [isOpen, setIsOpen] = useState(false);

        const handleDateChange = (newDate) => {
            if (!newDate) {
                onDateChange(type, "");
                return;
            }
            const formattedDate = dayjs(newDate).format(format);
            onDateChange(type, formattedDate);
        };

        // --- Date range restrictions ---
        let minDate = null;
        let maxDate = null;

        // Range: "to_date" or "end_date" → must be >= from/start
        if ((type === "to_date" || type === "end_date" || type === "expected_date_of_arrival" || type === "next_checkup_date") && fromDate) {
            minDate = dayjs(fromDate, ["DD-MM-YYYY", "YYYY-MM-DD"]);
        }

        // Range: "from_date" or "start_date" → must be <= to/end
        if ((type === "from_date" || type === "start_date" || type === "expected_date_of_departure" || type === "last_checkup_date") && toDate) {
            maxDate = dayjs(toDate, ["DD-MM-YYYY", "YYYY-MM-DD"]);
        }

        // --- Global restrictions ---
        if (restrict) {
            minDate = dayjs();
        }
        if (disableFuture) {
            maxDate = dayjs();
        }



        return (
            <div className="form-group-date form-group grupdate2 ">
                <div className={`dropdown-content date-h popHoloday ${isOpen ? "active" : ""} ${disabled ? "disabled-box" : ""}`}
                    ref={ref} style={{ border: error ? '1px solid red' : '' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box>
                            <DemoItem>
                                <DatePicker
                                    value={parsedDate || null}
                                    onChange={handleDateChange}
                                    disabled={disabled} // ✅ disable input
                                    // maxDate={disableFuture ? dayjs() : null} // ✅ disable future dates
                                    // minDate={restrict ? dayjs() : null}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    views={isMonthPicker ? ['month'] : ['year', 'month', 'day']} // Show only month selection if needed
                                    format={format}
                                    renderInput={(params) => <input {...params} />}
                                    onOpen={() => setIsOpen(true)}
                                    onClose={() => setIsOpen(false)}
                                    // placeholder={label}
                                    slotProps={{
                                        textField: {
                                            placeholder: !parsedDate ? "" : "", // ✅ Placeholder sirf jab date na ho
                                            error: error,
                                            required: required,
                                             sx: {
                                                '& .MuiInputBase-root.Mui-disabled': {
                                                    opacity: 1, // ✅ force opacity 1
                                                },
                                                '& .Mui-disabled': {
                                                    WebkitTextFillColor: '#000 !important', // ✅ text color fix
                                                    color: '#000 !important',
                                                    cursor: 'default', // ✅ cursor normal rakho
                                                },
                                            },
                                        }
                                    }}
                                />
                            </DemoItem>
                        </Box>
                    </LocalizationProvider>
                </div>
                {!disabled &&
                    <div className="date_icon">
                        {/* <Calendar strokeWidth={1.5} /> */}
                    </div>
                }
            </div>
        );
    }
);

export default FormDatePicker;