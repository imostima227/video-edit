import React,{ memo } from 'react';
import TimeLineTrack from '../TimeLineTrack';
import { useAppSelector } from '@/redux/hook';
import { TrackWrapperRender } from '@type/track';
import './index.less';

interface TimeLineTrackWrapperProps{
  trackWrapper: TrackWrapperRender
  actualWidth: number,
  offsetX: number
}

const TimeLineTrackWrapper: React.FC<TimeLineTrackWrapperProps> = ({ trackWrapper,actualWidth,offsetX }) => {
  const frameWidth = useAppSelector(state => state.frameWidth.value);
  // console.log(trackWrapper);
  return (
    <div
      className='time-line-track-wrapper'
      style={{
        height: trackWrapper.height,
      }}>
      <div
        className='time-line-track-wrapper__content'
        style={{
          width: trackWrapper.frames * frameWidth,
          left: -offsetX,
        }}>
        {
          trackWrapper.trackList.map(el => {
            return (
              <TimeLineTrack
                track={el}
                key={el.id}
              />
            );
          })
        }
      </div>
      <div
        className='time-line-track-wrapper__add'
        style={{
          width: actualWidth - trackWrapper.frames * frameWidth,
          left: -offsetX + trackWrapper.frames * frameWidth,
        }}></div>
    </div>
  );
};

export default memo(TimeLineTrackWrapper);