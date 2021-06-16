import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserAndAuthContext from "../../context/AuthContext";
import API from "../../lib/API";
import { Link } from 'react-router-dom'

import { Button, Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
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

export default function NoClass() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [classRequestInputVal, setClassRequestInputVal] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const { authToken } = useContext(UserAndAuthContext);


  
  const addClassClick = () => {
    setSubmitMessage("");
    setModalOpen(true);
  }

  const handleClassRequestSubmit = async e => {
    e.preventDefault();
    if (!classRequestInputVal) return console.log("nope")
    try {
      const data = await API.JoinRequests.userRequestJoin(authToken, classRequestInputVal)
  
      setSubmitMessage("Your Request Has Been Sent!")
      setTimeout(() => {
        setModalOpen(false);
        setSubmitMessage("");
      }, 1000)
    } catch (err) {
      console.log(err);
      setSubmitMessage("That class does not exist, please try again.")
    }
  }

  return(
    <>
      <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <Button onClick={addClassClick} size="large"  variant="contained" color="primary">
            <AddCircleIcon className={classes.icon} />
            Add Class
          </Button>
        </Grid>
        <Grid item>
          <Button to="/createclass" component={Link} size="large" variant="contained" color="primary">
            <CreateNewFolderIcon className={classes.icon} />
              Create Class
          </Button>
        </Grid>
      </Grid>
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