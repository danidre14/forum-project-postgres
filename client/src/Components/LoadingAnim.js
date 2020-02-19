import React from "react";

function LoadingAnim({ value }) {
    return (
        <>
            Loading <strong>{value || "Content"}</strong> :D
        </>
    )
}

export default LoadingAnim;