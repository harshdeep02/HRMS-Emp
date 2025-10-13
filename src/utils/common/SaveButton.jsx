const SaveButton = ({ loading, editingIndex, handleSubmit, handleCancel, id }) => {
    return (
        <div className="btn_fix_box _3btn_fix_box">
            <div id='savrLoging' style={{ height: '50px' }}>
                <div className={`btn_saveed ${loading ? 'btn_saveed_disabled' : ''} `}>
                    <>
                        {/* {!editingIndex && ( */}
                        {/* <div type="button" className="btn-cancel btnn" onClick={handleCancel}>
                            Cancel
                        </div> */}
                        {/* )} */}
                        <div type="button" className="btn-save btnn" onClick={handleSubmit}>
                            {loading ?
                                <>
                                    <div id='svg_submit_loading' className="" style={{ marginTop: "0px" }}>
                                        <svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                            {/* <circle fill="grey" cx="10" cy="50" r="7">
                                    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1" />
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                </circle> */}
                                            <circle fill="#fff" cx="35" cy="50" r="7">
                                                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2" />
                                                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                            </circle>
                                            <circle fill="#fff" cx="60" cy="50" r="7">
                                                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" />
                                                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                            </circle>
                                            <circle fill="#fff" cx="85" cy="50" r="7">
                                                <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4" />
                                                <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                            </circle>
                                        </svg>
                                    </div>

                                </>
                                :
                                <>
                                    {editingIndex !== null ? 'Update' : 'Save'}
                                </>
                            }
                        </div>
                    </>

                    {/* {!loading && <span><CiCircleChevRight /></span>} */}
                </div>
            </div>
        </div>
    );
};

export default SaveButton;
