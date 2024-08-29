import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import {
  CardBody,
  Form,
  FormFeedback,
  Input,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export default function Signin() {
  const [showToast, setShowToast] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter email"),
      password: Yup.string().required("Please enter password"),
    }),
    onSubmit: (values) => {
      handleSignIn(values);
    },
  });

  const handleSignIn = async (values) => {
    try {
      const apiData = {
        email: values.email,
        password: values.password,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/signin`,
        apiData
      );
      Cookies.set("authToken", response.data.token);
      Cookies.set("userData", JSON.stringify(response.data.user.email));
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error logging the user", error);
      setShowToast(true);
    }
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div>
      <section class="login">
        <div class="login_box">
          <div class="left">
            <div class="contact">
              <Form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <h3>Welcome back to ANPR</h3>
                <Row>
                  <Input
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="validationCustom01"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    id="validationCustom01"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password}
                    invalid={
                      validation.touched.password && validation.errors.password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.password && validation.errors.password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.password}
                    </FormFeedback>
                  ) : null}
                  <button class="submit" style={{ marginTop: "30px" }}>
                    Sign in
                  </button>
                </Row>
                <h3 style={{ fontSize: "14px", marginTop: "30px" }}>
                  <Link to={"/sign-up"}>Sign up</Link>
                </h3>
              </Form>
            </div>
          </div>
          <div class="right">
            <div class="right-inductor">
              <img
                src="https://lh3.googleusercontent.com/fife/ABSRlIoGiXn2r0SBm7bjFHea6iCUOyY0N2SrvhNUT-orJfyGNRSMO2vfqar3R-xs5Z4xbeqYwrEMq2FXKGXm-l_H6QAlwCBk9uceKBfG-FjacfftM0WM_aoUC_oxRSXXYspQE3tCMHGvMBlb2K1NAdU6qWv3VAQAPdCo8VwTgdnyWv08CmeZ8hX_6Ty8FzetXYKnfXb0CTEFQOVF4p3R58LksVUd73FU6564OsrJt918LPEwqIPAPQ4dMgiH73sgLXnDndUDCdLSDHMSirr4uUaqbiWQq-X1SNdkh-3jzjhW4keeNt1TgQHSrzW3maYO3ryueQzYoMEhts8MP8HH5gs2NkCar9cr_guunglU7Zqaede4cLFhsCZWBLVHY4cKHgk8SzfH_0Rn3St2AQen9MaiT38L5QXsaq6zFMuGiT8M2Md50eS0JdRTdlWLJApbgAUqI3zltUXce-MaCrDtp_UiI6x3IR4fEZiCo0XDyoAesFjXZg9cIuSsLTiKkSAGzzledJU3crgSHjAIycQN2PH2_dBIa3ibAJLphqq6zLh0qiQn_dHh83ru2y7MgxRU85ithgjdIk3PgplREbW9_PLv5j9juYc1WXFNW9ML80UlTaC9D2rP3i80zESJJY56faKsA5GVCIFiUtc3EewSM_C0bkJSMiobIWiXFz7pMcadgZlweUdjBcjvaepHBe8wou0ZtDM9TKom0hs_nx_AKy0dnXGNWI1qftTjAg=w1920-h979-ft"
                alt=""
              />
            </div>
          </div>
        </div>
        {showToast === true ? (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: "1005" }}
          >
            <UncontrolledAlert
              color="light"
              role="alert"
              className="card border mt-4 mt-lg-0 p-0 mb-0"
            >
              <div className="card-header bg-danger-subtle">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <h5 className="font-size-16 text-danger my-1">Oops!</h5>
                  </div>
                  <div className="flex-shrink-0"></div>
                </div>
              </div>
              <CardBody>
                <div className="text-center">
                  <p className="mb-0">Oops! Invalid credentials</p>
                </div>
              </CardBody>
            </UncontrolledAlert>
          </div>
        ) : null}
      </section>
    </div>
  );
}
