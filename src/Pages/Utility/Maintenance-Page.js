import React from "react";

import img1 from "../../assets/images/cam_logo.png";
import img2 from "../../assets/images/cam_logo.png";

import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Maintenance = () => {
  document.title = "Maintenance  | ANPR";

  return (
    <React.Fragment>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Row
          style={{
            height: "100%",
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Col lg={6} md={8} xl={5}>
            <div className="text-center">
              <Link to="/" className="">
                <img
                  src={img1}
                  alt=""
                  height="24"
                  className="auth-logo logo-dark mx-auto"
                />
                <img
                  src={img2}
                  alt=""
                  height="24"
                  className="auth-logo logo-light mx-auto"
                />
              </Link>

              <div className="mt-5">
                <div className="mb-4">
                  <i className="ri-tools-fill display-3"></i>
                </div>
                <h4>Site is Under Maintenance</h4>
                <p>Please check back in sometime</p>

                <div className="mt-4 pt-2">
                  <Link to="/" className="btn btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Maintenance;
