import React from 'react';
import Infobar from './Infobar';
import { PCRStoreValue } from '../db';

const defaultProfile: PCRStoreValue<'unit_profile'> = {
  height: '???',
  weight: '???',
  age: '???',
  birth_month: '???',
  birth_day: '???',
  blood_type: '???',
  race: '???',
  guild: '???',
  favorite: '???',
  voice: '???',
} as any;

interface profileProps {
  profile?: PCRStoreValue<'unit_profile'>;
}

function profile(props: profileProps) {
  const { profile = defaultProfile } = props;

  return (
    <>
      <Infobar
        size="medium"
        width={50}
        label="身長"
        value={profile.height + 'cm'}
      />
      <Infobar
        size="medium"
        width={50}
        label="体重"
        value={profile.weight + 'kg'}
      />
      <Infobar
        size="medium"
        width={50}
        label="年齢"
        value={profile.age + '歳'}
      />
      <Infobar
        size="medium"
        width={50}
        label="誕生日"
        value={profile.birth_month + '月' + profile.birth_day + '日'}
      />
      <Infobar
        size="medium"
        width={50}
        label="血液型"
        value={profile.blood_type + '型'}
      />
      <Infobar
        size="medium"
        width={50}
        label="種族"
        value={profile.race}
      />
      <Infobar
        size="medium"
        width={100}
        label="ギルド"
        value={profile.guild}
      />
      <Infobar
        size="medium"
        width={100}
        label="趣味"
        value={profile.favorite}
      />
      <Infobar
        size="medium"
        width={100}
        label="CV"
        value={profile.voice}
      />
    </> 
  );
}

export default profile;
