import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import API from "../../lib/API";
import { format, parseISO } from "date-fns";

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {UnControlled as CodeMirror} from 'react-codemirror2';
import UserAndAuthContext from '../../context/AuthContext';
require('../../lib/codemirrorStyles/codemirror.css');
require('../../lib/codemirrorStyles/material.css');
require('codemirror/mode/javascript/javascript.js');



const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  outerGrid: {
    height: 600
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
  fixedHeightConsole: {
    height: 360,
  },
  grow: {
    flexGrow: 1,
  },
  secondSmallPaper: {
    marginTop: theme.spacing(2),
  },
  fullCodeMirror: {
    height: "100%"
  },
  mb1: {
    marginBottom: theme.spacing(1)
  }
}));

export default function Completed() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeightConsole);
  const tableDivPaper = clsx(classes.paper, classes.grow, classes.secondSmallPaper);
  
  let options = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  }
    
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [problemId, setProblemId] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [answerData, setAnswerData] = useState(null);

  const [otherAnswerDataLg, setOtherAnswerDataLg] = useState(null);
  const [currentOtherAnswerData, setCurrentOtherAnswersData] = useState(null);

  const { user, authToken, currentClass } = useContext(UserAndAuthContext);


  const getData = async () => {
    try {
      setMsg("");
      setLoading(true);
      const data = await API.Answers.getMyAnswers(authToken, currentClass.id);
      setAnswerData(data.data);
      setCurrentProblem(data.data[0]);
      setProblemId(data.data[0].ProblemId);
      const otherAnswersData = await API.Answers.getTenCorrectAnswers(authToken, data.data[0].ProblemId)
      setOtherAnswerDataLg([otherAnswersData.data])
      setCurrentOtherAnswersData(otherAnswersData.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData()

  }, [currentClass]);
  

  const handleClick = async e => {
    e.stopPropagation();
    const newId = parseInt(e.currentTarget.dataset.problemid);
    setProblemId(newId);
    const newProblem = answerData.filter(obj => obj.ProblemId === newId);
    setCurrentProblem(newProblem[0]);

    const filterForNewId = otherAnswerDataLg.filter(arr => arr[0].ProblemId === newId);
    if (filterForNewId[0]) {
      setCurrentOtherAnswersData(filterForNewId[0]);
      return;
    }

    try {
      setLoading(true);

      const data = await API.Answers.getTenCorrectAnswers(authToken, newId);
      setOtherAnswerDataLg([...otherAnswerDataLg, data.data]);
      setCurrentOtherAnswersData(data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <Container component="main" maxWidth="lg" className={classes.container}>
    <div className={classes.appBarSpacer}></div>
    {loading ? <LinearProgress color="secondary" /> : null}
    <Grid container spacing={3} className={classes.outerGrid}>
      <Grid item xs={12} md={5} lg={3}>             
        <Paper className={fixedHeightPaper}>
            <Grid container direction="column" >
              <Grid item>
                <Typography component="h1" variant="h5" gutterBottom>
                  Completed Algorithms
                </Typography>
                <Divider />
              </Grid>
              <Grid>
                <List>
                {answerData ? 
                  answerData.map(val => (
                    <ListItem 
                      button key={val.ProblemId}
                      data-problemid={val.ProblemId}
                      onClick={handleClick}
                    >
                      <ListItemText primary={val.Problem.title} />
                    </ListItem>
                  )) : null
                }
                </List>
              </Grid>
            </Grid>
        </Paper>
      </Grid>
      <Grid container spacing={3} direction="column" item xs={12} md={7} lg={9}>
        <Grid item>
          <Paper className={classes.paper}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography component="h1" variant="h4" gutterBottom>
                  {currentProblem ? currentProblem.Problem.title : "None"}
                </Typography>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="body1" gutterBottom>
                  {currentProblem ? currentProblem.Problem.description : null}
                </Typography>
              </Grid>
            </Grid>

          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.paper}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography component="h1" variant="h6" gutterBottom>
                  {currentProblem ? 
                    `Written by you on ${format(parseISO(currentProblem.Problem.Answers[0].createdAt), "E, MMM do, yyyy")}` 
                    : "none"
                  }
        
                </Typography>
              </Grid>
              <Grid item>
                <CodeMirror
                  autoCursor={false}
                  className={classes.fullCodeMirror}
                  value={currentProblem ? currentProblem.Problem.Answers[0].codeText: "// Hello"}
                  options={options}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid> 
          <Grid item className={classes.grow} container spacing={3} direction="column">
            <Grid item>
              <Typography component="h1" variant="h4" gutterBottom>
                Other Solutions
              </Typography>
              <Divider />
            </Grid>
            <Grid item container direction="column" spacing={2}>
              {currentOtherAnswerData ? currentOtherAnswerData.map(obj =>{ 
                if (obj.User.id === user.id) return null;
                return  (
                  <Grid item>
                    <Paper className={classes.paper}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <Typography variant="body1" gutterBottom>
                            {currentProblem ? 
                              `Written by ${obj.User.name} on ${format(parseISO(obj.createdAt), "E, MMM do, yyyy")}` 
                              : "none"
                            }
                          </Typography>
                        </Grid>
                        <Grid item>
                          <CodeMirror
                            autoCursor={false}
                            className={classes.fullCodeMirror}
                            value={obj.codeText}
                            options={options}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>)
              }) : null
              }
            </Grid>
          </Grid>
        
      </Grid>
    </Grid>
  </Container>
);
}