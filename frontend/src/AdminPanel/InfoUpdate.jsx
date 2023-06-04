/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import "../assets/css/infoUpdate.css";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { registerAction } from "../Actions/Actions"
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function InfoUpdate() {
  const [usersListsArray, setUsersListsArray] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(()=> {
    const strData = localStorage.getItem("users");
    setUsersListsArray(JSON.parse(strData));
  },[])

  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') {
      setOpen(false);
    }
  };

  useEffect(() => {
    let data = usersListsArray.find((obj) => obj.userId === Number(params.id));
    data ? formik.setValues(data) : '';
  }, [usersListsArray]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      status: 'approved',
      type: 'user',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .required('No password provided.')
        .min(6, 'Password is too short - should be 6 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    }),
    onSubmit: (values) => {
      // let parsedArray = JSON.parse(JSON.stringify(usersListsArray));
      let parsedArray = usersListsArray;
      if (params.id) {
        let updatedArray = parsedArray.map((obj) => {
          if (obj.email === values.email) {
            obj.name = values.name;
            obj.password = values.password;
            obj.status = values.status;
            obj.type = values.type;
          }
          return obj;
        });
        localStorage.setItem("users", JSON.stringify(updatedArray));
        // dispatch(addUserData(updatedArray));
        
        navigate('/usersDashboard');
      } else {
        let found = false;
        usersListsArray.forEach((obj) => {
          if (obj.email === values.email) {
            found = true;
            setOpen(true);
          }
        });
        if (!found) {
          const date = new Date();
          let nextId = date.getTime();
          let userDataObj = {
            userId: nextId++,
            name: values.name,
            email: values.email,
            password: values.password,
            type: values.type,
            status: values.status,
          };
          parsedArray.push(userDataObj);
          localStorage.setItem("users", JSON.stringify(parsedArray));
          // dispatch(addUserData(parsedArray));
          let newObj = {
            name : userDataObj.name,
            email: userDataObj.email,
            password: userDataObj.password
          }
          dispatch(registerAction(newObj))
          navigate('/usersDashboard');
        }
      }
    },
  });
  return (
    <div className="infoUpdatePageWrapper">
      <h2>{params.id ? 'Update' : 'Create'} User</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="wrapperContent">
          <label>Username</label>
          <TextField
            sx={{
              my: 1,
            }}
            variant="standard"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="Enter your Username"
            fullWidth
          />
          {formik.touched.name && formik.errors.name ? (
            <div
              style={{
                color: 'red',
                paddingTop: '10px',
              }}
            >
              {formik.errors.name}
            </div>
          ) : null}
        </div>
        <div className="wrapperContent">
          <label>Email</label>
          <TextField
            sx={{
              my: 1,
            }}
            variant="standard"
            name="email"
            disabled={params.id ? true : false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="Enter your Email"
            fullWidth
          />
          {formik.touched.email && formik.errors.email ? (
            <div
              style={{
                color: 'red',
                paddingTop: '10px',
              }}
            >
              {formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="wrapperContent">
          <label>Password</label>
          <Input
            sx={{
              my: 1,
            }}
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
            autoComplete="on"
            value={formik.values.password}
            placeholder="Enter your Password"
            error={formik.touched.password && Boolean(formik.errors.password)}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.password && formik.errors.password ? (
            <div
              style={{
                color: 'red',
                paddingTop: '10px',
              }}
            >
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        <div className="wrapperContent">
          <label>Status</label>
          <Select
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                borderRadius: 0,
              },
              '.css-1h9nf3d-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root.Mui-focused': {
                borderWidth: 0,
              },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="status"
            onChange={formik.handleChange}
            value={formik.values.status}
            label="Status"
            fullWidth
          >
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="not approved">Not Approved</MenuItem>
          </Select>
        </div>
        <div className="wrapperContent">
          <label>Type</label>
          <Select
            sx={{
              '.MuiOutlinedInput-notchedOutline': {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                borderRadius: 0,
              },
              '.css-1h9nf3d-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root.Mui-focused': {
                borderWidth: 0,
              },
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="type"
            onChange={formik.handleChange}
            value={formik.values.type}
            label="Type"
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </div>
        <div className="wrapperFooter">
          <Button
            onClick={() => navigate('/usersDashboard')}
            variant="outlined"
            color="error"
            sx={{
              mr: 2,
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit">
            Save
          </Button>
        </div>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{
            width: '100%',
          }}
        >
          Email Already exist!
        </Alert>
      </Snackbar>
    </div>
  );
}
