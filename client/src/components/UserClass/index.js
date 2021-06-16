import { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserAndAuthContext from "../../context/AuthContext";
import UserStore from "../../lib/UserStore";
import TokenStore from "../../lib/TokenStore";
import API from "../../lib/API";

import { Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


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
  }
}))

export default function UserClass() {
  const classes = useStyles();
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState(null);
  const [allClasses, setAllClasses] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [classRequestInputVal, setClassRequestInputVal] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const { authToken, currentClass, setCurrentClass, contextReRender } = useContext(UserAndAuthContext);

  const userClasses = async (authToken) => {
    const res = await API.Classes.getUserClasses(authToken);
    if(!res.data[0]) return
    const lastClassId = parseInt(UserStore.getClassId());
    const newCurrentClass = res.data.filter(val => {
      return val.id === lastClassId
    });

    if (newCurrentClass[0]){
      setClassId(newCurrentClass[0].id);
      setClassName(newCurrentClass[0].name);
      setCurrentClass(newCurrentClass[0]);
    } else {
      setClassId(res.data[0].id);
      setClassName(res.data[0].name);
      setCurrentClass(res.data[0]);
      UserStore.setClassId(res.data[0].id)
    }
    setAllClasses(res.data);
  }

  useEffect(() => {
    const token = TokenStore.getToken();
    userClasses(token)

  }, [contextReRender]);

  const handleClick = e => {
    e.preventDefault()
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const menuItemClick = e => {
    handleClose();
    const newClassId = parseInt(e.currentTarget.id);
    const newClassName = e.currentTarget.textContent

    setClassId(newClassId);
    UserStore.setClassId(newClassId);
    setClassName(newClassName);

    const newCurrentClass = allClasses.filter(val => {
      return val.id === newClassId
    });
    setCurrentClass(newCurrentClass[0]);
  }
  
  const addClassClick = () => {
    handleClose();
    setModalOpen(true);
  }

  const handleClassRequestSubmit = async e => {
    e.preventDefault();
    const data = await API.JoinRequests.userRequestJoin(authToken, classRequestInputVal)

    setSubmitMessage("Your Request Has Been Sent!")
    setTimeout(() => {
      setModalOpen(false);
      setSubmitMessage("");
    }, 2000)
  }

  return(
    <>
      { classId ? 
        <>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={e => handleClick(e)} color="inherit">
            <ExpandMoreIcon className={classes.icon}></ExpandMoreIcon>
            {className}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            { allClasses ? 
              allClasses.map(val => (
                <MenuItem key={val.id} id={val.id} onClick={menuItemClick}>{val.name}</MenuItem>
              )) : null
            }
            <MenuItem onClick={addClassClick}>
              <AddCircleIcon className={classes.icon}></AddCircleIcon>
              Add Class
            </MenuItem>
          </Menu>
        </>
        : 
        <Button onClick={addClassClick}  color="inherit">
          <AddCircleIcon className={classes.icon}></AddCircleIcon>
          Add Class
        </Button>
      }
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
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add Class</h2>
            <p id="transition-modal-description">To join a class, please type the exact name of the class in the input below and click submit.</p>
            <p> A class admin will review and approve your request shortly.</p>
            <Typography color="secondary" variant="h6">
              {submitMessage}
            </Typography>

            <form onSubmit={e => handleClassRequestSubmit(e)} className={classes.form} noValidate>
              <TextField
                onChange={e => setClassRequestInputVal(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="className"
                label="Class Name"
                name="className"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>

          </div>
        </Fade>
      </Modal>
    </>
  )
}