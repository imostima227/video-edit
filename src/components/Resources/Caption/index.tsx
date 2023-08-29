import React, { useState } from 'react';
import Layout1 from '../Layout/LayoutHC';
import './index.less';

// 字幕编辑

const headerList = ['字幕内容'];

const Caption: React.FC = () => {
  const [selectTab, setSelectTab] = useState(0);
  return (
    <Layout1
      selectTab={selectTab}
      headerList={headerList}
      setSelectTab={setSelectTab} >
      <div className='caption'></div>
    </Layout1>
  );
};

export default Caption;