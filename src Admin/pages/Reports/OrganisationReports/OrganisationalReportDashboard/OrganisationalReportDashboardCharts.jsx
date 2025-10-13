import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Filter } from 'lucide-react';
import DynamicFilter from '../../../../utils/common/DynamicFilter'; // Make sure this path is correct
import SelectDropdown from '../../../../utils/common/SelectDropdown/SelectDropdown';

const OrganisationalReportDashboardCharts = ({
  genderChartData,
  designationSummaryData,
  ageGroupChartData,
  ageGroupLegendData,
  years,
  setDepartmentFilter,
  departmentFilter,
  setSelectedYear, selectedYear
}) => {
  console.log("designationSummaryData", designationSummaryData)
  
  const GENDER_COLORS = { Male: '#4C00BF', Female: '#6BBF16' };
  const AGE_GROUP_COLORS = ['#6B9AE2', '#7538DB', '#7755B0', '#2E0A4F', '#DDA0DD'];

  // States for the new DynamicFilters
  const [yearFilter, setYearFilter] = useState(years[0]);
  const [ageYearFilter, setAgeYearFilter] = useState(years[0]);

  // Helper functions to handle filter changes
  const handleYearFilterChange = (value) => {
    setYearFilter(value);
  };
    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
    };

  const handleAgeYearFilterChange = (value) => {
    setAgeYearFilter(value);
  };

  // Convert years and departments into the required format for DynamicFilter options
  const yearOptions = years.map(year => ({ id: year, label: year, value: year }));


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          {/* <p className="label">March {data.year}</p> */}
          <p className="desc" style={{ color: GENDER_COLORS.Male }}>Male: {data.male}</p>
          <p className="desc" style={{ color: GENDER_COLORS.Female }}>Female: {data.female}</p>
        </div>
      );
    }
    return null;
  };

   const handleSelect = async (name, value) => {
    setSelectedYear((prev)=>({...prev, [name]:value.label}))
   }

  return (
    <>
      {/* Gender Chart */}
      <div className="chart-card gender-chart-card">
        <div className="chart-header">
          <div>
            <h2>GENDER</h2>
            <div className="chart-filters">
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color male"></span> Male
                </div>
                <div className="legend-item">
                  <span className="legend-color female"></span> Female
                </div>
              </div>
            </div>
          </div>
          <div className=" ">
            <SelectDropdown
                    type="gender"
                    selectedValue={selectedYear?.gender}
                    options={years}
                    onSelect={handleSelect}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={genderChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="male" stroke={GENDER_COLORS.Male} strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="female" stroke={GENDER_COLORS.Female} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Designation Summary & Age Group Chart */}
      <div className="dashboard-charts-row-bottom">
        {/* Designation Summary */}
        <div className="chart-card designation-card">
          <div className="chart-header">
            <h2>DESIGNATION SUMMARY</h2>
            <div className="chart-filters">
              <div className="">

                <DynamicFilter
                    filterBy="department"
                    filterValue={departmentFilter}
                    onChange={handleDepartmentFilter}
                />
              </div>
              <div className="">

                {/* <DynamicFilter
                  filterBy="year"
                  options={yearOptions}
                  filterValue={yearFilter}
                  onChange={handleYearFilterChange}
                /> */}

                <SelectDropdown
                  type="designation_summary"
                  selectedValue={selectedYear?.designation_summary}
                  options={years}
                  onSelect={handleSelect}
                        />
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={Math.max(40, designationSummaryData.length * 50)} >
            <BarChart layout="vertical" data={designationSummaryData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#339C3D" barSize={10} radius={[5, 5, 5, 5]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Age Group Chart */}
        <div className="chart-card age-group-card">
          <div className="chart-header">
            <h2>AGE GROUP</h2>
            <div className="">

               <SelectDropdown
                  type="age_group"
                  selectedValue={selectedYear?.age_group}
                  options={years}
                  onSelect={handleSelect}
                />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ageGroupChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
                cornerRadius={6}
              >
                {ageGroupChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={AGE_GROUP_COLORS[index % AGE_GROUP_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
          <div className="age-group-legend">
            {ageGroupChartData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: AGE_GROUP_COLORS[index] }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganisationalReportDashboardCharts;