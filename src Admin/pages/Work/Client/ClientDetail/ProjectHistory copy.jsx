import React, { useState, useEffect, useRef } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import SortFilter from '../../../../utils/common/SortFilter.jsx';
import { CheckCircle2, Clock4, PauseCircle, CalendarClock, PlayCircle } from "lucide-react";
import DynamicLoader from '../../../../utils/common/DynamicLoader/DynamicLoader.jsx';

const INITIAL_VISIBLE_COUNT = 5;

const DUMMY_PROJECT_HISTORY = [
    { id: 'proj1', name: 'GPS Tracker', assigned_to: 'Swaroop Jadhav', start_date: '17 Jul 2025', end_date: '20 Jul 2025', status: 'Completed' },
    { id: 'proj2', name: 'Payment Gateway', assigned_to: 'Priya Sharma', start_date: '01 Aug 2025', end_date: '15 Aug 2025', status: 'Pending' },
    { id: 'proj3', name: 'User Redesign', assigned_to: 'Liam O\'Connell', start_date: '22 Jul 2025', end_date: '05 Sep 2025', status: 'On Hold' },
    { id: 'proj4', name: 'API Documentation', assigned_to: 'Aisha Al-Farsi', start_date: '10 Sep 2025', end_date: '30 Sep 2025', status: 'Scheduled' },
    { id: 'proj5', name: 'User Interface Design', assigned_to: 'Liam Chen', start_date: '15 Sep 2025', end_date: '05 Oct 2025', status: 'In Progress' },
    { id: 'proj6', name: 'Marketing Strategy', assigned_to: 'Maria Gonzalez', start_date: '20 Sep 2025', end_date: '15 Oct 2025', status: 'Pending' },
    { id: 'proj7', name: 'Frontend Development', assigned_to: 'Jamal Patel', start_date: '25 Sep 2025', end_date: '10 Oct 2025', status: 'Completed' },
    { id: 'proj8', name: 'Data Analysis', assigned_to: 'Sofia Kim', start_date: '30 Sep 2025', end_date: '20 Oct 2025', status: 'Scheduled' },
    { id: 'proj9', name: 'Backend Refactor', assigned_to: 'Priya Sharma', start_date: '01 Nov 2025', end_date: '30 Nov 2025', status: 'Scheduled' },
];

const ProjectHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [filteredHistory, setFilteredHistory] = useState(DUMMY_PROJECT_HISTORY);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchBoxRef = useRef();
    const ProjectLoading = false
    const [view, setView] = useState('list');

    const projectStatusConfig = {
        Completed: { label: 'Completed', icon: CheckCircle2, className: 'completed' },
        Pending: { label: 'Pending', icon: Clock4, className: 'pending' },
        'On Hold': { label: 'On Hold', icon: PauseCircle, className: 'on-hold' },
        Scheduled: { label: 'Scheduled', icon: CalendarClock, className: 'scheduled' },
        'In Progress': { label: 'In Progress', icon: PlayCircle, className: 'in-progress' },
    };

    const statusOptions = [
        { label: 'All', value: 'All' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'On Hold', value: 'On Hold' },
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'In Progress', value: 'In Progress' },
    ];

    useEffect(() => {
        let filtered = DUMMY_PROJECT_HISTORY.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter !== 'All') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredHistory(filtered);
    }, [searchTerm, statusFilter]);

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            if (visibleCount >= filteredHistory.length) {
                setVisibleCount(INITIAL_VISIBLE_COUNT); // reset when all shown
            } else {
                setVisibleCount(prev => prev + 5);
            }
            setIsLoadingMore(false);
        }, 500);
    };

    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (ProjectLoading && !isLoadingMore) ? dummData : filteredHistory;

    return (
        <>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Client Project History</h2>
                    <div className="toolbar_d">
                        <SearchBox onSearch={handleSearch} placeholder="Search Project..." ref={searchBoxRef} />
                        <div className="toolbar-actions">
                            <div className="border_box">
                                <SortFilter
                                    sortBy={statusFilter}
                                    onChange={handleStatusFilter}
                                    options={statusOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <table className="detail-table emp-t-6 project-history-table empProject">
                    <thead>
                        <th>Project Name</th>
                        <th>Assigned To</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th className='status-badge'>Status</th>
                    </thead>
                    {(ProjectLoading || filteredHistory?.length > 0) ? (

                        <tbody className={`${ProjectLoading && !isLoadingMore ? 'LoadingList' : ''}`}>
                            {ListData.slice(0, visibleCount).map(item => {
                                const StatusIcon = projectStatusConfig[item.status]?.icon;
                                const statusClassName = projectStatusConfig[item.status]?.className || '';
                                return (
                                    <tr key={item.id} className="detail_tr_row employee-row">
                                        <td className='loadingtd'>{item.name}</td>
                                        <td className='loadingtd'>{item.assigned_to}</td>
                                        <td className='loadingtd'>{item.start_date}</td>
                                        <td className='loadingtd'>{item.end_date}</td>
                                        <td className='loadingtd'>
                                            <div className={`status-badge status-badge_2 ${statusClassName}`}>
                                                {StatusIcon && <StatusIcon size={16} />}
                                                <span>{projectStatusConfig[item.status]?.label}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (

                        <tbody className="table_not_found">
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '150px' }}>
                                    {(!ProjectLoading && filteredHistory?.length === 0) && (
                                        <ListDataNotFound module="Project History" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>


            </div>
            {(!ProjectLoading || isLoadingMore) &&

                <div className="load-more-container">
                    {filteredHistory.length > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {isLoadingMore
                                ? <LoadingDots color="#8a3ffc" size={6} />
                                : visibleCount >= filteredHistory.length ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>
            }
        </>
    );
};

export default ProjectHistory;