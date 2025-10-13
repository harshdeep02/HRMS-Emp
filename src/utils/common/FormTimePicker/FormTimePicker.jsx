import React, { useState, useEffect } from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Clock } from 'lucide-react';
dayjs.extend(customParseFormat);
import './FormTimePicker.scss';

const FormTimePicker = React.forwardRef(
    ({ label, onTimeChange, initialTime, type, lableShow = false, small, ampm = true, showOnlyMinutes = false, error = false, required = false, disabled = false }, ref) => {

        const [parsedTime, setParsedTime] = useState(null);
        const format = ampm ? 'hh:mm A' : 'HH:mm';

        // Effect to correctly parse the initial time based on the mode
        useEffect(() => {
            if (initialTime) {
                if (showOnlyMinutes) {
                    // For minutes-only, create a dayjs object from the minute value
                    const minuteValue = parseInt(initialTime, 10) || 0;
                    setParsedTime(dayjs().hour(0).minute(minuteValue));
                } else {
                    // For full time, parse using the specified format
                    setParsedTime(dayjs(initialTime, format, true));
                }
            } else {
                setParsedTime(null);
            }
        }, [initialTime, showOnlyMinutes, format]);

        const [isOpen, setIsOpen] = useState(false);

        const handleTimeChange = (newTime) => {
            if (!newTime || !newTime.isValid()) return;

            let formattedValue;
            if (showOnlyMinutes) {
                // If we only need minutes, extract it and send it as a string
                formattedValue = String(newTime.minute());
            } else {
                // Otherwise, format the full time
                formattedValue = newTime.format(format);
            }
            onTimeChange(type, formattedValue);
        };

        const getDisplayValue = () => {
            if (!parsedTime || !parsedTime.isValid()) return '';
            if (showOnlyMinutes) {
                return `${parsedTime.minute()} Mins`;
            }
            return parsedTime.format(format);
        };

        return (
            <div className={`form-group-date form-group grupdate2 ${lableShow ? 'lableShow' :''}`}>
                <label className={`lableShow ${required ? 'redCol' : ''} ${small ? 'small_label' : ''} `}>
                    {!small &&
                        <>
                            {lableShow &&
                                <Clock size={20} strokeWidth={1.25} />
                            }
                        </>
                    }
                    {lableShow &&
                        <div className="date_labelText">{label}{required && <b className="color_red">*</b>}</div>
                    }

                </label>
                <div className={`dropdown-content date-h popHoloday ${isOpen ? "active" : ""} ${disabled ? "disabled-box" : ""}`}
                    ref={ref} style={{ border: error ? '1px solid red' : '' }}>
                    {/* <div className="date_tittle">
                        <div className="title__show__d">
                            {getDisplayValue()}
                        </div>
                    </div> */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box>
                            <DemoItem>
                                <TimePicker
                                    value={parsedTime}
                                    onChange={handleTimeChange}
                                    disabled={disabled}
                                    ampm={ampm}
                                    views={showOnlyMinutes ? ['minutes'] : ['hours', 'minutes']}
                                    openTo={showOnlyMinutes ? 'minutes' : 'hours'}
                                    format={format}
                                    renderInput={(params) => <input {...params} />}
                                    onOpen={() => setIsOpen(true)}
                                    onClose={() => setIsOpen(false)}
                                    slotProps={{
                                        textField: {
                                            placeholder: !parsedTime ? '' : "", // ✅ Placeholder sirf jab date na ho
                                            error: error,
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
                        {/*     <Clock strokeWidth={1.5} /> */}
                    </div>
                }
            </div>
        );
    }
);

export default FormTimePicker;