import React,{ ReactElement,useEffect,useState,useMemo,memo } from 'react';
import {
  getScaleBase,
  calSmallCellStep,
  calCurScaleTime,
  getTimeLineWidth,
  getMinFrameWidth } from '@api/timeLineProcess';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import TimeLineScrollbar from '../TimeLineScrollbar';
import TimeLineTop from './TimeLineTop';
//import VideoList from '../../../data_manage/VideoList/videolist';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import TimeLineBottom from './TimeLineBottom';
import TimeLineContent from './TimeLineContent';
import { FOOTER_HEADER_HEIGHT, HEADER_HEIGHT, TIMELINE_HEADER_HEIGHT, TRACK_MARGIN } from '@data/Layout/consts';
import { setIsEmpty } from '@/redux/features/timeLine/isEmptySlice';
import { setFrameWidth } from '@/redux/features/timeLine/frameWidthSlice';
import './index.less';
// import {  WindowSizeContext,WindowSizeProps } from '../../Content/context/WindowSizeContext';

interface TimeLineProps {
  wrapperWidth: number,
  height: number,
  setWrapperWidth: React.Dispatch<React.SetStateAction<number>>,
}

// const initialWrapperHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEADER_HEIGHT - TIMELINE_HEADER_HEIGHT;

//注：ruling的刻度不额外占用宽度
const TimeLine: React.FC<TimeLineProps> = ({ wrapperWidth,height,setWrapperWidth }) => {
  // const { state: windowSize }: WindowSizeProps = useContext(WindowSizeContext);
  // const videoListCtr = useMemo(() => VideoList.getInstance(),[]);
  const dispatch = useAppDispatch();
  const timeLineWrapper = useMemo(() => TimeLineWrapper.getInstance(),[]);
  const [offsetX,setOffsetX] = useState(0); //控制刻度尺的移动
  const [scrollHeight,setScrollHeight] = useState(6); //定义底部滚轮的高度
  const wrapperHeight = window.innerHeight - HEADER_HEIGHT - FOOTER_HEADER_HEIGHT - TIMELINE_HEADER_HEIGHT - height;
  //const videoItem = useAppSelector(state => state.videoItem.value);
  const isEmpty = useAppSelector(state => state.isEmpty.value);
  const frameWidth = useAppSelector(state => state.frameWidth.value);
  //const videoInfo = useMemo(() => videoListCtr.getVideoById(videoItem.id),[videoListCtr,videoItem.id]);
  // const maxFrames = useAppSelector(state => state.maxFrames.value);
  const getWrapperWidth  = () => {
    const { innerWidth } = window;
    return innerWidth - 129 - 112 - 10;
  };

  console.log(wrapperHeight);

  const timeLineWidth = getTimeLineWidth(timeLineWrapper.maxFrames,frameWidth); // 轨道占用的最大宽度
  const curScale = getScaleBase(frameWidth);
  const step = calSmallCellStep(frameWidth,curScale); // step表示每小格的像素，得到的step没有考虑刻度占用的1px
  const defaultTotalSteps = Math.floor(wrapperWidth / step + 1); // 轨道上没有资源时的默认小格格数
  const totalSteps = Math.floor((timeLineWidth + wrapperWidth) / step + 1); // 轨道上有资源时的小格格数

  const calActualWidth = () => {
    if(timeLineWidth > wrapperWidth){
      return timeLineWidth + 0.5 * wrapperWidth;
    }
    return timeLineWidth + wrapperWidth;
  };

  const getHandlerWidth = () => {
    // console.log(`wrapperWidth: ${wrapperWidth}`);
    // console.log(`timeLineWidth: ${timeLineWidth}`);
    return wrapperWidth * wrapperWidth / calActualWidth();
  };
  
  useEffect(() => {
    const handleWindowResize = () => {
      setWrapperWidth(getWrapperWidth());
    };

    window.addEventListener('resize', handleWindowResize);

    return ()=>{
      window.removeEventListener('resize',handleWindowResize);
    };
  },[setWrapperWidth,height]);

  useEffect(() => {
    const handleChangeTrackWrapper = (e: Event) => {
      if(!(e instanceof CustomEvent)) return;
      dispatch(setIsEmpty(timeLineWrapper.isEmpty));
      if(timeLineWrapper.isEmpty){
        dispatch(setFrameWidth(0.1));
      } else{
        dispatch(setFrameWidth(getMinFrameWidth(wrapperWidth,timeLineWrapper.maxFrames)));
      }
      // console.log(wrapperWidth,timeLineWrapper.maxFrames);
    };
    document.addEventListener('addtrackwrapper',handleChangeTrackWrapper);
    document.addEventListener('deltrackwrapper',handleChangeTrackWrapper);
    // return document.removeEventListener('addtrack',handleAddTrackWrapper);
  },[dispatch,timeLineWrapper.isEmpty,timeLineWrapper.maxFrames,wrapperWidth]);


  const renderScale = () => {
    const scaleElements: ReactElement[] = [];
    let isLongTick: boolean;
    let curCellNum = 0;
    const tickWidth = step * curScale.cellNums; // 这个地方不需要考虑刻度自带的1px
    //console.log(tickWidth);
    const steps = isEmpty ? defaultTotalSteps : totalSteps;
    for(let i=0; i<steps; i++){
      isLongTick = i % curScale.cellNums === 0; // 判断是否为长刻度
      if(!isLongTick){ // 不是长刻度则直接抛弃
        continue;
      }
      const retTime = calCurScaleTime(curCellNum,curScale);
      const scaleTick: ReactElement = curCellNum === 0 ?
        (
          <span
            key={'scale0'}
            className='time__firstTick'
            style={{ left: - offsetX }}>
          00:00
          </span>) :
        (
          <span
            key={`scale${i}`}
            style={{
              left: `${tickWidth * curCellNum - retTime.leftDec - offsetX}px` }}
            className='time__tick'>
            {retTime.time}
          </span>
        );
      scaleElements.push(scaleTick);
      curCellNum ++;
    }
    return scaleElements;
  };

  const renderRuling = () => {
    const rulingElements: ReactElement[] = [];
    let isLongTick: boolean;
    const steps = isEmpty ? defaultTotalSteps : totalSteps;
    for(let i=0; i<steps; i++){
      isLongTick = i % curScale.cellNums === 0; // 判断是否为长刻度
      const left = i * step;
      const rulingTick: ReactElement = (
        <span
          key={`tick${i}`}
          style={{ left: left - offsetX }}
          className={isLongTick ? 'ruling__long-tick' : 'ruling__short-tick'}>
        </span>
      );

      rulingElements.push(rulingTick);
    }
    return rulingElements;
  };

  const calTrackMargin = () => {
    return isEmpty ? 0 :(timeLineWrapper.getTrackWrapperNum() - 1) * TRACK_MARGIN;
  };

  

  return (
    <div
      id = 'time-line'
      className='time-line'>
      <div className='time-line__wrapper'>
        <div className='time-line__time'>
          {renderScale()}
        </div>
        <div className='time-line__ruling'>
          {renderRuling()}
        </div>
      </div>
      <div
        className='time-line__track-body'
        style={{ height: `calc(100% - 42px - ${scrollHeight}px)` }}>
        <TimeLineTop height={(wrapperHeight - timeLineWrapper.totalHeight - scrollHeight - calTrackMargin())/2}/>
        <TimeLineContent
          height={timeLineWrapper.totalHeight + calTrackMargin()}
          offsetX={offsetX}
          actualWidth={calActualWidth()} />
        <TimeLineBottom height={(wrapperHeight - timeLineWrapper.totalHeight - scrollHeight - calTrackMargin())/2}/>
      </div>
      {
        !isEmpty &&
        <TimeLineScrollbar
          handlerWidth={getHandlerWidth()}
          actualWidth={calActualWidth()}
          wrapperWidth={wrapperWidth}
          scrollHeight={scrollHeight}
          offset={offsetX}
          setOffset={setOffsetX}
          setScrollHeight={setScrollHeight}/>
      }
    </div>
  );
};

export default memo(TimeLine);