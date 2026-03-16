import React,{ useRef, useImperativeHandle, forwardRef } from 'react';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import { setVideoTime } from '@/redux/features/video/videoTimeSlice';
import { timeFormat, timeFormatString, timeToMilliSeconds } from '@api/videoTimeProcess';
import './index.less';
interface TimeSliderProps {
  duration: number,
  onSeek: (time: number) => void,
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// 定义暴露给父组件的方法接口
export interface TimeSliderRef {
  updateTime: (time: number) => void;
}


const TimeSlider = forwardRef<TimeSliderRef, TimeSliderProps>(({ duration, onSeek, onDragStart, onDragEnd }, ref) => {
  const dispatch = useAppDispatch();
  const currentTime = useAppSelector(state => state.videoTime.value);
  const videoItem = useAppSelector(state => state.videoItem.value);
  
  const timeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);    // 滑块 Ref (新增)
  const timeTextRef = useRef<HTMLSpanElement>(null);  // 时间文字 Ref (新增)
  const rectRef = useRef<{left: number; width: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  // 用来记录当前是否处于拖拽中，以及拖拽时的临时时间
  const isDragging = useRef(false);
  const dragSeekTime = useRef(0);
  const lastVideoSeekTime = useRef(0); // 用于视频画面更新节流

  // 暴露给父组件的方法：直接操作 DOM，不触发组件重渲染
  useImperativeHandle(ref, () => ({
    updateTime: (time: number) => {
      if (isDragging.current) return;
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
    // console.log('click!');
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

    isDragging.current = true;
    dragSeekTime.current = currentTime;

    onDragStart?.();

    if (timeRef.current) {
      const rect = timeRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        width: timeRef.current.offsetWidth
      };
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    console.log('move');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current;
      if(rect){
        let offsetX = e.clientX - rect.left;
        if(offsetX < 0){
          offsetX = 0;
        } else if(offsetX > rect.width){
          offsetX = rect.width;
        }
        const percentage = offsetX / rect.width;
        const seekTime = duration * percentage;
        dragSeekTime.current = seekTime;

        if (handleRef.current) {
          handleRef.current.style.left = `${percentage * 100}%`;
        }
        if (timeTextRef.current) {
          timeTextRef.current.innerText = timeToMilliSeconds(timeFormatString(timeFormat(seekTime)));
        }

        // 对视频节流
        const now = Date.now();
        if (now - lastVideoSeekTime.current > 30) {
          onSeek(seekTime);
          lastVideoSeekTime.current = now;
        }
      }
    });
  };

  const handleMouseUp = (): void => {
    console.log('mouseup');
    document.onselectstart = null;
    document.ondragstart = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    isDragging.current = false;

    onDragEnd?.();
    dispatch(setVideoTime(dragSeekTime.current));
    onSeek(dragSeekTime.current);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rectRef.current = null; // 清理缓存
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
              // 只有在非拖拽状态下，才使用 Redux 的 currentTime 进行响应式兜底
              left: (duration > 0 && !isDragging.current) ? `${(currentTime / duration) * 100}%` : undefined
            }}
            onMouseDown={handleMouseDown}></span>
        </div>
      </div>
    </div>
  );
});

TimeSlider.displayName = 'TimeSlider';

export default TimeSlider;
