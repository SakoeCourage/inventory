import React from 'react'
import { Route, redirect } from 'react-router-dom';
function MetaRoute({ Component: element, path, ...rest }) {
    // return (
    //     <Route {...rest} path={path} element={element} />
    // )
    return (
        <Route {...rest} render={(props) => (
        <Component {...props} />
        )} />
      );
}

export default MetaRoute