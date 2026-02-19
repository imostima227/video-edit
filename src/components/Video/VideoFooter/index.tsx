import React,{ memo,useCallback } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown,Button } from 'antd';
import IconItem from '../IconItem';
import TimeSlider, { TimeSliderRef } from './TimeSlider'; // 引入 Ref 类型
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { changeIsPlaying } from '@/redux/features/video/isVideoPlayingSlice';
import './index.less';

interface VideoFooterProps {
  duration: number,
  onSeek: (time: number) => void,
  onClickDecFrame: () => void,
  onClickIncFrame: () => void,
  onClickToStart: () => void,
  onClickToEnd: () => void,
  timeSliderRef: React.RefObject<TimeSliderRef>
}

const items1: MenuProps = {
  items: [
    {
      key: '1',
      label: (
        <span>1st menu item</span>
      ),
    },
    {
      key: '2',
      label: (
        <span>2st menu item</span>
      ),
    },
    {
      key: '3',
      label: (
        <span>3st menu item</span>
      ),
    },
  ],
};

const items2: MenuProps = {
  items: [
    {
      key: '1',
      label: (
        <span>1st menu item</span>
      ),
    },
    {
      key: '2',
      label: (
        <span>2st menu item</span>
      ),
    },
    {
      key: '3',
      label: (
        <span>3st menu item</span>
      ),
    },
  ],
};

const VideoFooter: React.FC<VideoFooterProps> = ({
  duration,
  onSeek,
  onClickDecFrame,
  onClickIncFrame,
  onClickToStart,
  onClickToEnd,
  timeSliderRef }) => {
  const dispatch = useAppDispatch();
  const videoItem = useAppSelector(state => state.videoItem.value);
  // console.log('render videofooter');

  const handleClickPlay = useCallback(() => {
    dispatch(changeIsPlaying());
  },[dispatch]);

  return (
    <div className='video-footer'>
      <TimeSlider
        ref={timeSliderRef} // 透传 Ref
        duration={duration}
        onSeek={onSeek}/>
      <div className='video-footer__control'>
        <div className='control__left'>
          <Dropdown menu={items1} placement='topLeft' trigger={['click']} overlayClassName='dropdown'>
            <Button className='control__button'>比例16:9</Button>
          </Dropdown>
          <Dropdown menu={items2} placement='topLeft' trigger={['click']} overlayClassName='dropdown'>
            <Button className='control__button'>倍速1.0x</Button>
          </Dropdown>
        </div>
        <ul className='control__icon-group'>
          <IconItem imgUrl='icon-diyigeshipin' disabled={videoItem.id === ''} onClick={onClickToStart}/>
          <IconItem imgUrl='icon-24gf-backward' disabled={videoItem.id === ''} onClick={onClickDecFrame}/>
          <IconItem imgUrl='icon-bofang' disabled={videoItem.id === ''} onClick={handleClickPlay}/>
          <IconItem imgUrl='icon-24gf-forward' disabled={videoItem.id === ''} onClick={onClickIncFrame}/>
          <IconItem imgUrl='icon-zuihouyigeshipin' disabled={videoItem.id === ''} onClick={onClickToEnd}/>
        </ul>
        <div className='control__right'>
          <button className='control__button'>
            <svg className='icon' aria-hidden='true'>
              <use xlinkHref='#icon-quanping'></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(VideoFooter);