import React from "react";
import { Container, Row, Col } from "reactstrap";
import img1 from "../../assets/images/cam_logo.png";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  document.title = "Cooming Soon  | ANPR";

  return (
    <React.Fragment>
      <div className="bg-pattern" style={{ height: "100vh" }}>
        <div className="bg-overlay"></div>
        <div className="account-pages pt-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mb-5 mt-5">
                  <Link to="/#" className="logo">
                    <img src={img1} height="24" alt="logo" />
                  </Link>

                  <h4 className="text-white mt-5">
                    Let's get started with ANPR
                  </h4>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ComingSoon;
