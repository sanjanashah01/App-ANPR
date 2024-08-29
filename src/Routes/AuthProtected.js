import { isEmpty } from "lodash";
import React from "react";
import { Navigate, Route } from "react-router-dom";
import Cookies from "js-cookie";

const AuthProtected = (props) => {
  const authUser = !isEmpty(Cookies.get("authToken"));

  /*
    redirect is un-auth access protected routes via url
    */

  if (!authUser) {
    return (
      <Navigate
        to={{ pathname: "/sign-in", state: { from: props.location } }}
      />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            {" "}
            <Component {...props} />{" "}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
