import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {},
  };
});

interface EquipDetailProps {
  // equipment_id: number;
}

function EquipDetail(props: EquipDetailProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div></div>
    </div>
  );
}

export default EquipDetail;
