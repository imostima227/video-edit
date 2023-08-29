import React, { useState } from 'react';
import Layout2 from '../Layout/LayoutHLC';
import './index.less';

interface DigitalPeopleProps {
  showSpread: boolean
}

// 数字人库

const headerList = ['2D数字人','3D数字人'];
const secondHeaderList = ['全部'];

const DigitalPeople: React.FC<DigitalPeopleProps> = ({ showSpread }) => {
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
      <div className='digital-people'></div>
    </Layout2>
  );
};

export default DigitalPeople;
