import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { format, parseISO, parse } from "date-fns";

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';

import NewAlgoForm from "../../components/NewAlgoForm";
import AdminEditAlgoForm from "../../components/AdminEditAlgoForm";

import API from "../../lib/API";
import UserAndAuthContext from "../../context/AuthContext";

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
    flexGrow: 1
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  fixedHeight: {
    height: 240,
  },
  tableDiv: {
    height: "100%"
  },
  secondSmallPaper: {
    marginTop: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function AdminAlgo() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight, classes.secondSmallPaper);
  const tableDivPaper = clsx(classes.paper, classes.tableDiv);

  const [expanded, setExpanded] = useState(false);
  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [problemsArr, setProblemsArr] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [reRender, setReRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const getProblems = async () => {
    setErrorMsg("");
    try{
      setLoading(true);
      const problemsData = await API.Problems.getProblemsForClass(authToken, currentClass.id)
      setLoading(false);
      const sortForAirDate = problemsData.data.sort((a, b) => {
        let comparison = 0;
  
        if (a.ClassProblem.airDate > b.ClassProblem.airDate) {
          comparison = 1;
        } else if (a.ClassProblem.airDate < b.ClassProblem.airDate) {
          comparison = -1;
        }
        return comparison;
      });
    
      setProblemsArr(sortForAirDate);

    } catch (err) {
      setErrorMsg(err.message)
    };
  }


  useEffect(() => {
    getProblems();
  }, [reRender, currentClass]);



  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }


  return (
        <Container component="main" maxWidth="lg" className={classes.container}>
          <div className={classes.appBarSpacer}></div>
          {loading ? <LinearProgress color="secondary" /> : null}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={12}>
              <Paper className={tableDivPaper}>
                <Accordion expanded={expanded === 'panel0'} onChange={handleAccordionChange('panel0')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className={classes.heading}>Create New Algorithm</Typography>
                    <Typography className={classes.secondaryHeading}></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <NewAlgoForm modalOpen={modalOpen} setModalOpen={setModalOpen}
                      modalTitle={modalTitle} setModalTitle={setModalTitle}
                      modalText={modalText} setModalText={setModalText}
                      setExpanded={setExpanded} setReRender={setReRender}
                      reRender={reRender} setLoading={setLoading}
                    ></NewAlgoForm>
                  </AccordionDetails>
                </Accordion>
                {problemsArr ? problemsArr.map(obj => {
                  if (!obj) return
                  return (
                    <Accordion key={obj.id} expanded={expanded === `panel${obj.id}`} 
                      onChange={handleAccordionChange(`panel${obj.id}`)}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${obj.id}-content`}
                        id={`panel${obj.id}-header`}
                      >
                        <Typography className={classes.heading}>{obj.title}</Typography>
                        <Typography className={classes.secondaryHeading}>
                          Air Date: {format(parseISO(obj.ClassProblem.airDate), "MM-dd-yyyy pp")}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <AdminEditAlgoForm modalOpen={modalOpen} setModalOpen={setModalOpen} title={obj.title}
                          setModalTitle={setModalTitle} setReRender={setReRender} reRender={reRender}
                          setModalText={setModalText} setExpanded={setExpanded} setLoading={setLoading}
                          difficulty={obj.difficulty} airDate={obj.ClassProblem.airDate} airDateTest={parseISO(obj.ClassProblem.airDate)}
                          airDateBonusModifier={obj.ClassProblem.airDateBonusModifier}
                          airDateBonusLength={obj.ClassProblem.airDateBonusLength} directions={obj.description} 
                          starterCode={obj.startingCode} example={obj.Examples[0] ? obj.Examples[0].displayValue : ""}
                          tests={obj.Tests} problemId={obj.id} exampleId={obj.Examples[0] ? obj.Examples[0].id : ""} />
                      </AccordionDetails>
                    </Accordion> 
                  )})
                  :
                  <Typography color="secondary" variant="h6" >{errorMsg}</Typography>
                }
              </Paper>
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
              <div className={classes.paperModal}>
                {/* <h2  id="transition-modal-title">{modalTitle}</h2> */}
                <Typography color="secondary" variant="h6">
                  {modalTitle}
                </Typography>
                {modalText[0] ? 
                  <p id="transition-modal-description">{modalText}</p> : null
                }
              </div>
            </Fade>
          </Modal>
        </Container>
  );
}