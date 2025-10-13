const ListDataNotFound = ({
    module = "",
    form
    // handleReset = () => { }
}) => {
    // Ensure first letter is capitalized for heading
    // const capitalizedModule = module
    //     ? module.charAt(0).toUpperCase() + module.slice(1)
    //     : "Records";

    return (
        <div className="no-results-container">
            <div className="no-results-animation">
                <iframe
                    src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                    frameBorder="0"
                    style={{ width: "100%", height: "250px" }}
                ></iframe>
            </div>
            <h2 className="no-results-title">{`No ${module} Found`}</h2>
            {!form ?
                <p className="no-results-text">
                    {`We couldn't find any data matching your criteria.
                Try adjusting your filters or search term.`}
                </p>
                :
                <p className="no-results-text">
                    {`Please Add ${module} `}
                </p>
            }
            {/* <button className="reset-filters-btn" onClick={handleReset}>
                Reset Filters
            </button> */}
        </div>
    );
};

export default ListDataNotFound;
