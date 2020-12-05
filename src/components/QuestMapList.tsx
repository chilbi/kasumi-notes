import { useState, useCallback, useMemo } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Pagination from '@material-ui/core/Pagination';
import QuestDropList from './QuestDropList';
import { mapQuestType, QuestType, Range } from '../DBHelper/helper';
import { maxArea } from '../DBHelper/maxUserProfile';
import localValue from '../localValue';

const useStyles = makeStyles((theme: Theme) => {
  return {
    nav: {
      zIndex: theme.zIndex.appBar,
      position: 'sticky',
      top: '3rem',
      right: 0,
      bottom: 'auto',
      left: 0,
      margin: 0,
      padding: theme.spacing(1),
      backgroundColor: '#fff',
      borderBottom: '1px solid ' + theme.palette.grey[100],
    },
    ul: {
      justifyContent: 'center',
    },
  };
});

interface QuestMapListProps {
  sort: 'asc' | 'desc';
  type: QuestType;
}

function QuestMapList(props: QuestMapListProps) {
  const { sort, type } = props;
  const styles = useStyles();

  const [search, setSearch] = useState<Set<number>>(new Set());
  const handleRewardClick = useCallback((rewardID: number) => {
    setSearch(prev => {
      const newValue = new Set(prev);
      if (newValue.has(rewardID)) newValue.delete(rewardID);
      else newValue.add(rewardID);
      return newValue;
    });
  }, []);

  const [area, setArea] = useState(() => localValue.questMapList.area.get());
  const handleChangeArea = useCallback((e: React.ChangeEvent<unknown>, page: number) => {
    const value = page;
    localValue.questMapList.area.set(value);
    setArea(value);
  }, []);

  const range: Range = useMemo(() => {
    if (type === 'VH' || type === 'S')
      return mapQuestType(type);
    const areaStr = (area < 10 ? '0' : '') + area;
    const typeStr = type === 'N' ? '110' : type === 'H' ? '120' : '130';
    return [parseInt(typeStr + areaStr + '001'), parseInt(typeStr + areaStr + '015')];
  }, [type, area]);

  return (
    <>
      {(type === 'N' || type === 'H') && (
        <Pagination
          classes={{ root: styles.nav, ul: styles.ul }}
          size="small"
          shape="rounded"
          color="primary"
          siblingCount={3}
          boundaryCount={1}
          hidePrevButton
          hideNextButton
          count={maxArea}
          page={area}
          onChange={handleChangeArea}
        />
      )}
      <div>
        <QuestDropList
          sort={sort}
          search={search}
          rangeTypes={range}
          onRewardClick={handleRewardClick}
        />
      </div>
    </>
  );
}

export default QuestMapList;
