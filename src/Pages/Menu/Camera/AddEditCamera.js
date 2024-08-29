import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Form,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isFetching } from "../../../helpers/utilityFunctions";
import { isEmpty } from "lodash";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddEditCamera() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);
  const [toastMessage, setToastMessage] = useState("");
  const [cameraDetails, setCameraDetails] = useState({});

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      cameraName: cameraDetails.cameraName || "",
      cameraLocation: cameraDetails.cameraLocation || "",
      rtspUrl: cameraDetails.rtspUrl || "",
    },
    validationSchema: Yup.object({
      cameraName: Yup.string().required("Please enter the camera name"),
      cameraLocation: Yup.string().required("Please enter the camera location"),
      rtspUrl: Yup.string()
        .url("Please enter a valid URL")
        .required("Please enter the RTSP URL"),
    }),
    onSubmit: (values) => {
      if (id) {
        updateCamera(values);
      } else {
        addCamera(values);
      }
    },
  });

  useEffect(() => {
    if (id && !isFetchingRef.current) {
      isFetching(isFetchingRef);
      fetchCameraDetails();
    }
  }, [id]);

  const fetchCameraDetails = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/cameras/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCameraDetails(response.data);
    } catch (error) {
      console.error(error);
      setToastMessage("Error occurred fetching camera details.");
    }
  };
  const addCamera = async (values) => {
    try {
      const token = Cookies.get("authToken");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/cameras/register`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/cameras");
    } catch (error) {
      console.error(error);
      setToastMessage("Error adding camera.");
    }
  };

  const updateCamera = async (values) => {
    try {
      const token = Cookies.get("authToken");
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/cameras/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/cameras");
    } catch (error) {
      console.error(error);
      setToastMessage("Error updating camera.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Menu"
            breadcrumbItem={id ? "Edit Camera" : "Add Camera"}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (id) {
                        updateCamera(validation.values);
                      } else {
                        addCamera(validation.values);
                      }
                      return false;
                    }}
                  >
                    <Row>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">
                            Camera Name
                          </Label>
                          <Input
                            name="cameraName"
                            placeholder="Ex: Front Door Camera"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cameraName}
                            invalid={
                              validation.touched.cameraName &&
                              validation.errors.cameraName
                            }
                          />
                          {validation.touched.cameraName &&
                          validation.errors.cameraName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cameraName}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">
                            Camera Location
                          </Label>
                          <Input
                            name="cameraLocation"
                            placeholder="Ex: Entrance"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.cameraLocation}
                            invalid={
                              validation.touched.cameraLocation &&
                              validation.errors.cameraLocation
                            }
                          />
                          {validation.touched.cameraLocation &&
                          validation.errors.cameraLocation ? (
                            <FormFeedback type="invalid">
                              {validation.errors.cameraLocation}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">RTSP URL</Label>
                          <Input
                            name="rtspUrl"
                            placeholder="Ex: rtsp://192.168.1.1:554/stream"
                            type="url"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.rtspUrl}
                            invalid={
                              validation.touched.rtspUrl &&
                              validation.errors.rtspUrl
                            }
                          />
                          {validation.touched.rtspUrl &&
                          validation.errors.rtspUrl ? (
                            <FormFeedback type="invalid">
                              {validation.errors.rtspUrl}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    {id ? (
                      <Button type="submit" color="primary">
                        <i className="bx bxs-edit"></i> Edit Camera
                      </Button>
                    ) : (
                      <Button type="submit" color="primary">
                        <i className="bx bx-plus "></i> Add Camera
                      </Button>
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <a href="/cameras">
                      <Button type="button" color="link">
                        <i className="bx bx-arrow-back"></i> Back
                      </Button>
                    </a>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {!isEmpty(toastMessage) ? (
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
                  <p className="mb-0">{toastMessage}</p>
                </div>
              </CardBody>
            </UncontrolledAlert>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
