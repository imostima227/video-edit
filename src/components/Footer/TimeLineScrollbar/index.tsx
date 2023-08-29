import React,{ useRef,useState,useEffect } from 'react';
import { useAppSelector } from '@/redux/hook';
import './index.less';

interface TimeLineScrollbarProps{
  handlerWidth: number, // 滚轮的宽度
  actualWidth: number, // 时间轴的实际宽度
  wrapperWidth: number, // 时间轴渲染的宽度&滚轮槽的宽度
  scrollHeight: number, // 滚轮的高度
  offset: number,
  setScrollHeight: React.Dispatch<React.SetStateAction<number>>, // 设置滚轮高度
  setOffset: React.Dispatch<React.SetStateAction<number>> // 设置时间轴的偏移
}

const TimeLineScrollbar: React.FC<TimeLineScrollbarProps> = ({ handlerWidth,actualWidth,scrollHeight,wrapperWidth,offset,setOffset,setScrollHeight }) => {
  const [scrollOffset,setScrollOffset] = useState(0);
  const frameWidth = useAppSelector(state => state.frameWidth.value);
  const scrollDec = useRef(0); // 用于记录第一次点击scrollbar时鼠标和bar左侧的像素差
  const isDrag = useRef(false);
  const isHover = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOffset(0);
    setScrollOffset(0);
  },[frameWidth,setOffset]);

  const handleMouseEnter = () => {
    isHover.current = true;
    setScrollHeight(12);
  };

  const handleMouseLeave = () => {
    isHover.current = false;
    if(!isDrag.current){
      setScrollHeight(6);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    //console.log('mousedown');
    e.stopPropagation();
    isDrag.current = true;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    scrollDec.current = e.clientX - rect.left;
    document.onselectstart = () => false;
    document.ondragstart = () => false;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    //console.log('mousemove');
    const scrollbar = wrapperRef.current;
    if(scrollbar){
      const rect = scrollbar.getBoundingClientRect();
      let newScrollOffset = e.clientX - rect.left - scrollDec.current;
      if(newScrollOffset < 0){
        newScrollOffset = 0;
      } else if(newScrollOffset > scrollbar.offsetWidth - handlerWidth){
        newScrollOffset = scrollbar.offsetWidth - handlerWidth;
      }
      //console.log(newScrollOffset);
      setScrollOffset(newScrollOffset);
      setOffset(newScrollOffset / wrapperWidth * actualWidth);
    }
  };

  const handleMouseUp = () => {
    //console.log('mouseup');
    isDrag.current = false;
    if(!isHover.current){
      setScrollHeight(6);
    }
    document.onselectstart = null;
    document.ondragstart = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const scrollbar = wrapperRef.current;
    let newScrollOffset = scrollOffset;
    if(scrollbar){
      console.log('target:',e.clientX);
      console.log('scrollOffset:',newScrollOffset);
      const rect = scrollbar.getBoundingClientRect();
      if(e.clientX - rect.left < scrollOffset){ // 左移
        newScrollOffset = (offset - 29 * frameWidth) * wrapperWidth / actualWidth;
      }else if(e.clientX - rect.left >= scrollOffset + handlerWidth){ // 右移
        newScrollOffset = (offset + 29 * frameWidth) * wrapperWidth / actualWidth;
      }
      if(newScrollOffset < 0){
        newScrollOffset = 0;
      } else if(newScrollOffset > scrollbar.offsetWidth - handlerWidth){
        newScrollOffset = scrollbar.offsetWidth - handlerWidth;
      }
      setScrollOffset(newScrollOffset);
      setOffset(newScrollOffset / wrapperWidth * actualWidth);
    }
  };

  return (
    <div
      className='time-line-scrollbar'
      style={{ height: scrollHeight }}
      ref={wrapperRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div
        className='time-line-scrollbar__handler'
        style={{ width: handlerWidth,left: scrollOffset }}
        onMouseDown={handleMouseDown}>
      </div>
    </div>
  );
};

export default TimeLineScrollbar;