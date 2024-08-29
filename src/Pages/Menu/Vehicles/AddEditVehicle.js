import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledAlert,
} from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { isFetching } from "../../../helpers/utilityFunctions";
import Dropzone from "react-dropzone";
import { isEmpty } from "lodash";
import Cookies from "js-cookie";
import axios from "axios";

export default function AddEditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const isFetchingRef = useRef(false);
  const [toastMessage, setToastMessage] = useState("");

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: vehicleDetails.name || "",
      phoneNumber: vehicleDetails.phoneNumber || "",
      vehicleNumber: vehicleDetails.vehicleNumber || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your name"),
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Please enter phone number"),
      vehicleNumber: Yup.string()
        .required("Please enter vehicle number")
        .matches(
          /^[a-z]{2}\d{2}[a-z]{2}\d{4}$/i,
          "Vehicle number must be in the format: 'XX00XX0000'"
        ),
    }),
    onSubmit: (values) => {
      const updatedValues = values;

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
      Object.keys(updatedValues).forEach((key) => {
        formData.append(key, updatedValues[key]);
      });
      if (id) {
        updateVehicle(id, formData);
      } else {
        addVehicle(formData);
      }
    },
  });

  useEffect(() => {
    if (id && !isFetchingRef.current) {
      isFetching(isFetchingRef);
      fetchVehicleDetails();
    }
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/vehicles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const vehicle = response.data;
      setVehicleDetails(vehicle);
      if (vehicle.vehicleImgUrl && vehicle.vehicleImgUrl.length > 0) {
        const base64Image = vehicle.vehicleImgUrl[0];
        const file = {
          preview: `data:image/jpeg;base64,${base64Image}`,
          name: "vehicleImage.jpg",
          formattedSize: formatBytes(base64Image.length),
        };
        setSelectedFiles([file]);
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Error occurred fetching vehicle details.");
    }
  };

  const addVehicle = async (formData) => {
    try {
      const token = Cookies.get("authToken");
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/vehicles/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/vehicles");
    } catch (error) {
      if (error.response) {
        console.error("Error adding vehicle : ", error.response);
        alert(`Error:  ${error.response.data.error}`);
      } else {
        console.error("Error adding vehicle : ", error.response);
        alert(`Error:  ${error.response}`);
      }
    }
  };

  const updateVehicle = async (vehicleId, formData) => {
    try {
      const token = Cookies.get("authToken");

      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/vehicles/${vehicleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/vehicles");
    } catch (error) {
      console.error("Error updating vehicle.", error);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  };

  const handleAcceptedFiles = (files) => {
    const newFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(newFiles);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Menu"
            breadcrumbItem={id ? "Edit Vehicle" : "Add Vehicle"}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">Name</Label>
                          <Input
                            name="name"
                            placeholder="Ex: Motor Car(LMV)"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name || ""}
                            invalid={
                              validation.touched.name && validation.errors.name
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            Phone Number
                          </Label>
                          <Input
                            name="phoneNumber"
                            placeholder="Ex: 1234567890"
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phoneNumber || ""}
                            invalid={
                              validation.touched.phoneNumber &&
                              validation.errors.phoneNumber
                            }
                          />
                          {validation.touched.phoneNumber &&
                          validation.errors.phoneNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.phoneNumber}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            Vehicle Number
                          </Label>
                          <Input
                            name="vehicleNumber"
                            placeholder="Ex: XX00XX0000"
                            type="text"
                            className="form-control"
                            min="1"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.vehicleNumber || ""}
                            invalid={
                              validation.touched.vehicleNumber &&
                              validation.errors.vehicleNumber
                            }
                          />
                          {validation.touched.vehicleNumber &&
                          validation.errors.vehicleNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.vehicleNumber}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">
                            Number Plate Image
                          </Label>
                          <Dropzone
                            className="border-2 border-black"
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                style={{
                                  textAlign: "center",
                                  border: "1px #ccc solid",
                                  borderRadius: "5px",
                                }}
                              >
                                <div
                                  className="dz-message needsclick"
                                  {...getRootProps()}
                                >
                                  <input {...getInputProps()} />
                                  <div className="mb-3">
                                    <i className="display-4 text-muted mdi mdi-cloud-upload-outline"></i>
                                  </div>
                                  <div className="border-2 border-gray-400 cursor-pointer h-16 p-4">
                                    <h4>Drop files here to upload</h4>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                          {selectedFiles.length > 0 && (
                            <img
                              className="number-plate-image rounded bg-light"
                              src={selectedFiles[0].preview}
                              alt={selectedFiles[0].name}
                              style={{
                                height: "200px",
                                width: "400px",
                                marginTop: "20px",
                              }}
                            />
                          )}
                          {validation.touched.images &&
                          validation.errors.images ? (
                            <FormFeedback type="invalid">
                              {validation.errors.images}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    {id ? (
                      <Button type="submit" color="primary">
                        <i className="bx bxs-edit"></i> Edit Vehicle
                      </Button>
                    ) : (
                      <Button type="submit" color="primary">
                        <i className="bx bx-plus "></i> Add Vehicle
                      </Button>
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <a href="/vehicles">
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
