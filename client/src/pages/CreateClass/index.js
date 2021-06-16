import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Redirect } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import API from '../../lib/API';
import UserAndAuthContext from "../../context/AuthContext";
import UserStore from "../../lib/UserStore";



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
  subHeading: {
    margin: theme.spacing(2),
    textAlign: "center"

  },
  appBarSpacer: theme.mixins.toolbar,

}));

export default function CreateClass() {
  const classes = useStyles();
  const location = useLocation();

  const { authToken, setCurrentClass, contextReRender, setContextReRender } = useContext(UserAndAuthContext);

  const [loginMessage, setLoginMessage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useTrilogyDefault, setUseTrilogyDefault] = useState(true);
  
  useEffect(() => {
    if (location.state !== undefined && location.state.registration) {
      setLoginMessage("Registration was Successful, Please Login")
    }

  }, []);


  const handleSubmit = async e => {
    e.preventDefault()

    if (name.length === 0 || description.length === 0) {
      return
    }

    try {
      setLoading(true);
      const res = await API.Classes.createClass(authToken, name, description, useTrilogyDefault);
      console.log(res);
      UserStore.setClassId(res.data[0].id)
      setContextReRender(!contextReRender);
      setLoading(false);
      setRedirect(true);

    } catch (e) {
      setLoginMessage("That name is already taken.");
      setLoading(false);
    }



  }
  

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.appBarSpacer}></div>
      {loading ? <LinearProgress color="secondary" /> : null}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CreateNewFolderIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Class
        </Typography>
        {loginMessage ? 
          <Typography color="secondary" className={classes.subHeading} variant="h6">
            {loginMessage}
          </Typography> : null
        }
        <form onSubmit={e => handleSubmit(e)} className={classes.form} noValidate>
          <TextField
            onChange={e => setName(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Class Name"
            name="class-name"
            autoFocus
          />
          <TextField
            onChange={e => setDescription(e.target.value)}
            variant="outlined"
            required
            fullWidth
            id="description"
            label="Class Description"
            name="description"
            multiline={true}
            rows={3}
          />
          <FormControlLabel
            control={<Checkbox checked={useTrilogyDefault} onChange={e => setUseTrilogyDefault(!useTrilogyDefault)} name="checkedA" />}
            label="Include Trilogy Default Algorithms"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create
          </Button>
        </form>
      </div>
      {redirect ? <Redirect to={{
        pathname: "/adminalgo"
      }} /> : null}
    </Container>
  );
}