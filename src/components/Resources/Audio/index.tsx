import React, { useState } from 'react';
import LayoutHILC from '../Layout/LayoutHILC';
import './index.less';
interface AudioProps {
  showSpread: boolean
}

// 在线音频

const headerList = ['音乐','音效'];
const secondHeaderList1 = ['收藏','热门精选','经典回顾','特色','纯音乐','氛围','国风','卡点','动感','励志','舒缓','悲伤','搞怪','美食','时尚','运动','Vlog','旅行','恋爱'];
const secondHeaderList2 = ['收藏','特色','热门','笑声','悬疑','综艺','人声','动物声','动漫','游戏','打斗','魔法','转场','环境','乐器','美食','机械','生活','恶搞','BGM','交通','大自然'];
const placeHolder = '搜索音乐特效';

const Audio: React.FC<AudioProps> = ({ showSpread }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);
  return (
    <LayoutHILC
      selectTab={selectTab}
      selectSubTab={selectSubTab}
      showSpread={showSpread}
      placeHolder={placeHolder}
      headerList={headerList}
      setSelectTab={setSelectTab}
      setSelectSubTab={setSelectSubTab}
      secondHeaderList={selectTab===0 ? secondHeaderList1: secondHeaderList2}
      onSearch={() => {console.log('onSearch');} } >
      <div className='audio'></div>
    </LayoutHILC>
  );
};

export default Audio;
