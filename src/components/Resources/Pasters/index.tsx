import React, { useState } from 'react';
import Layout1 from '../Layout/LayoutHC';
import Layout3 from '../Layout/LayoutHILC';
import './index.less';
interface PastersProps {
  showSpread: boolean
}

// 贴纸库

const headerList = ['贴纸','马赛克'];
const secondHeaderList = ['收藏','热门','视频必备','影视玩梗','特色','企业','教育','电商','标记','弹幕','遮挡','马赛克','表情包','综艺字','边框','氛围','涂鸦'];

const placeHolder = '搜索模板';

const Pasters: React.FC<PastersProps> = ({ showSpread }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);
  return (
    selectTab === 0
      ? (
        <Layout3
          selectTab={selectTab}
          selectSubTab={selectSubTab}
          showSpread={showSpread}
          placeHolder={placeHolder}
          headerList={headerList}
          setSelectTab={setSelectTab}
          setSelectSubTab={setSelectSubTab}
          secondHeaderList={secondHeaderList}
          onSearch={() => {console.log('onSearch');} } >
          <div className='pasters'></div>
        </Layout3>)
      : (
        <Layout1
          selectTab={selectTab}
          headerList={headerList}
          setSelectTab={setSelectTab}>
          <div></div>
        </Layout1>)
  );
};

export default Pasters;
