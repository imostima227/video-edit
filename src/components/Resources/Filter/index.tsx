import React, { useState } from 'react';
import Layout2 from '../Layout/LayoutHLC';
import './index.less';

interface FilterProps {
  showSpread: boolean
}

// 滤镜库

const headerList = ['滤镜'];
const secondHeaderList = ['收藏','复古','电影','美食','灰调','风景','人物','风格','综艺','文艺'];

const Filter: React.FC<FilterProps> = ({ showSpread }) => {
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
      <div className='filter'></div>
    </Layout2>
  );
};

export default Filter;
