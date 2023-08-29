import React,{ memo,useMemo } from 'react';
import { Dropdown } from 'antd';
import { useAppSelector } from '@/redux/hook';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import { TrackRender } from '@type/track';
import './index.less';



interface TimeLineTrackProps{
  track: TrackRender,
}

const TimeLineTrack: React.FC<TimeLineTrackProps> = ({ track }) => {
  const frameWidth = useAppSelector(state => state.frameWidth.value);
  const timeLineWrapper = useMemo(() => TimeLineWrapper.getInstance(),[]);
  
  const handleClickDelete = () => {
    console.log(track);
    console.log(timeLineWrapper.trackId2Wrapper);
    timeLineWrapper.delTrack(track.id);
  };

  const VideoMenu = () => {
    return (
      <div className='time-line-track__dropdown--video'>
        <div className='dropdown__wrapper--video'>
          <div key="video1" className='dropdown__item--video'>{'复制（Ctrl+C）'} </div>
          <div key="video2" className='dropdown__item--video'>{'剪切（Ctrl+X）'} </div>
          <div
            key="video3"
            style={{ borderBottom: '1px solid #323232', marginBottom: 1 }}
            className='dropdown__item--video'
            onClick={handleClickDelete} >{'删除（BackSpace）'} </div>
          <div key="video4" className='dropdown__item--video'>{'创建编组（Ctrl+G）'} </div>
          <div key="video5" style={{ borderBottom: '1px solid #323232', marginBottom: 1 }} className='dropdown__item--video'>{'解除编组（Shift+Ctrl+G）'} </div>
          <div key="video6" className='dropdown__item--video'>{'分离音频（Shift+Ctrl+S）'} </div>
          <div key="video7" className='dropdown__item--video'>{'字幕识别'} </div>
          <div key="video8" className='dropdown__item--video'>{'旋转'} </div>
          <div key="video9" className='dropdown__item--video'>{'裁剪'} </div>
          <div key="video10" className='dropdown__item--video'>{'镜像'} </div>
          <div key="video11" className='dropdown__item--video'>{'倒放'} </div>
          <div key="video12" className='dropdown__item--video'>{'替换片段'} </div>
        </div>
      </div>
    );
  };

  return (
    <Dropdown
      trigger={['contextMenu']}
      dropdownRender={VideoMenu}>
      <div
        className='time-line-track'
        style={{
          width: track.frames * frameWidth - 1,
          left: track.left * frameWidth,
        }}
        onContextMenu={(e) => {e.stopPropagation();}}>
        <div className={`time-line-track__item--${track.type}`}></div>
      </div>
    </Dropdown>
  );
};

export default memo(TimeLineTrack);
