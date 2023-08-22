import React, { useState, useNavigate, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Modal, TextField, Button } from "@mui/material";
import Dropzone from "react-dropzone";
import FlexBetween from "./FlexBetween";
import { Formik } from "formik";
import { Label } from "@mui/icons-material";

const EditForm = (open, setOpen) => {
  const [user, setUser] = useState(null);
  const userId = useSelector((state) => state.user._id);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const API_URL = process.env.REACT_APP_API_URL;

  const getUser = async () => {
    console.log(userId)
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("location", values.location);
    formData.append("occupation", values.occupation);
    formData.append("picture", values.picture);

    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setUser(data);
  };

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    picturePath,
  } = user;
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={{
        firstName: firstName,
        lastName: lastName,
        location: location,
        occupation: occupation,
        picture: picturePath,
      }}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <form onSubmit={handleSubmit}>
            <Box
              bgcolor="neutral.light"
              border="2px solid rgba(0,0,0,0.1)"
              display="grid"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              borderRadius="10px"
              width="40%"
              height="50%"
              marginLeft={"30%"}
              marginTop={"10%"}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Change User Settings
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 5 }}>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Label>Profile Picture</Label>
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  gap="1rem"
                  mt="1rem"
                >
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
              </Typography>
            </Box>
          </form>
        </Modal>
      )}
    </Formik>
  );
};

export default EditForm;
