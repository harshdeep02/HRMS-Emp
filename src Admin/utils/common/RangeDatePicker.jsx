import React, { useState } from "react";
import {
  TextField,
  Popover,
  Box,
  Button,
  Stack
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./FormDatePicker.scss";

const RangeDatePicker = ({
  label = "Select Date Range",
  onChange,
  disableFuture = false,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    if (!disabled) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    handleClose();
    onChange?.({
      fromDate: fromDate ? dayjs(fromDate).format("DD-MM-YYYY") : "",
      toDate: toDate ? dayjs(toDate).format("DD-MM-YYYY") : "",
    });
  };

  console.log(fromDate, toDate)

  const formattedRange =
    fromDate && toDate
      ? `${dayjs(fromDate).format("DD MMM YYYY")} → ${dayjs(toDate).format("DD MMM YYYY")}`
      : "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <TextField
        //   label={label}
          value={formattedRange}
          onClick={handleOpen}
          fullWidth
          placeholder="Select date range"
          disabled={disabled}
          InputProps={{ readOnly: true }}
        />

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                disableFuture={disableFuture}
                maxDate={toDate || undefined}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                disableFuture={disableFuture}
                minDate={fromDate || undefined}
              />
            </Stack>
            <Box textAlign="right" mt={2}>
              <Button
                variant="contained"
                size="small"
                onClick={handleApply}
                disabled={!fromDate || !toDate}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </LocalizationProvider>
  );
};

export default RangeDatePicker;
