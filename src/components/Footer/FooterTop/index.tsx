import React, { useState,useEffect,useCallback,memo,useRef, useMemo } from 'react';
import { Space,Slider } from 'antd';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import FooterIconItem from './FooterIconItem';
import {
  getMinFrameWidth,
  getScaleBase,
  sliderValue2FrameWidth } from '@api/timeLineProcess';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import { setFrameWidth } from '@/redux/features/timeLine/frameWidthSlice';
import './index.less';


interface FooterTopProps {
  wrapperWidth: number,
}

const leftIcons = ['24gf-pointer','chexiao','zhongzuo','shipinfenge','fuzhi','shanchu'];
const rightIcons = ['huchifuwu','liandong','timeline-fill','cixi','suoxiao'];


const FooterTop: React.FC<FooterTopProps> = ({ wrapperWidth }) => {
  const timeLineWrapper = useMemo(() => TimeLineWrapper.getInstance(),[]);
  const dispatch = useAppDispatch();
  const isEmpty = useAppSelector(state => state.isEmpty.value);
  // const maxFrames = useAppSelector(state => state.maxFrames.value);
  const calMinFrameWidth = useCallback((): number => {
    if(!isEmpty){
      // console.log(getMinFrameWidth(wrapperWidth,timeLineWrapper.maxFrames));
      return getMinFrameWidth(wrapperWidth,timeLineWrapper.maxFrames);
    }
    else{
      return 0.1;
    }
  },[isEmpty,timeLineWrapper.maxFrames,wrapperWidth]);
  
  const minFrameWidth = useMemo(() => calMinFrameWidth(),[calMinFrameWidth]); // 最小帧宽度
  const minScaleBase = useMemo(() => getScaleBase(minFrameWidth),[minFrameWidth]);
  const step =100 / (minScaleBase.index + 1); // 滚动帧滑轮的step
  const calStep = 100 / minScaleBase.index; // 用于增减按钮的step
  const [sliderValue,setSliderValue] = useState(0);
  const isMax = useRef(false);
  const isMin = useRef(false);
  // console.log('render Footertop');

  // slider滑动时改变帧宽度
  const handleChange = useCallback((value: number) => {
    const newFrameWidth = sliderValue2FrameWidth(value,minScaleBase.index,step,minFrameWidth);
    setSliderValue(value);
    if(value <= 0){
      isMin.current = true;
    } else if(value >= 100){
      isMax.current = true;
    } else{
      isMax.current = false;
      isMin.current = false;
    }
    dispatch(setFrameWidth(newFrameWidth));
  },[dispatch, minFrameWidth,minScaleBase.index,step]);

  //增加frameWidth按钮
  const handleAddFrameWidth = useCallback(() => {
    if(isMax.current) return;
    isMin.current = false;
    console.log('enterAddFrame');
    const newValue = sliderValue + calStep;
    if(newValue < 100){
      setSliderValue(newValue);
      dispatch(setFrameWidth(sliderValue2FrameWidth(newValue,minScaleBase.index,step,minFrameWidth)));
    }
    else{
      isMax.current = false;
      setSliderValue(100);
      dispatch(setFrameWidth(50));
    }
  },[calStep,dispatch,minFrameWidth,minScaleBase.index,sliderValue,step]);

  //减少frameWidth按钮
  const handleSubFrameWidth = useCallback(() => {
    if(isMin.current) return;
    isMax.current = false;
    console.log('enterSubFrame');
    const newValue = sliderValue - calStep;
    if(newValue > 0){
      setSliderValue(newValue);
      dispatch(setFrameWidth(sliderValue2FrameWidth(newValue,minScaleBase.index,step,minFrameWidth)));
    }
    else{
      isMin.current = false;
      setSliderValue(0);
      dispatch(setFrameWidth(minFrameWidth));
    }
  },[calStep,dispatch,minFrameWidth,minScaleBase.index,sliderValue,step]);

  useEffect(() => {
    isMax.current = false;
    isMin.current = false;
  },[timeLineWrapper.maxFrames]);

  return (
    <div className='footer-top'>
      <div className='footer-top__bar'>
        <Space style={{ columnGap: 10 }}>
          {
            leftIcons.map((el) => {
              return (
                <FooterIconItem imgName={el} key={`leftIcons${el}`}/>
              );
            })
          }
        </Space>
        <Space style={{ columnGap: 10 }}>
          {
            rightIcons.map((el) => {
              return (
                <FooterIconItem imgName={el} key={`rightIcons${el}`}/>
              );
            })
          }
          <FooterIconItem
            imgName='jian'
            disabled={isEmpty || isMin.current}
            onClick={handleSubFrameWidth}/>
          <Slider
            min={0}
            max={100}
            value={sliderValue}
            disabled = {isEmpty}
            style={{ width: '100px' }}
            tooltip={{ open: false }}
            onChange={handleChange}/>
          <FooterIconItem
            imgName='tianjia1'
            disabled={isEmpty || isMax.current}
            onClick={handleAddFrameWidth}/>
        </Space>
      </div>
    </div>
  );
};

export default memo(FooterTop);