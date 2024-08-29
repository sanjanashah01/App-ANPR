import React, { useEffect, useState } from "react";
import UsePanel from "./UserPanel";
import Cookies from "js-cookie";

import { Row, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = JSON.parse(Cookies.get("userData"));
    if (userData === "admin@gmail.com") setUser(userData);
  }, []);

  document.title = "Dashboard | ANPR";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="ANPR" breadcrumbItem="Dashboard" />
          <UsePanel />
          <button>{user}</button>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
