import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Big from 'big.js';
import clsx from 'clsx';
import star0Png from '../images/star_0.png';
import star1Png from '../images/star_1.png';
import star6Png from '../images/star_6.png';

const useStyles = makeStyles(() => {
  const
    rem = 16,
    scalage = 0.75,
    starSize = Big(24).times(scalage).div(rem);

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
      backgroundImage: `url(${star0Png})`,
    },
    star1: {
      backgroundImage: `url(${star1Png})`,
    },
    star6: {
      backgroundImage: `url(${star6Png})`,
    },
    pointer: {
      cursor: 'pointer',
    },
  };
});

interface RaritiesProps {
  rootRef?: React.Ref<HTMLDivElement>;
  classes?: Partial<Record<'root' | 'star', string>>;
  maxRarity: number;
  rarity: number;
  onChange?: (rarity: number) => void;
}

function Rarities(props: RaritiesProps) {
  const { classes = {}, rootRef, maxRarity, rarity, onChange } = props;
  const styles = useStyles();

  const starClassNames = Array<string>(maxRarity).fill(styles.star0);
  let i = 0;
  while (i < rarity) {
    starClassNames[i] = styles.star1;
    i++;
  }
  if (rarity === 6) starClassNames[5] = styles.star6;

  return (
    <div ref={rootRef} className={clsx(styles.root, classes.root)}>
      {starClassNames.map((name, i) => {
        const newRarity = i + 1;
        const isDiff = rarity !== newRarity;
        return (
          <div
            key={i}
            className={clsx(styles.star, onChange && isDiff && styles.pointer, classes.star, name)}
            onClick={onChange && (() => isDiff && onChange(newRarity))}
          />
        );
      })}
    </div>
  );
}

export default Rarities;
