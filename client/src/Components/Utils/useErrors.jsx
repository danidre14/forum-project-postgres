import React, { useState } from "react";

import { Alert } from "react-bootstrap";

function useErrors(initialErrorValue) {
    const [error, setError] = useState(initialErrorValue);

    function Error() {
        const errMsg = `An error has occurred: ${error === true ? "Unknown" : error}`;
        return (
            <>{error &&

                <Alert variant="danger" onClose={() => setError(false)} dismissible>
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>
                        {errMsg}
                    </p>
                </Alert>
            }</>
        )
    }

    return [Error, setError];
}

export default useErrors;