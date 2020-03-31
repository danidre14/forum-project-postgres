import React from "react";
import Helmet from "react-helmet";

function Head({ page = { title: "", description: ""} }) {
    const { title, description } = page;
    return (<>
        <Helmet>
            <title>{`Dani-Smorum${title ? ` | ${title}` : ""}`}</title>
            {/* <link rel="icon" type="image/x-icon" href="/favicon.ico" /> */}

            {description && <meta name="description" content={description} />}
        </Helmet>
    </>);
}

export default Head;