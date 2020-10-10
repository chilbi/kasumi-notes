import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import star0 from '../images/star_0.png';
import star1 from '../images/star_1.png';
import star6 from '../images/star_6.png';

const useStyles = makeStyles(() => {
  const
    rem = 16,
    scalage = 0.75,
    starSize = 24 * scalage / rem;

  return {
    root: {
      display: 'inline-flex',
    },
    star: {
      width: starSize + 'rem',
      height: starSize + 'rem',
      backgroundRepeat: 'no-repeat',
      backgroundSize: starSize + 'rem ' + starSize + 'rem',
    },
    star0: {
      backgroundImage: `url(${star0})`,
    },
    star1: {
      backgroundImage: `url(${star1})`,
    },
    star6: {
      backgroundImage: `url(${star6})`,
    },
  };
});

interface RaritiesProps {
  classes?: Partial<Record<'root' | 'star', string>>;
  maxRarity: number;
  rarity: number;
  onChange?: (e: React.MouseEvent, rarity: number) => void;
}

function Rarities(props: RaritiesProps) {
  const { classes = {}, maxRarity, rarity, onChange } = props;
  const styles = useStyles();

  const starClassNames = Array<string>(maxRarity).fill(styles.star0);
  let i = 0;
  while (i < rarity) {
    starClassNames[i] = styles.star1;
    i++;
  }
  if (rarity === 6) starClassNames[5] = styles.star6;

  return (
    <div className={clsx(styles.root, classes.root)}>
      {starClassNames.map((name, i) => (
        <div key={i} className={clsx(styles.star, classes.star, name)} onClick={onChange && ((e: React.MouseEvent) => onChange(e, i)) } />
      ))}
    </div>
  );
}

export default Rarities;