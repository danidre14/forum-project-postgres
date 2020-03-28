import React, { useState } from "react";

import { Alert } from "react-bootstrap";

function ErrorsBox(initialErrorValue) {
  const [error, setError] = useState(initialErrorValue);

  function Error() {
    const errMsg = `${
      error === true ? "An error has occurred: Unknown" : error
    }`;
    return (
      <>
        {error && (
          <Alert
            className="no-border"
            variant="danger"
            onClose={() => setError(false)}
            dismissible
          >
            <Alert.Heading>Error!</Alert.Heading>
            <pre className="errorMsg">{errMsg}</pre>
          </Alert>
        )}
      </>
    );
  }

  return [Error, setError];
}

export default ErrorsBox;
