import React from 'react';
import './Date.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Date Modal Component
const Date = ({ isOpen, onClose, startDate, endDate, setStartDate, setEndDate, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Select Date Range</h2>
        <div className="date-picker-container">
          <label>
            Start Date:
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select month and year"
              showYearDropdown
              scrollableYearDropdown
            />
          </label>
          <label>
            End Date:
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select month and year"
              showYearDropdown
              scrollableYearDropdown
            />
          </label>
        </div>
        <button onClick={onApply}>Apply</button>
      </div>
    </div>
  );
};

export default Date;