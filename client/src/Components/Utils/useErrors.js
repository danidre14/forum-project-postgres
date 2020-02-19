import React, { useState } from "react";

function useErrors(initialErrorValue) {
    const [error, setError] = useState(initialErrorValue);

    function Error() {
        const Error = !error ? <React.Fragment></React.Fragment> : <div>
            <h1>Error</h1>
            <p>An error has occurred: {error === true ? "Unknown" : error}</p>
            <button onClick={() => setError(false)}>Close</button>
        </div>

        return (
            <>{Error}</>
        )
    }

    return [Error, setError];
}

export default useErrors;