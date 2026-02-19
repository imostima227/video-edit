import React,{ useRef, useImperativeHandle, forwardRef } from 'react';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import { setVideoTime } from '@/redux/features/video/videoTimeSlice';
import { timeFormat, timeFormatString, timeToMilliSeconds } from '@api/videoTimeProcess';
import './index.less';
interface TimeSliderProps {
  duration: number,
  onSeek: (time: number) => void,
}

// 定义暴露给父组件的方法接口
export interface TimeSliderRef {
  updateTime: (time: number) => void;
}


const TimeSlider = forwardRef<TimeSliderRef, TimeSliderProps>(({ duration, onSeek }, ref) => {
  const dispatch = useAppDispatch();
  const currentTime = useAppSelector(state => state.videoTime.value);
  const videoItem = useAppSelector(state => state.videoItem.value);
  
  const timeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);    // 滑块 Ref (新增)
  const timeTextRef = useRef<HTMLSpanElement>(null);  // 时间文字 Ref (新增)
  // console.log('render TimeSlider');

  // 暴露给父组件的方法：直接操作 DOM，不触发组件重渲染
  useImperativeHandle(ref, () => ({
    updateTime: (time: number) => {
      // 1. 更新滑块位置
      if (handleRef.current && duration > 0) {
        const percentage = (time / duration) * 100;
        handleRef.current.style.left = `${percentage}%`;
      }
      // 2. 更新时间显示文字
      if (timeTextRef.current) {
        // 复用你原有的时间格式化逻辑
        timeTextRef.current.innerText = timeToMilliSeconds(timeFormatString(timeFormat(time)));
      }
    }
  }));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('click!');
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / progressBar.offsetWidth;
    const seekTime = duration * percentage;
    dispatch(setVideoTime(seekTime));
    onSeek(seekTime);
  };

  const handleMouseDown = (): void => {
    document.onselectstart = () => false;
    document.ondragstart = () => false;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    console.log('move');
    const time = timeRef.current;
    if(time){
      const rect = time.getBoundingClientRect();
      let offsetX = e.clientX - rect.left;
      if(offsetX < 0){
        offsetX = 0;
      } else if(offsetX > time.offsetWidth){
        offsetX = time.offsetWidth;
      }
      const percentage = offsetX / time.offsetWidth;
      const seekTime = duration * percentage;
      dispatch(setVideoTime(seekTime));
      onSeek(seekTime);
    }
  };

  const handleMouseUp = (): void => {
    console.log('mouseup');
    document.onselectstart = null;
    document.ondragstart = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='time-slider'>
      <div className='time-slider__time'>
        <span className='time__currenttime' ref={timeTextRef}>{timeToMilliSeconds(timeFormatString(timeFormat(currentTime)))}</span>
        <span className='time__timedisabled'>{timeToMilliSeconds(timeFormatString(timeFormat(duration)))}</span>
      </div>
      <div className='time-slider' style={{ visibility: videoItem.id === '' ? 'hidden' : 'visible' }}>
        <div className='time-slider__track'
          ref={timeRef}
          onClick={handleClick}>
          <span
            className='time-slider__handerTime'
            ref={handleRef} // 绑定滑块 Ref
            style={{
              left: duration > 0 ? String((currentTime / duration) * 100) + '%' : '0%',
            }}
            onMouseDown={handleMouseDown}></span>
        </div>
      </div>
    </div>
  );
});

TimeSlider.displayName = 'TimeSlider';

export default TimeSlider;
