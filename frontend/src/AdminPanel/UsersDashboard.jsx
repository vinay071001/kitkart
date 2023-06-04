import React, { useEffect, useState } from 'react';

import "../assets/css/usersDashboard.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UsersDashboard() {
  const navigate = useNavigate()
  const [usersListsArray, setUsersListsArray] = useState([]);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [chartData, setChartData] = useState({
    approved: 0,
    pending: 0,
    notApproved: 0,
  });

  useEffect(()=> {
    const strData = localStorage.getItem("users");
    setUsersListsArray(JSON.parse(strData));
  },[])

  const loadData = () => {
    const strData = localStorage.getItem("users");
    setUsersListsArray(JSON.parse(strData));
  }

  useEffect(() => {
    let userChartData = {
      approved: 0,
      pending: 0,
      notApproved: 0,
    };
    usersListsArray.forEach((obj) => {
      switch (obj.status) {
        case 'approved':
          userChartData.approved = userChartData.approved + 1;
          break;
        case 'pending':
          userChartData.pending = userChartData.pending + 1;
          break;
        case 'not approved':
          userChartData.notApproved = userChartData.notApproved + 1;
          break;
        default: 
          return "";
      }
    });
    setChartData(userChartData);
  }, [usersListsArray]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function deleteUser() {
    let deletedUser = usersListsArray.filter((obj) => {
      if (obj.userId !== Number(deleteId)) {
        return obj;
      }
    });
    localStorage.setItem("users", JSON.stringify(deletedUser));
    loadData()
    // dispatch(addUserData(deletedUser));
    handleClose();
  }

  function editUserInfo(userId) {
    navigate(`/infoUpdate/${userId}`);
  }

  function createUser() {
    navigate('/infoUpdate');
  }

  const data = {
    labels: ['Approved', 'Pending', 'Not Approved'],
    datasets: [
      {
        label: 'status',
        data: [chartData.approved, chartData.pending, chartData.notApproved],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="loginPageWrap dashboardWrap">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this user ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => deleteUser()} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <table className="usersList">
        <caption>
          <button onClick={() => createUser()}>Add User</button>
        </caption>
        <thead>
          <tr className="headRow">
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Status</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersListsArray.map((obj, key) => {
            if (obj.type !== 'superAdmin')
              return (
                <tr key={key} className="bodyRow">
                  <td>{obj.name}</td>
                  <td>{obj.email}</td>
                  <td>{obj.password}</td>
                  <td>{obj.status}</td>
                  <td>{obj.type}</td>
                  <td>
                    <button
                      className="dashboardEditBtn"
                      value={obj.userId}
                      onClick={(e) => editUserInfo(e.target.value)}
                    >
                      Edit
                    </button>
                    <button
                      className='dashboardEditBtn'
                      value={obj.userId}
                      onClick={(e) => {
                        handleClickOpen();
                        setDeleteId(e.target.value);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
          })}
        </tbody>
      </table>
      <div className="dashboardChart">
        <Doughnut data={data} />
      </div>
    </div>
  );
}
