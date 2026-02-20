import React,{ useRef,useState,useMemo, memo } from 'react';
import { timeFormat,timeFormatString,timeToSeconds } from '@api/videoTimeProcess';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { delVideo } from '@/redux/features/video/videoListSlice';
import { setVideoItem } from '@/redux/features/video/videoItemSlice';
import VideoList from '@/data_manage/VideoList/videolist';
import type Video from '@/data_manage/Video/video';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import Track from '@data/TimeLine/track';
import './index.less';

interface VideoItemProps {
  wrapperWidth: number,
  video: Video | undefined,
  onClick: (video : Video | undefined) => void,
}

const VideoItem: React.FC<VideoItemProps> = ({ wrapperWidth,video,onClick }) => {
  const videoListCtr = useMemo(() => VideoList.getInstance(),[]); // TODO：疑似存在useMemo滥用，待验证。VideoList是一个单例类，理论上只会实例化一次，但如果组件频繁卸载和挂载，可能会导致实例化多次。可以考虑将VideoList的实例提升到更高的组件层级，或者直接在模块作用域中创建实例，以确保全局唯一。
  const timeLineWrapper = useMemo(() => TimeLineWrapper.getInstance(),[]);
  const curVideoItem = useAppSelector(state => state.videoItem.value);
  const dispatch = useAppDispatch();
  const figWidth = useRef(0);
  // const isEmpty = useAppSelector(state => state.isEmpty.value);
  // const { state: windowSize }: WindowSizeProps = useContext(WindowSizeContext);
  const [isHover,setIsHover] = useState(false);
  const [isHoverDelete,setIsHoverDelete] = useState(false);
  const [isHoverAdd,setIsHoverAdd] = useState(false);
  
  // 每一项的宽度是114px-176px
  const calSecWidth = () => {
    for(let i=2; i<=8; i++){ // 枚举切分次数
      const sectionWidth = wrapperWidth/i;
      if(sectionWidth < 116 || sectionWidth > 177){
        continue;
      }
      figWidth.current = sectionWidth-12-2;
      return sectionWidth-12-2;
    }
    return 0;
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleMouseEnterDelete = () => {
    setIsHoverDelete(true);
  };

  const handleMouseLeaveDelete = () => {
    setIsHoverDelete(false);
  };

  const handleMouseEnterAdd = () => {
    setIsHoverAdd(true);
  };

  const handleMouseLeaveAdd = () => {
    setIsHoverAdd(false);
  };

  const handleClickDelete = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>) => {
    e.stopPropagation(); // 此处要阻止冒泡，不然会触发父容器的点击事件。
    
    if(video){
      if (curVideoItem.id === video.id){
        dispatch(setVideoItem({ id: '', name: '', videoUrl: '', coverUrl: '', duration: -1,
        }));
      }

      videoListCtr.delLocalVideo(video.id);
      dispatch(delVideo(video.id));

      // 删除轨道上对应的视频
      const tracksToDelete: string[] = [];
      // 遍历找出所有来源是该 video.id 的轨道
      timeLineWrapper.trackId2Track.forEach((track, trackId) => {
        if (track.sourceId === video.id) {
          tracksToDelete.push(trackId);
        }
      });
      // 统一触发删除
      tracksToDelete.forEach(trackId => timeLineWrapper.delTrack(trackId));
    }
  };

  const handleClickAddToTrack = (e: React.MouseEvent<HTMLSpanElement,MouseEvent>) => {
    e.stopPropagation();
    if(video){
      const file = video.file;
      const newTrack = new Track('video', file.slice(0,file.size,file.type), video.duration, video.id);
      timeLineWrapper.addTrack(newTrack);
      //dispatch(setIsEmpty(timeLineWrapper.isEmpty));
      //dispatch(setMaxFrames(timeLineWrapper.maxFrames));
      //dispatch(setFrameWidth(getMinFrameWidth(windowSize.width- SIDEBAR_WIDTH - FOOTER_LEFT_WIDTH - TIMELINE_MARIGIN_LEFT,timeLineWrapper.maxFrames)));
      //console.log(timeLineWrapper.maxFrames);
    }
    
    // if(!timeLineWrapper.isEmpty){
    //   const newTrackWrapper = new TrackWrapper('main',);
    // }
    e.stopPropagation();
  };
  
  return (
    <div className='videoitem'>
      <div className='videoitem__image-wrapper'
        style={{ width: String(calSecWidth())+'px',height: String(figWidth.current /1.75)+'px' }}
        onClick={() => onClick(video)}>
        <figure
          className='videoitem__figure'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <img src={video ? video.coverUrl : ''} alt="" className='videoitem__img'/>
          <span className='videoitem__time'>{timeToSeconds(timeFormatString(timeFormat(video ? video.duration : -1)))}</span>
          <div
            className='videoitem__right-top-option'
            style={{ display: isHover? 'flex' : 'none' }}>
            <span
              className={isHoverDelete ? 'right-top-option__delete hover': 'right-top-option__delete'}
              onMouseEnter={handleMouseEnterDelete}
              onMouseLeave={handleMouseLeaveDelete}
              onClick={handleClickDelete}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-shanchu"></use>
              </svg>
            </span>
            <span
              className={isHoverAdd ? 'right-top-option__add hover': 'right-top-option__add'}
              onMouseEnter={handleMouseEnterAdd}
              onMouseLeave={handleMouseLeaveAdd}
              onClick={handleClickAddToTrack}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-tianjia1"></use>
              </svg>
            </span>
          </div>
        </figure>
      </div>
      <div className='videoitem__title-center' style={{ width: String(calSecWidth())+'px' }}>
        <div className='videoitem__title'>
          {video ? video.file.name : ''}
        </div>
      </div>
    </div>
  );
};


export default memo(VideoItem);