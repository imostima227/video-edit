import React,{ useRef } from 'react';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import { setVideoTime } from '@/redux/features/video/videoTimeSlice';
import { timeFormat, timeFormatString, timeToMilliSeconds } from '@api/videoTimeProcess';
import './index.less';
interface TimeSliderProps {
  duration: number,
  onSeek: (time: number) => void,
}


const TimeSlider: React.FC<TimeSliderProps> = ({ duration,onSeek }) => {
  const dispatch = useAppDispatch();
  const currentTime = useAppSelector(state => state.videoTime.value);
  const videoItem = useAppSelector(state => state.videoItem.value);
  const timeRef = useRef<HTMLDivElement>(null);
  // console.log('render TimeSlider');

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
        <span className='time__currenttime'>{timeToMilliSeconds(timeFormatString(timeFormat(currentTime)))}</span>
        <span className='time__timedisabled'>{timeToMilliSeconds(timeFormatString(timeFormat(duration)))}</span>
      </div>
      <div className='time-slider' style={{ visibility: videoItem.id === '' ? 'hidden' : 'visible' }}>
        <div className='time-slider__track'
          ref={timeRef}
          onClick={handleClick}>
          <span
            className='time-slider__handerTime'
            style={{
              left: String(currentTime / duration * 100) + '%',
            }}
            onMouseDown={handleMouseDown}></span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
