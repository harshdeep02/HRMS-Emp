import { useCallback, useEffect, useRef, useState } from 'react'
import './MasterList.scss'
import { Edit, Pencil, Plus, Search, TrendingUp, UserPlus } from 'lucide-react'
import { AddMasterValuePopup } from './AddMasterValuePopup';
import { AddNewMasterPopup } from './AddNewMasterPopup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMasterList } from '../../Redux/Actions/Settings/masterActions';
import SearchBox from '../../utils/common/SearchBox';
import Tooltips from '../../utils/common/Tooltip/Tooltips';
import ListDataNotFound from '../../utils/common/ListDataNotFound';

export const MasterList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Data from redux 
  const masterData = useSelector((state) => state?.masterData);
  const masterList = masterData?.data || [];
  // console.log("masterList", masterList);
  const masterLoading = masterData?.loading || false;

  const mains = masterList?.filter(item => item?.type === 0);
  const groupedMasters = mains?.map((main, index) => {
    const options = masterList?.filter(item => item?.type === main?.labelid);
    return { ...main, options };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showMoreLess, setShowMoreLess] = useState(false);
  const [masterValue, setMasterValue] = useState('')
  const searchBoxRef = useRef();

  const fetchMasterList = useCallback(async () => {
    try {
      const fy = localStorage.getItem("FinancialYear");
      const sendData = {
        // fy,
        // noofrec: visibleCount,
        // currentpage: currentPage,
        ...(searchTerm && { search: searchTerm }),
        sort_by: "recent"
      };
      const res = await dispatch(getMasterList(sendData));
      setShowMoreLess(false);
    } catch (error) {
      console.error("Error fetching master list:", error);
      setShowMoreLess(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMasterList();
  }, [searchTerm]);

  // const mainMasters = masterList?.filter(item => item?.type === 0) // pick main items
  //   ?.map(mainItem => ({
  //     ...mainItem,
  //     children: masterList?.filter(
  //       child => child?.labelid === mainItem?.labelid && child?.type !== 0
  //     ),
  //   }));  

  const [showMasterPopUp, setShowMasterPopUp] = useState(false)
  const [showAddNewMasterPopUp, setAddNewShowMasterPopUp] = useState(false)

  const handleSearch = (query) => {
    setSearchTerm(query);
  };
  const dummData = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    name: "",
    email: "",
    mobile_no: " ",
    department: "",
    status: " "
  }));

  // ❗ 2 new loding
  const ListData = (masterLoading && (!showMoreLess || masterList?.length === 0)) ? dummData : groupedMasters;

  return (
    <>
      {/* <div className="masterSection">
        <div className="masterHeaderMain">
          <div className="masterHeaderLeft">
            <div className="masterHeaderupper">
              <div className="masterText1">All Master's List
                <div className="total-count"> <TrendingUp size={16} className="TrendingUp" />{groupedMasters?.length}</div>
              </div>
            </div>
            <div className="masterHeaderBottom">
              <div className="masterText2">See All Masters Details Below</div>
            </div>
          </div>

          <div className="masterHeaderRight">
            <div className="headerRight1">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search Master..."
                className="search_setting"
                value={searchTerm}
                // onChange={handleSearchChange}
              />
            </div>
            <div className="headerRight2">
              <div className="masterAddBtn" onClick={() => setAddNewShowMasterPopUp(true)}><UserPlus size={16} /> </div>
            </div>
          </div>
        </div>

        <div className="masterBodyMain">
          <div className="masterTableSection">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedMasters?.map((data, i) => (
                  <tr key={i}>
                    <td onClick={() => navigate('/settings/edit-master-list/12')}>{data?.label}</td>
                    <td onClick={() => navigate('/settings/edit-master-list/12')}>
                      <div className="masterTableFlex">
                        {data?.options?.map((value, i) => (
                          <div key={i} className="masterValueCard">{value?.label}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="masterTableFlex">
                        <div className="MasterActionBtn masterValueAdd" onClick={() => setShowMasterPopUp(true)}><Plus /></div>
                        <div className="MasterActionBtn masterValueEdit" onClick={() => navigate('/settings/edit-master-list/12')}><Pencil /></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div> */}

      <div className="masterSection">
        <div className="employee-dashboard-list depatmentListMain">
          <div className="dashboard-sticky-header">
            <header className="top-header">
              <div className="header-left">
                <div>
                  <h1>All Master's List
                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                      {groupedMasters?.length}</span>
                  </h1>
                  <p>See All Masters Details Below</p>
                </div>
              </div>
              <div className="header-right">
                <div className="toolbar">
                  <SearchBox
                    onSearch={handleSearch}
                    placeholder="Search Master..."
                    ref={searchBoxRef}
                  />
                </div>
                <Tooltips title='Add New Department' placement="top" arrow={true}>
                  <button className="add-employee-btn" onClick={() => setAddNewShowMasterPopUp(true)}><UserPlus size={16} /> </button>
                </Tooltips>
              </div>
            </header>
          </div>

          <>
            <div className="employee-table-wrapper masterBodyMain masterTableSection">
              <table className="employee-table  emp-t-4">
                <thead>
                  <tr className='masterTableSectionTR'>
                    <th>Field</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {(masterLoading || masterList?.length > 0) ? (
                  <tbody className={`${masterLoading ? 'LoadingList' : ''}`}>
                    {ListData?.map((data, i) => (
                      <tr key={i}>
                        <td className="loadingtdShort" onClick={() => navigate(`/settings/edit-master-list/${data?.labelid}`)}>{data?.label}</td>
                        <td className="" onClick={() => navigate(`/settings/edit-master-list/${data?.labelid}`)}>
                          <div className="masterTableFlex department loadingtdShort">
                            {data?.options?.map((value, i) => {
                              // if (i >= 4) return null;
                              return (
                                <div key={i} className="masterValueCard">{value?.label}</div>
                              )
                            })}
                          </div>
                        </td>
                        <td className='loadingtd'>
                          {!masterLoading &&
                            <div className="masterTableFlex ">
                              <div className="MasterActionBtn  masterValueAdd" onClick={() => { setMasterValue({ id: data?.labelid, label: data?.label }); setShowMasterPopUp(true) }}><Plus /></div>
                              <div className="MasterActionBtn masterValueEdit" onClick={() => navigate(`/settings/edit-master-list/${data?.labelid}`)}><Pencil /></div>
                            </div>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  // ❗ 4 new loding
                  <tbody className="table_not_found">
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                        {(!masterLoading && masterList?.length === 0) && (
                          <ListDataNotFound module="Master" />
                        )}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </>

        </div>
      </div>
      {showAddNewMasterPopUp && <AddNewMasterPopup setAddNewShowMasterPopUp={setAddNewShowMasterPopUp} />}
      {showMasterPopUp && <AddMasterValuePopup field={masterValue?.label} id={masterValue?.id} setShowMasterPopUp={setShowMasterPopUp} />}
    </>
  )
}
