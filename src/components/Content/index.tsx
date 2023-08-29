import React, { useState } from 'react';
import Footer from '@components/Footer';
import Resources from '@components/Resources';
import Video from '@components/Video';
import WindowSizeProvider from './context/WindowSizeContext';
import './index.less';

const INIT_LEFT_WDITH = 312;
const INIT_UP_HEIGHT = 348;

const Content: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState<number>(INIT_LEFT_WDITH);
  const [upHeight, setUpHeight] = useState<number>(INIT_UP_HEIGHT);
  const [cursor,setCursor] = useState('default');
  return (
    <WindowSizeProvider>
      <div className='content' style={{
        gridTemplateColumns: `${leftWidth >= 312 ? leftWidth: 312 }px auto`,
        gridTemplateRows: `${upHeight}px auto`,
        cursor: cursor,
      }}>
        <Resources width={leftWidth} setWidth={setLeftWidth} setCursor={setCursor}/>
        <Video/>
        <Footer height={upHeight} setHeight={setUpHeight} setCursor={setCursor}/>
      </div>
    </WindowSizeProvider>
  );
};

export default Content;