import React from 'react';
import { makeStyles, StyleRules } from '@material-ui/core/styles'
import { QuestType } from '../DBHelper/helper';
import clsx from 'clsx';

const useStyles = makeStyles(() => {
  const colors = [
    ['N', '#5ca6e3'],
    ['H', '#e35875'],
    ['VH', '#a456b9'],
    ['S', '#80e35c']
  ];

  const bgStyles: StyleRules = {};
  for (let color of colors) {
    bgStyles[color[0]] = {
      backgroundColor: color[1],
    };
  }

  return {
    root: {
      display: 'inline-block',
      margin: '0 0 0 0.5em',
      padding: '0 0.25em',
      borderRadius: '0.25em',
      color: '#fff',
    },
    ...bgStyles,
  };
});

interface QuestLabelProps {
  className?: string;
  type: QuestType;
  getLabel?: (type: QuestType) => string;
  component?: React.ElementType;
  [x: string]: any;
}

function QuestLabel(props: QuestLabelProps) {
  const { className, type, getLabel = tyep => type, component: Component = 'span' } = props;
  const styles = useStyles();
  return (
    <Component className={clsx(styles.root, styles[type as keyof typeof styles], className)}>{getLabel(type)}</Component>
  );
}

export default QuestLabel;
