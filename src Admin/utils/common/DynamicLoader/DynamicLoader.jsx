import React from "react";
import "./DynamicLoader.scss";

const DynamicLoader = ({ type = "list", count = 8, department, cardView, closeBtnValue, listType, mode, avatar }) => {
  return (
    <div className={`applicants-loader ${mode}-actve`}>
      {/* Sidebar */}
      {mode !== 'one' &&
        <aside className="sidebarS">
          <div className="skeleton title"></div>
          <div className="skeleton option"></div>
          <div className="skeleton option mt incWid"></div>
          <div className="skeleton option mt"></div>
          <div className="skeleton option mt"></div>
          <div className="skeleton option mt incWid"></div>
          <div className="skeleton option mt  newopt"></div>
          {cardView &&
            <>

              <div className="skeleton sub-title"></div>
              <div className="skeleton stat adSpace" style={{ marginTop: closeBtnValue }}></div>
              <div className="skeleton option fullWid inchight"></div>
              <div className="skeleton option fullWid"></div>
              <div className="skeleton option fullWid"></div>
              <div className="skeleton option mt fullWid inchight"></div>
              <div className="skeleton stat fullWid inchight"></div>
            </>
          }
        </aside>
      }

      {/* Content */}
      <main className={`contentS ${type === "list" ? "list-view" : "grid-view"}`}>
        {type === "list" ? (
          <div className="employee-table-wrapper">
            <table className={`employee-table ${listType === 'emp' ? 'emp-t-4' :
              listType === 'emp-a-5' ? 'emp-a-5' :
                listType === 'emp-5' ? 'emp-5' :
                  listType === 'emp-a-6' ? 'emp-a-6' : ''
              }`}>
              <thead>
                <tr>
                  {!mode &&
                    <>

                      <th><div className="skeleton lineS medium"></div></th>
                      <th><div className="skeleton lineS medium"></div></th>
                      <th><div className="skeleton lineS medium"></div></th>
                      {listType === 'emp' &&
                        <th><div className="skeleton lineS medium"></div></th>
                      }
                      {listType === 'emp-a-4' &&
                        <th><div className="skeleton lineS medium"></div></th>
                      }


                      {listType === 'emp-5' || listType === 'emp-a-5' ?
                        <>
                          <th><div className="skeleton lineS medium"></div></th>
                          <th><div className="skeleton lineS medium"></div></th>
                        </>
                        : ""
                      }
                      {listType === 'emp-a-6' &&
                        <>
                          <th><div className="skeleton lineS medium"></div></th>
                          <th><div className="skeleton lineS medium"></div></th>
                          <th><div className="skeleton lineS medium"></div></th>
                        </>
                      }
                    </>
                  }
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: count }).map((_, i) => (
                  <tr key={i} className="">
                    {avatar === 'yas' &&
                      <td>
                        <div className={` ${avatar === 'yas' ? 'empnth1' : 'none'}`}>
                          <div className="skeleton avatar"></div>
                          <div className="skeleton lineS short"></div>
                        </div>

                      </td>
                    }
                    {listType === 'emp' &&
                      <td>
                        <div className={` ${listType === 'emp' ? 'empnth1' : 'none'}`}>
                          <div className="skeleton avatar"></div>
                          <div className="skeleton lineS short"></div>
                        </div>

                      </td>
                    }
                    {listType === 'emp-a-5' &&
                      <>
                        <td>
                          <div className={` ${listType === 'emp-a-5' ? 'empnth1' : 'none'}`}>
                            <div className="skeleton "></div>
                            <div className="skeleton lineS short"></div>
                          </div>

                        </td>
                        {/* {avatar === 'yas' ?
                          null
                          :
                          <td><div className={`skeleton lineS medium `}></div></td>
                        } */}
                      </>
                    }
                    <td><div className={`skeleton lineS medium `}></div></td>
                    {listType === 'emp-5' &&
                      <>
                        <td><div className={`skeleton lineS medium `}></div></td>
                        <td><div className={`skeleton lineS medium `}></div></td>
                      </>
                    }
                    {listType === 'emp-a-4' &&
                      <>
                        <td><div className={`skeleton lineS medium `}></div></td>
                      </>
                    }
                    {listType === 'emp-a-6' &&
                      <>
                        <td><div className={`skeleton lineS medium `}></div></td>
                        <td><div className={`skeleton lineS medium `}></div></td>
                        <td><div className={`skeleton lineS medium `}></div></td>
                      </>
                    }
                    <td><div className={`skeleton lineS medium ${department && 'departmentLoding'} `}></div></td>

                    {listType === 'emp' || listType === "emp-a-5" ?
                      <td>
                        <div className={`skeleton badge medium `}></div>
                      </td>
                      : ''
                    }
                    {listType !== 'emp' && listType !== "emp-a-5" ?
                      <td>
                        <div className={`skeleton lineS medium `}></div>
                      </td>
                      : ''
                    }

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid type skeleton table se bahar
          <>
            {Array.from({ length: count }).map((_, i) => (
              <div className="employee-cards" key={i}>
                <div className="skeleton avatar-big"></div>
                <div className="skeleton lineS long"></div>
                <div className="skeleton lineS medium"></div>
                <div className="skeleton lineS short"></div>
              </div>
            ))}
          </>
        )}
      </main>

    </div>
  );
};

export default DynamicLoader;
