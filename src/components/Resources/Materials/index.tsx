import React, { useState } from 'react';
import Layout4 from '../Layout/LayoutHILCp';
import './index.less';
interface MaterialsProps {
  showSpread: boolean
}

// 在线素材

const headerList = ['视频','制片必备','视频片段','图片'];
const secondHeaderList1 = ['收藏','全部','本季热播','历史好评','影视先锋','口碑剧集','好番推荐','潮流综艺','记录片','其他'];
const secondHeaderList2 = ['收藏','片头','片尾','转场','计时器','背景'];
const secondHeaderList3 = ['收藏','热梗','影视','企业','教育','电商','娱乐','故障','旅行','萌宠','美食','竞技','节日'];
const secondHeaderList4 = ['收藏','新闻','教育','娱乐','企业','生活','电商','旅行','萌宠','食物','植物','艺术','运动','建筑'];

const placeHolder = '搜索模板';

const Materials: React.FC<MaterialsProps> = ({ showSpread }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);

  const selectSecondHeader = () => {
    switch(selectTab){
      case 0:{
        return secondHeaderList1;
      }
      case 1:{
        return secondHeaderList2;
      }
      case 2:{
        return secondHeaderList3;
      }
      case 3:{
        return secondHeaderList4;
      }
      default:{
        return secondHeaderList1;
      }
    }
  };
  return (
    <Layout4
      selectTab={selectTab}
      selectSubTab={selectSubTab}
      showSpread={showSpread}
      placeHolder={placeHolder}
      headerList={headerList}
      setSelectTab={setSelectTab}
      setSelectSubTab={setSelectSubTab}
      secondHeaderList={selectSecondHeader()}
      onSearch={() => {console.log('onSearch');} } >
      <div className='materials'></div>
    </Layout4>
  );
};

export default Materials;
