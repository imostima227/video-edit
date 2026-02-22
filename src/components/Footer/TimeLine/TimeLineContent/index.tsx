import React,{ useMemo,useState,useEffect } from 'react';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import TimeLineTrackWrapper from '../TimeLineTrackWrapper';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import './index.less';


interface TimeLineContentProps {
  height: number, // 轨道部分总高度
  offsetX: number, // x偏移，由footer的滚轮确定
  actualWidth: number, // 容器的真实宽度=渲染的宽度+轨道最大宽度
}

const TimeLineContent: React.FC<TimeLineContentProps> = ({ height,offsetX,actualWidth }) => {
  const dispatch = useAppDispatch();
  const timeLineWrapper = useMemo(() => TimeLineWrapper.getInstance(),[]);
  const isEmpty = useAppSelector(state => state.isEmpty.value);
  const [trackMaterialsList,setTrackMaterialsList] = useState(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getMaterials()));
  const [trackMainList,setTrackMainList] = useState(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getMain()));
  const [trackAudioList,setTrackAudioList] = useState(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getAudio()));

  useEffect(() => {
    const update = (blocktype: string) => {
      switch(blocktype){
        case 'main': {
          //console.log(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getMain()));
          setTrackMainList(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getMain()));
          break;
        }
        case 'audio': {
          setTrackAudioList(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getAudio()));
          break;
        }
        case 'materials': {
          setTrackMaterialsList(timeLineWrapper.wrapTrackWrapperList(timeLineWrapper.getMaterials()));
          break;
        }
      }
    };

    const handleChangeTrack = (e: Event) => {
      console.log('enter changeTrackWrapper');
      if(!(e instanceof CustomEvent)) return;
      const data = e.detail;
      // console.log(data);
      update(data.blocktype);
    };

    document.addEventListener('addtrack',handleChangeTrack);
    document.addEventListener('deltrack',handleChangeTrack);
    document.addEventListener('trackupdated', handleChangeTrack);
    return () => {
      document.removeEventListener('addtrack',handleChangeTrack);
      document.removeEventListener('deltrack',handleChangeTrack);
      document.removeEventListener('trackupdated', handleChangeTrack);
    };
  },[dispatch,timeLineWrapper]);

  return (
    <div
      className='time-line-content'
      style={{
        height,
      }}>
      {
        isEmpty ?
          <div className='time-line-content__wrapper--empty'>
            <span className='wrapper--empty__icon-wrapper'>
              <svg className='side-item__icon' aria-hidden='true'>
                <use xlinkHref='#icon-tianjia'></use>
              </svg>
            </span>
            <div className='wrapper--empty__text-wrapper'>
              <span className='wrapper--empty__text'>
                点击这里添加素材，或直接拖放侧边栏媒体素材到这里
              </span>
            </div>
          </div> :
          <div className='time-line-content__wrapper'>
            <div className='wrapper__item' style={{ height: timeLineWrapper.heights[0] }}>
              {
                trackMaterialsList.map((el) => {
                  return <TimeLineTrackWrapper
                    trackWrapper={el}
                    actualWidth={actualWidth}
                    offsetX={offsetX}
                    key={el.id}/>;
                })
              }
            </div>
            <div className='wrapper__item' style={{ height: timeLineWrapper.heights[1] }}>
              {
                trackMainList.map((el) => {
                  return <TimeLineTrackWrapper
                    trackWrapper={el}
                    actualWidth={actualWidth}
                    offsetX={offsetX}
                    key={el.id}/>;
                })
              }
            </div>
            <div className='wrapper__item' style={{ height: timeLineWrapper.heights[2] }}>
              {
                trackAudioList.map((el) => {
                  return <TimeLineTrackWrapper
                    trackWrapper={el}
                    actualWidth={actualWidth}
                    offsetX={offsetX}
                    key={el.id}/>;
                })
              }
            </div>
          </div>
      }
    </div>
  );
};

export default TimeLineContent;