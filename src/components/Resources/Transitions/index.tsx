import React, { useState } from 'react';
import Layout2 from '../Layout/LayoutHLC';
import './index.less';
interface TransitionsProps {
  showSpread: boolean
}

//转场库

const headerList = ['转场'];
const secondHeaderList = ['基础','幻灯片','遮罩','镜头','特效'];

const Transitions: React.FC<TransitionsProps> = ({ showSpread }) => {
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
      <div className='transitions'></div>
    </Layout2>
  );
};

export default Transitions;
