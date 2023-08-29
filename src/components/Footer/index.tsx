import React, { useContext, useRef,useState } from 'react';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import { WindowSizeContext,type WindowSizeProps } from '../Content/context/WindowSizeContext';
import './index.less';

interface FooterProps {
  height: number, // content上半部分的高度
  setHeight: React.Dispatch<React.SetStateAction<number>>, // 设置content上半部分的高度
  setCursor: React.Dispatch<React.SetStateAction<string>>,
}

const MAX_HEIGHT = 690;
const MIN_HEIGHT = 348;


const Footer: React.FC<FooterProps> = ({ height, setHeight, setCursor }) => {
  const { state: windowSize }: WindowSizeProps = useContext(WindowSizeContext);
  const [wrapperWidth,setWrapperWidth] = useState(windowSize.width - 129 - 112 - 10);
  const yIndex = useRef(height + 54);
  //console.log('render footer');
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    yIndex.current = e.clientY;
    setCursor('row-resize');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    console.log('mousemove');
    let offsetY = e.clientY - yIndex.current;
    const newHeight =  height + offsetY;
    // 向上拉
    if(offsetY < 0) {
      // 不足最小高度
      if(newHeight < MIN_HEIGHT){
        offsetY = MIN_HEIGHT - height;
        setHeight(MIN_HEIGHT);
      }
      else{
        setHeight(newHeight);
      }
    }
    // 向下拉
    else {
      // 超过了最大高度
      if(newHeight > MAX_HEIGHT){
        offsetY = MAX_HEIGHT - height;
        setHeight(MAX_HEIGHT);
      }
      else{
        setHeight(newHeight);
      }
    }
  };

  const handleMouseUp = (): void => {
    console.log('mouseup');
    // 允许文字选择
    //document.onselectstart = null;
    // 允许元素拖拽
    //document.ondragstart = null;
    setCursor('default');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div className='footer'>
      <section className='footer__wrapper'>
        <div className='footer__timeline'>
          <FooterTop
            wrapperWidth={wrapperWidth}/>
          <FooterBottom
            wrapperWidth={wrapperWidth}
            height={height}
            setWrapperWidth={setWrapperWidth}/>
        </div>
      </section>
      <div className='footer__resizer'
        onMouseDown={e => {handleMouseDown(e);}}/>
    </div>
  );
};

export default Footer;
