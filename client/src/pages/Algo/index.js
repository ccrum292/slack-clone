import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import API from "../../lib/API";

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CorrectAnswer from "../../components/CorrectAnswer";

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

export default function Algo() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeightConsole);
  const tableDivPaper = clsx(classes.paper, classes.grow, classes.secondSmallPaper);
  
  let options = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  }
    
  let { id: pId } = useParams();
  const [codeMirrorValue, setCodeMirrorValue] = useState("// Hello World");
  const [problemId, setProblemId] = useState(pId);
  const [loading, setLoading] = useState(false);
  const [viewOtherAnswers, setViewOtherAnswers] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");
  const [msg, setMsg] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const { user, authToken, currentClass } = useContext(UserAndAuthContext);


  const getData = async () => {
    try {
      setMsg("");
      setLoading(true);
      const data = await API.Problems.getSingleProblem(authToken, currentClass.id, problemId);
      setLoading(false);

      if (!data.data[0]) {
        setTitle("Currently Unavailable");
        setCodeMirrorValue("// Hello World");
        setDescription("");
        setExample("");
        return
      }

      const {title, startingCode, description} = data.data[0]
      setTitle(title);
      setCodeMirrorValue(startingCode);
      setDescription(description);
      setExample(data.data[0].Examples[0].displayValue)
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData()

  }, [currentClass]);

  const getCorrectAnswers = async () => {

    try {
      console.log(problemId);
      const answersData = await API.Answers.getTenCorrectAnswers(authToken, problemId)
      console.log(answersData)
      setCorrectAnswers(answersData.data);
      setViewOtherAnswers(true);
    } catch (err) {
      console.log(err);
    }


  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (title === "Currently Unavailable" && description === "") return setMsg("Submit Denied")
      setMsg("");
      setLoading(true);
      const data = await API.Answers.addAnswer(authToken, codeMirrorValue, user.id, problemId, currentClass.id);
      if (data.data.correctAnswer) {
        const answerData = await getCorrectAnswers();
        currentClass.ClassUser.algorithmsCompleted = currentClass.ClassUser.algorithmsCompleted + 1;
        currentClass.ClassUser.score = data.data.newScore;
        setMsg("Correct, well done!")
      } else if(data.data === "You have already Completed this Algorithm.") {
        setMsg("You have already Completed this Algorithm.")
      } else {
        setMsg("Incorrect, please try again.")
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  
  return (
        <Container component="main" maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer}></div>
          {loading ? <LinearProgress color="secondary" /> : null}
          <Grid container spacing={3} className={classes.outerGrid}>
            <Grid container spacing={3} direction="column" item xs={12} md={7} lg={8}>
              <Grid item>
                <Paper className={fixedHeightPaper}>
                  <CodeMirror
                    autoCursor={false}
                    className={classes.fullCodeMirror}
                    value={codeMirrorValue}
                    options={options}
                    onChange={(editor, data, value) => {
                      setCodeMirrorValue(value);
                    }}
                  />
                </Paper>
              </Grid>
              {viewOtherAnswers ? 
                <Grid item className={classes.grow} container spacing={3} direction="column">
                  <Grid item>
                    <Typography component="h1" variant="h4" gutterBottom>
                      Other Solutions
                    </Typography>
                    <Divider />
                  </Grid>
                  <Grid item container direction="column" spacing={2}>
                    {
                      correctAnswers.map(obj => {
                        if(obj.User.id === user.id) return null;  
                        return (
                          <Grid item>
                            <CorrectAnswer name={obj.User.name} codeMirrorValue={obj.codeText}/>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                </Grid> : null
              }
            </Grid>
            <Grid item xs={12} md={5} lg={4}>             
              <Paper className={fixedHeightPaper}>
                <Grid className={classes.grow} container justify="space-between" direction="column">
                  <Grid item container direction="column" spacing={2}>
                    <Grid item>
                      <Typography component="h1" variant="h4" gutterBottom>
                        {title}
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" gutterBottom>
                        {description}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" gutterBottom>
                        {example}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    {msg[0] ? 
                      <Typography color="secondary" className={classes.mb1} component="h1" variant="h5">
                        {msg}
                      </Typography>: null
                    }

                    <Button fullWidth size="large" variant="contained" color="primary" onClick={e => handleSubmit(e)}>Submit</Button>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
  );
}