import { useEffect, useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import CodeIcon from '@material-ui/icons/Code';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StarDifficulty from "../../components/StarDifficulty";

import API from "../../lib/API";
import UserAndAuthContext from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  backgroundPrimary: {
    backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
    cursor: "pointer"
  },
  none: {
    cursor: "pointer"
  },
  tableCell: {
    fontSize: 18
  },
}));

export default function DashboardList({ setLoading }) {
  const classes = useStyles();

  const history = useHistory();
  const { authToken, currentClass } = useContext(UserAndAuthContext);
  const [problems, setProblems] = useState([]);

  const sortForAirDate = (arr, sortNewestToOldest = true) => {
    let comp1 = -1;
    let comp2 = 1;

    if(!sortNewestToOldest) {
      comp1 = 1;
      comp2 = -1;
    }

    return arr.sort((a, b) => {
      let comparison = 0;

      if (a.airDate > b.airDate) {
        comparison = comp1;
      } else if (a.airDate < b.airDate) {
        comparison = comp2;
      }
      return comparison;
    });
  }

  const getData = async () => {
    if(!currentClass) return console.log("not there")

    try {
      setLoading(true);
      const res = await API.Problems.getProblemsForClassDashboard(authToken, currentClass.id);
      const sortedByAirDate = sortForAirDate(res.data);
      setProblems(sortedByAirDate);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      console.log(err);
    }

  };

  useEffect(() => {
    getData();
  }, [currentClass])

  const rowColor = mod => {
    if(!mod) return classes.none;
    return classes.backgroundPrimary;
  }

  const rowHover = mod => {
    if(!mod) return true;
    return false;
  }

  const handleRowClick = useCallback(e => history.push(`/algo/${e.currentTarget.dataset.id}`), [history]);
  

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}></TableCell>
            <TableCell className={classes.tableCell} align="left">Algorithm</TableCell>
            <TableCell className={classes.tableCell} align="right">Air Date</TableCell>
            <TableCell className={classes.tableCell} align="right">Difficulty</TableCell>
            <TableCell className={classes.tableCell} align="right">Bonus Time Remaining</TableCell>
            <TableCell className={classes.tableCell} align="right">Bonus Modifier</TableCell>
            <TableCell className={classes.tableCell} align="right">Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems.map(problem => (
            <TableRow hover={rowHover(problem.airDateBonusModifier)} className={rowColor(problem.airDateBonusModifier)}
              key={problem.id} data-id={problem.id} onClick={e => handleRowClick(e)}>
              <TableCell className={classes.tableCell}>
                <CodeIcon />
              </TableCell>
              <TableCell className={classes.tableCell} align="left">
                {problem.title}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">{problem.airDate}</TableCell>
              <TableCell className={classes.tableCell} align="right">
                <StarDifficulty numberOfStars={problem.difficulty} />
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                {problem.airDateBonusLength ? `${problem.airDateBonusLength} min` : "none"}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">
                {problem.airDateBonusModifier ? problem.airDateBonusModifier : "none"}
              </TableCell>
              <TableCell className={classes.tableCell} align="right">{problem.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}