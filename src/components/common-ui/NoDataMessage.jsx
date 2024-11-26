import React from "react";

const NoDataMessage = ({ message = "No data available." }) => {
    return (
        <div className="no-data-message">
            {message}
        </div>
    );
};

export default NoDataMessage;
