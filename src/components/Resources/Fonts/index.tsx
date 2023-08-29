import React, { useState } from 'react';
import Layout1 from '../Layout/LayoutHC';
import './index.less';

// 花字库

const headerList = ['花字','文字模板'];

const Fonts: React.FC = () => {
  const [selectTab, setSelectTab] = useState(0);
  return (
    <Layout1
      selectTab={selectTab}
      headerList={headerList}
      setSelectTab={setSelectTab} >
      <div className='fonts'></div>
    </Layout1>
  );
};

export default Fonts;
