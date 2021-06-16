import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles((theme) => ({

}));


export default function StarDifficulty ({ numberOfStars }) {
  const classes = useStyles();
  
  const stars = () => {
    switch (numberOfStars) {
      case 1:
        return (
          <>
            <StarIcon />
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
          </>
        )
      
      case 2:
        return (
          <>
            <StarIcon />
            <StarIcon />
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
          </>
        )

      case 3:
        return (
          <>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarBorderIcon />
            <StarBorderIcon />
          </>
        )
      
      case 4:
        return (
          <>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarBorderIcon />
          </>
        )

      case 5:
        return (
          <>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </>
        )
          
      default: 
        return (
          <>
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
            <StarBorderIcon />
          </>
        )
    }
  }


  return stars();
}