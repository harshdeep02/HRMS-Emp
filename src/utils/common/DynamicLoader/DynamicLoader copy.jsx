import React from "react";
import "./DynamicLoader.scss";

const DynamicLoader = ({ type = "list", count = 8, closeBtnValue, listType }) => {
  return (
    <div className="applicants-loader">
      {/* Sidebar */}
      <aside className="sidebarS">
        <div className="skeleton title"></div>
        <div className="skeleton option"></div>
        <div className="skeleton option mt incWid"></div>
        <div className="skeleton option mt"></div>
        <div className="skeleton option mt"></div>
        <div className="skeleton option mt incWid"></div>
        <div className="skeleton option mt  newopt"></div>

        {/* <div className="skeleton sub-title"></div> */}
        <div className="skeleton stat adSpace" style={{ marginTop: closeBtnValue }}></div>
        <div className="skeleton option fullWid inchight"></div>
        <div className="skeleton option fullWid"></div>
        <div className="skeleton option fullWid"></div>
        <div className="skeleton option mt fullWid inchight"></div>
        <div className="skeleton stat fullWid inchight"></div>
      </aside>

      {/* Content */}
      <main className={`contentS ${type === "list" ? "list-view" : "grid-view"}`}>
        <table className="employee-table emp-t-4">
          <thead>
            <tr>
              <th>  <div className="skeleton lineS short"></div></th>
              <th>  <div className="skeleton lineS short"></div></th>
              <th>  <div className="skeleton lineS short"></div></th>
              <th>  <div className="skeleton lineS short"></div></th>
            </tr>
          </thead>
        </table>
        {Array.from({ length: count }).map((_, i) =>
          type === "list" ? (
            <>
              <div className="employee-cards" key={i}>
                <div className={`${listType == 'emp' && 'empnth1'}`}>
                  <div className="skeleton avatar"></div>
                  <div className="skeleton lineS short"></div>
                </div>

                <div className={`skeleton lineS  ${listType == 'emp' && 'empnth2'}`}></div>
                <div className={`skeleton lineS  ${listType == 'emp' && 'empnth3'}`}></div>
                <div className={`skeleton badge ${listType == 'emp' && 'empnth4'}`}></div>
                <div className={`skeleton badge d_bloack ${''}`}></div>
              </div>
            </>
          ) : (
            <div className="employee-cards" key={i}>
              <div className="skeleton avatar-big"></div>
              <div className="skeleton lineS long"></div>
              <div className="skeleton lineS medium"></div>
              <div className="skeleton lineS short"></div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DynamicLoader;
