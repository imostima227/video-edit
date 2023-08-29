import React, { useState } from 'react';
import Layout2 from '../Layout/LayoutHLC';
import './index.less';

interface EffectsProps {
  showSpread: boolean
}

// 特效库

const headerList = ['特效'];
const secondHeaderList = ['基础','动感','纹理'];

const Effects: React.FC<EffectsProps> = ({ showSpread }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);
  return (
    <Layout2
      selectTab={selectTab}
      selectSubTab={selectSubTab}
      showSpread={showSpread}
      headerList={headerList}
      setSelectTab={setSelectTab}
      setSelectSubTab={setSelectSubTab}
      secondHeaderList={secondHeaderList} >
      <div className='effects'></div>
    </Layout2>
  );
};

export default Effects;
