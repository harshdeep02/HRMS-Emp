import { useState, useEffect, useRef, useCallback } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { showMasterData, showMastersValue } from '../../../utils/helper.js';
import { useDispatch, useSelector } from 'react-redux';
import { getRemarkList } from '../../../Redux/Actions/employeeActions.js';
import './remarks.scss';
import ListDataNotFound from '../../../utils/common/ListDataNotFound.jsx';
import { formatDate } from '../../../utils/common/DateTimeFormat.js';
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from '../../../utils/common/DynamicFilter.jsx';
import { getUserData } from '../../../services/login.js';
import LoadingDots from '../../../utils/common/LoadingDots/LoadingDots.jsx';


const INITIAL_VISIBLE_COUNT = 6

const RemarksForm = () => {

  const dispatch = useDispatch();
  const {id} = getUserData()
 
  const remarkData = useSelector((state) => state?.remarkList);
  const remarkList = remarkData?.data?.remarks || [];
  const remarkLoading = remarkData?.loading || false;
  const totalRemark = remarkData?.data?.count || false;

const remarks_type_options = showMasterData("11");



  const searchBoxRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [showMoreLess, setShowMoreLess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
    const [remarkFilter, setRemarkFilter] = useState("All");

  

    const fetchRemarkList = useCallback(async () => {
        try {
            const sendData = {
              user_id:id,
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(searchTerm && { search: searchTerm }),
                ...(remarkFilter && remarkFilter !== "All" && { remark_type: remarkFilter }),

            };
            const res = await dispatch(getRemarkList(sendData));

        } catch (error) {
            console.error("Error fetching remark list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [searchTerm, visibleCount, remarkFilter]);

    useEffect(() => {
            fetchRemarkList();
        }, [searchTerm, visibleCount, remarkFilter]);



  const masterData = useSelector(state => state?.masterData?.data);


    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleRemarkTypeFilter = (newFilter) => {
    setRemarkFilter(newFilter);
    setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const resetFilters = () => {
      setSearchTerm("");
      setRemarkFilter('All')
      setShowMoreLess(false);
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      if (searchBoxRef.current) {
          searchBoxRef.current.clearInput();
      }
  };

      const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

  const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({
    }));

    // ❗ 2 new loding
    const ListData = (remarkLoading && !showMoreLess) ? dummData : remarkList;

    console.log(remarks_type_options)

  return (
    <div
      id="Remarks_form_container"
    >

        <>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    {/* Updated Title */}
                    <h2>Remarks</h2>
                    <div className="toolbar_d">
                        {/* Updated Search Placeholder */}
                        <SearchBox onSearch={handleSearch} placeholder="Search Remarks Type..." ref={searchBoxRef} />

                        <div className="toolbar-actions">
                            <div className="border_box">
                                <DynamicFilter
                                    filterBy="remark_type"
                                    filterValue={remarkFilter}
                                    onChange={handleRemarkTypeFilter}
                                    options={remarks_type_options?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                    })) || []}
                                />
                            </div>
                            <div className="border_box">
                            </div>
                        </div>
                    </div>
                </div>
                <table className="detail-table emp-t-5 project-table">
                    <thead>
                        <tr>
                            {/* Updated Table Headers */}
                            <th>Remark Type</th>
                            <th>Issued Date</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    {(remarkLoading || remarkList?.length > 0) ? (
                        <tbody className={`${remarkLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                            {ListData?.map((item) => {
                                return (
                                    <tr key={item?.id} className="employee-row detail_tr_row">
                                        {/* Updated Table Data */}
                                        <td><div className="subject-link loadingtd Semi_Bold purplle">{showMastersValue(masterData, "11", item?.remark_type)}</div></td>
                                        <td><div className="text-secondary loadingtd">{formatDate(item?.issued_date)}</div></td>
                                        <td><div className={`priority-badge loadingtd priority-`}>{item?.description}</div></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody className="table_not_found">
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '160px' }}>
                                     {(!remarkLoading && remarkList?.length === 0) && (
                                    <ListDataNotFound module="Remarks" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
            {(!remarkLoading || showMoreLess) &&
                <div className="load-more-container" style={{ marginTop: '-1px' }}>
                    {visibleCount < totalRemark && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(ticketListLoading || showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {visibleCount >= totalRemark && totalRemark > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {(ticketListLoading || showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                        </button>
                    )}
                </div>
            }
        </>
    </div>
  );
};

export default RemarksForm;
