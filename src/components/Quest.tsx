import { makeStyles, Theme } from '@material-ui/core/styles';
import QuestMapList from './QuestMapList';

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {},
  };
});

function Quest() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <QuestMapList />
    </div>
  );
}

export default Quest;
