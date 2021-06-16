import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserAndAuthContext from "../../context/AuthContext";
import API from "../../lib/API";

import { Button } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: 4
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }, 
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  submitMessage: {
    textAlign: "center"
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

}))

export default function MemberStatusMenu({ admin, owner, memberId, reRender, setReRender, setLoading }) {
  const classes = useStyles();
  const [action, setAction] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [classRequestInputVal, setClassRequestInputVal] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { authToken, currentClass, setCurrentClass, contextReRender } = useContext(UserAndAuthContext);


  const handleClick = e => {
    e.preventDefault()
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const menuItemClick = e => {
    handleClose();
    setAction(e.currentTarget.dataset.action)
    setSubmitMessage("");
    setModalOpen(true)
  }

  const submitMsg = (message, mustReRender = true) => {
      setSubmitMessage(message);
      setLoading(false);
      if (mustReRender) setReRender(!reRender);
      setTimeout(() => {
        setModalOpen(false);
      }, 1000);
  }

  const downgradeAdmin = async () => {
    try {
      setLoading(true);
      const data = await API.Classes.downgradeAdmin(authToken, currentClass.id, memberId);
      submitMsg("Admin Has been Downgraded.")
    } catch (err) {
      submitMsg("You are not Authorized to Downgrade an Admin.", false);
      console.log(err);
    }
  };

  const makeAdmin = async () => {
    try {
      setLoading(true);
      const data = await API.Classes.createAdminForClass(authToken, currentClass.id, memberId);
      submitMsg("Admin Has been created.")
    } catch (err) {
      submitMsg("You are not Authorized.", false);
      console.log(err);
    }
  };

  const transferOwnerShip = async () => {
    try {
      setLoading(true);
      console.log(authToken, currentClass.id, memberId);
      const data = await API.Classes.transferClassOwnership(authToken, currentClass.id, memberId);
      submitMsg("Ownership has been transferred.")
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const removeAdminFromClass = async () => {
    try {
      setLoading(true);
      console.log(authToken, currentClass.id, memberId);
      const data = await API.Classes.removeAdminFromClass(authToken, currentClass.id, memberId);
      submitMsg("Admin has been removed from class.");
    } catch (err) {
      submitMsg("You are not Authorized to remove an Admin.", false);
      console.log(err);
    }
  };

  const removeStudentFromClass = async () => {
    try {
      setLoading(true);
      console.log(authToken, currentClass.id, memberId);
      const data = await API.Classes.removeStudentFromClass(authToken, currentClass.id, memberId);
      submitMsg("Student has been removed from class.");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const switchStatement = () => {
    switch (action) {
      case "Downgrade Admin":
        downgradeAdmin();
        break;
      case "Transfer Ownership":
        transferOwnerShip();
        break;
      case "Remove Admin From Class":
        removeAdminFromClass();
        break;
      case "Remove Student From Class":
        removeStudentFromClass();
        break;
      case "Make Admin":
        makeAdmin();
        break;
      default:
        console.log("An error occurred When deciding which action to take.")
        setModalOpen(false);
    }

  }


  return(
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={e => handleClick(e)} color="inherit">
        <ExpandMoreIcon className={classes.icon}></ExpandMoreIcon>
        Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      > {admin & owner ?  
          <MenuItem>No Actions</MenuItem>
        : admin ? 
          <>  
            <MenuItem key={"Downgrade Admin"} data-action={"Downgrade Admin"} onClick={menuItemClick}>Downgrade Admin</MenuItem>
            <MenuItem key={"Transfer Ownership"} data-action={"Transfer Ownership"} onClick={menuItemClick}>Transfer Ownership To Admin</MenuItem>
            <MenuItem key={"Remove Admin From Class"} data-action={"Remove Admin From Class"} onClick={menuItemClick}>Remove Admin From Class</MenuItem>
          </> : 
          <>
            <MenuItem key={"Remove Student From Class"} data-action={"Remove Student From Class"} onClick={menuItemClick}>Remove Student From Class</MenuItem>
            <MenuItem key={"Make Admin"} data-action={"Make Admin"} onClick={menuItemClick}>Make Admin</MenuItem>
          </>
        }
      </Menu>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paperModal}>
            <Typography color="secondary" variant="h6">
              Are you sure you want to {action}?
            </Typography>
            <Grid className={classes.grid} container justify="space-evenly" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={e => switchStatement()}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={e => setModalOpen(false)}
              >
                No
              </Button>
            </Grid>
            <Typography className={classes.submitMessage} color="secondary" variant="h6">
              {submitMessage}
            </Typography> 
          </div>
        </Fade>
      </Modal>

    </>
  )
}