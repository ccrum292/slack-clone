import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format, parseISO, formatISO, parseJSON } from "date-fns";
import API from '../../lib/API';
import UserAndAuthContext from '../../context/AuthContext';
import isJsonStr from "../../lib/isJsonStr";

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {UnControlled as CodeMirror} from 'react-codemirror2';
require('../../lib/codemirrorStyles/codemirror.css');
require('../../lib/codemirrorStyles/material.css');
require('codemirror/mode/javascript/javascript.js');


const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: "100%"
  },
  formSmall: {
    minWidth: 120
  },
  menuItem: {
    padding: 0
  },
  fullCodeMirror: {
    height: "100%",
  },
  boldRed: {
    color: "red"
  },
  smallCodeMirror: {
    height: 60,
  }
}));


export default function AdminEditAlgoForm (props) {
  const classes = useStyles();
  let options = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
  }
  
  const { setModalOpen, setModalTitle, setExpanded, reRender, setReRender, setLoading } = props;
  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [problemId, setProblemId] = useState(props.problemId);
  const [title, setTitle] = useState(props.title);
  const [difficulty, setDifficulty] = useState(props.difficulty);
  const [airDate, setAirDate] = useState(format(parseISO(props.airDate), "yyyy-MM-dd'T'HH:mm:ss"));
  const [airDateBonusModifier, setAirDateBonusModifier] = useState(props.airDateBonusModifier);
  const [bonusDuration, setBonusDuration] = useState(props.airDateBonusLength);
  const [directions, setDirections] = useState(props.directions);
  const [starterCode, setStarterCode] = useState(props.starterCode);
  const [example, setExample] = useState(props.example);
  const [exampleId, setExampleId] = useState(props.exampleId)
  const [inputAndOutputArr, setInputAndOutputArr] = useState(props.tests);
  const [newInputOutputArr, setNewInputOutputArr] = useState([]);
  const [deleteInputOutputArrOfIds, setDeleteInputOutputArrOfIds] = useState([])
  const [input, setInput] = useState("Test Case Input *");
  const [output, setOutput] = useState("Test Case Output *");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteButtonToggle, setDeleteButtonToggle] = useState(false);

  const handleNewAlgorithmFormSubmit = async e => {
    e.preventDefault();
    setErrorMsg("");

    if(!currentClass.id || !title || !directions || starterCode === "Your Starter Code Here *"
      || !inputAndOutputArr[0] || !airDate || !difficulty) {
        setErrorMsg("Please complete all required fields denoted by the *")
        return
      }

    const classProblemObj = {
      airDate: airDate,
      airDateBonusModifier: airDateBonusModifier,
      airDateBonusLength: bonusDuration
    };

    try{
      setLoading(true);
      const updateProblemData = await API.Problems.updateProblem(authToken, currentClass.id, problemId, title, 
        directions, starterCode, difficulty, [example], exampleId, newInputOutputArr, deleteInputOutputArrOfIds, classProblemObj)
      setLoading(false);
      setModalTitle("Algorithm Successfully Updated");
      setModalOpen(true);
      setExpanded(false);
      setReRender(!reRender);

    } catch (err) {
      console.log(err);
    }



  };

  const handleProblemDelete = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const deletionData = await API.Problems.deleteProblemFromClass(authToken, currentClass.id, problemId);
      setLoading(false);
      setModalTitle("Algorithm Successfully Deleted from Class");
      setModalOpen(true);
      setExpanded(false);
      setReRender(!reRender);

    } catch (err) {
      console.log(err);
    }

  }

  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
  }

  const checkIfTestIsProperFormat = val => {
    if (!isJsonStr(val)) return false;
    if (Object.prototype.toString.call(JSON.parse(val)) !== '[object Array]') return false;
    return true;
  };

  const handleInputOutputSave = () => {
    if (!checkIfTestIsProperFormat(input)) {
      setErrorMsg("Please enter your input arguments as an array of arguments, thank you.")
      setInput("Test Case Input *");
      setOutput("Test Case Output *");  
      return
    }

    const val =  {
      input: input,
      output: output,
    }

    setNewInputOutputArr([...newInputOutputArr, val]);
    setInputAndOutputArr([...inputAndOutputArr, val]);
    setErrorMsg("");
    setInput("Test Case Input *");
    setOutput("Test Case Output *");
  };

  const handleInputOutputDelete = e => {
    const newInputOutputArr = inputAndOutputArr.filter(obj => {
      if (obj.input !== e.currentTarget.dataset.input || obj.output !== e.currentTarget.dataset.output) return true;
    })
    setInputAndOutputArr(newInputOutputArr);
    if (e.currentTarget.dataset.id) setDeleteInputOutputArrOfIds([...deleteInputOutputArrOfIds, e.currentTarget.dataset.id]);
  };

  return(
    <form onSubmit={e => handleNewAlgorithmFormSubmit(e)} className={classes.form} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <TextField 
            onChange={e => setTitle(e.target.value)}
            name="createTitle"
            variant="outlined"
            required
            fullWidth
            id="createTitle"
            label="Algo Title"
            autoFocus
            defaultValue={title}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl required variant="outlined" className={classes.formControl}>
            <InputLabel id="difficultyInput">Difficulty</InputLabel>
            <Select
              labelId="difficultyInput"
              id="difficultyOutline"
              value={difficulty}
              onChange={handleDifficultyChange}
              label="Difficulty"
              defaultValue={difficulty}
            >
              <MenuItem value={1}>
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={2}>
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={3}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={4}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarBorderIcon />
              </MenuItem>
              <MenuItem value={5}>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            required
            id="datetime-local"
            label="Air Date"
            type="datetime-local"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => {
              setAirDate(e.target.value)
            }}
            defaultValue={airDate}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="airDateModifier">Air Date Bonus</InputLabel>
            <Select
              labelId="airDateModifier"
              id="airDateModifierBonus"
              value={airDateBonusModifier}
              onChange={e => setAirDateBonusModifier(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value={1}>None</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="bonusDuration">Bonus Duration</InputLabel>
            <Select
              labelId="bunusDuration"
              id="bonusDurationInMinutes"
              value={bonusDuration}
              onChange={e => setBonusDuration(e.target.value)}
              label=""
            >
              <MenuItem value={0}>None</MenuItem>
              <MenuItem value={5}>5 minutes</MenuItem>
              <MenuItem value={10}>10 minutes</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={20}>20 minutes</MenuItem>
              <MenuItem value={25}>25 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={45}>45 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
              <MenuItem value={180}>3 hours</MenuItem>
              <MenuItem value={1440}>1 day</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => setDirections(e.target.value)}
            variant="outlined"
            required
            fullWidth
            id="directions"
            label="Directions"
            name="directions"
            multiline={true}
            rows={5}
            defaultValue={directions}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CodeMirror
            autoCursor={false}
            className={classes.fullCodeMirror}
            value={starterCode}
            options={options}
            onChange={(editor, data, value) => {
              setStarterCode(value);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
              onChange={e => setExample(e.target.value)}
              variant="outlined"
              fullWidth
              id="exampleInputAndOutput"
              label="Displayed Example Input and Output"
              name="exampleInputAndOutput"
              multiline={true}
              rows={3}
              defaultValue={example}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <CodeMirror
              autoCursor={false}
              className={classes.smallCodeMirror}
              value={input}
              options={options}
              onChange={(editor, data, value) => {
                setInput(value);
              }}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <CodeMirror
              autoCursor={false}
              className={classes.smallCodeMirror}
              value={output}
              options={options}
              onChange={(editor, data, value) => {
                setOutput(value);
              }}
            />
        </Grid>
        <Grid item container justify="center" alignItems="center"  xs={12} md={2}>
          <Button
          variant="contained"
          color="primary"
          onClick={handleInputOutputSave}
          >
            Add Test Case
          </Button>
        </Grid>
        <Grid item xs={12}>
          <List
          aria-labelledby="test-cases"
          subheader={
            <ListSubheader id="test-cases">
              List of Test Cases
            </ListSubheader>
          }
          >
            <Divider />
            {inputAndOutputArr[0] ? inputAndOutputArr.map((val, i) => (
              <>
                <ListItem key={i}>
                  <ListItemText primary={`Input: ${val.input}`} />
                  <ListItemText primary={`Output: ${val.output}`} />
                  <IconButton data-id={val.id} data-input={val.input} data-output={val.output} 
                    onClick={handleInputOutputDelete}>
                    <ClearIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </>
            )) :

              <ListItem>
                <ListItemText className={classes.boldRed}  primary="Empty *" />
              </ListItem>
            }
          </List>
        </Grid>
        <Grid item>
          <Typography color="secondary" variant="h6">
              {errorMsg}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={e => setDeleteButtonToggle(true)}
          >
            Delete
          </Button>
        </Grid>
        { deleteButtonToggle ?
          <Grid item xs={12} container justify="space-evenly" alignItems="center"  xs={12} spacing={2}>
            <Typography color="secondary" variant="h6">
              Are You Sure you Want to Delete?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={e => handleProblemDelete(e)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={e => setDeleteButtonToggle(false)}
            >
              No
            </Button>
          </Grid> : null
        }
      </Grid>
    </form>
  )
}