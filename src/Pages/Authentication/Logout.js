import PropTypes from "prop-types";
import React from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

import Cookies from "js-cookie";

import { isEmpty } from "lodash";

const Logout = () => {
  Cookies.remove("authToken");
  Cookies.remove("userData");

  const isUserLogout = isEmpty(Cookies.get("authToken")) ? true : false;

  if (isUserLogout) {
    return <Navigate to="/sign-in" />;
  }

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
