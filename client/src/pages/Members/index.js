import React, { useState, useEffect, useContext} from 'react';
import clsx from 'clsx';
import API from '../../lib/API';
import UserAndAuthContext from '../../context/AuthContext';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import AdminStudentTable from '../../components/AdminStudentTable';


const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 480,
  },
  tableDiv: {
    height: "100%"
  },
  secondSmallPaper: {
    marginTop: theme.spacing(2),
  },
  mb1: {
    marginBottom: theme.spacing(1)
  }
}));

export default function Students() {
  const classes = useStyles();

  const { currentClass, authToken } = useContext(UserAndAuthContext);
  const [joinRequests, setJoinRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(false);


  const getData = async () => {
    setLoading(true);
    const joinRequestsData = await API.JoinRequests.getJoinRequestsForAdmin(authToken, currentClass.id)
    setJoinRequests(joinRequestsData.data);
    setLoading(false);
  }


  useEffect(() => {
    getData()
  }, [currentClass]);

  const handleAccept = async e => {
    e.currentTarget.parentElement.remove();
    const res = await API.JoinRequests.adminAcceptJoinRequest(authToken, e.currentTarget.dataset.classid, e.currentTarget.dataset.studentuserid, e.currentTarget.dataset.joinrequestid);
    setReRender(!reRender)
  }

  const handleDecline = async e => {
    e.currentTarget.parentElement.remove();
    const res = await API.JoinRequests.adminDeclineJoinRequest(authToken, e.currentTarget.dataset.classid, e.currentTarget.dataset.joinrequestid);
    setReRender(!reRender)
  }

  return (
        <Container component="main" maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer}></div>
          {loading ? <LinearProgress color="secondary" /> : null}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                <AdminStudentTable reRender={reRender} setReRender={setReRender} setLoading={setLoading} />
            </Grid>
            <Grid item container justify="space-between"  direction="column" xs={12} md={4} lg={3}>
                <Paper className={classes.paper}>
                  <Typography className={classes.mb1} component="h1" variant="h5">
                    Join Requests
                  </Typography>
                  <Divider />
                  <List>
                    { joinRequests ? 
                      joinRequests.map(val => {
                        return (
                          <ListItem key={val.id}>
                            <ListItemText primary={val.userEmail} />
                            <IconButton id="hello" onClick={handleAccept}
                              data-classid={val.ClassId}
                              data-joinrequestid={val.id} 
                              data-studentuserid={val.UserId}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                            <IconButton onClick={handleDecline} data-classid={val.ClassId} data-joinrequestid={val.id}>
                              <ClearIcon />
                            </IconButton>
                          </ListItem>
                        )
                      }) : null
                    }
                  </List>
                </Paper>
            </Grid>
          </Grid>
        </Container>
  );
}