import React, { useRef,useCallback } from 'react';
import VideoItem from '../VideoItem';
import { useAppDispatch,useAppSelector } from '@/redux/hook';
import { setVideoItem } from '@/redux/features/video/videoItemSlice';
import { setIsPlaying } from '@/redux/features/video/isVideoPlayingSlice';
import { addVideo } from '@/redux/features/video/videoListSlice';
import { getCoverAndDuration } from '@/api/videoTimeProcess';
import VideoList from '@data/VideoList/videolist';
import Video from '@data/Video/video';
import './index.less';

interface MyResBodyProMProps {
  width: number // 指的是父容器的宽度
}

const MyResBodyProM: React.FC<MyResBodyProMProps> = ({ width }) => {
  const videoListCtr = VideoList.getInstance();
  const dispatch = useAppDispatch();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const videoList = useAppSelector(state => state.videoList.value);

  // 点击触发文件上传
  const handleClickUpload = () => {
    if(inputRef.current){
      inputRef.current.click();
    }
  };

  // 触发文件上传时修改视频列表
  const  handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if(files){
      for(let i=0; i<files.length; i++){
        const file = files[i];
        const videoUrl = URL.createObjectURL(file);
        const videoRaw = await getCoverAndDuration(videoUrl);
        const newVideo = new Video(file,videoRaw,videoUrl);
        const renderVideo = await newVideo.getVideoRenderInfo();
        dispatch(addVideo(renderVideo));
        videoListCtr.addLocalVideo(newVideo);
      }
    }

    // 解决重复上传同一文件无法触发 onChange 的问题
    event.target.value = '';
  };

  // 点击选中视频
  const handleClickVideo = useCallback((video: Video | undefined) => {
    if(video){
      // const curVideo = videoListCtr.getVideoById(video.id);
      // console.log('click video:'+curVideo?.file.name);
      // videoList.forEach(el => {
      //   if(el.id === video.id){
      //     dispatch(setVideoItem(el));
      //   }
      // });
      dispatch(setVideoItem({
        id: video.id,
        name: video.file.name, // 确保这里取的是文件名
        videoUrl: video.videoUrl, // 关键！确保这里传入了 blob:http://... 地址
        coverUrl: video.coverUrl,
        duration: video.duration,
      }));

      dispatch(setIsPlaying(true)); // 设置视频为正在播放
    
      // if(curVideo){
      //   dispatch(setFrameWidth(getMinFrameWidth(windowSize.width- 129 - 112 - 10,curVideo.frames)));
      // }
    }
  },[dispatch]);

  return (
    <div className='myresource-body'>
      <div className='myresource-body__media'>
        <section className='myresource-body__section'>
          <div className='section__save_video_list'>
            <div className='section__list'>
              {videoList.map(el => <VideoItem
                key={el.id}
                wrapperWidth={width - 36}
                video={videoListCtr.getVideoById(el.id)}
                onClick={handleClickVideo} />)}
            </div>
          </div>
        </section>
      </div>
      <footer className='myresource-body__footer'>
        <div className='myresource-body__footer-item' onClick={handleClickUpload}>
          <span>本地上传</span>
          <input
            type="file"
            multiple
            style={{ display: 'none' }}
            ref={inputRef}
            onChange={handleFileChange} />
        </div>
        <div className='myresource-body__footer-item'>
          <span>手机上传</span>
        </div>
        <div className='myresource-body__footer-item'>
          <span>录制</span>
        </div>
      </footer>
    </div>
  );
};

export default MyResBodyProM;