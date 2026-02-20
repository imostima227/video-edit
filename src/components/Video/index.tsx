import React,{ useRef,useEffect,useState,useCallback } from 'react';
import VideoFooter from './VideoFooter';

import { TimeSliderRef } from './VideoFooter/TimeSlider'; // 引入 Ref 类型
import { changeIsPlaying, setIsPlaying } from '@/redux/features/video/isVideoPlayingSlice';
import { useAppDispatch,useAppSelector } from '@/redux/hook';
import { setVideoTime } from '@/redux/features/video/videoTimeSlice';
import { decOneFrames,incOneFrames } from '@api/videoTimeProcess';
import './index.less';



const Video: React.FC = () => {
  // console.log('render Video');
  const videoItem = useAppSelector(state => state.videoItem.value);
  const isVideoPlaying = useAppSelector(state => state.isVideoPlaying.value);
  const dispatch = useAppDispatch();
  const [videoDuration,setVideoDuration] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerHeight = useRef(0);
  const containerWidth = useRef(0);

  const timeSliderRef = useRef<TimeSliderRef>(null);
  //console.log(windowSize);
  /**
   * 将需要用到canvas和video的各个函数的共有部分提取出来减少代码重复
   * @param fn 需要实现的函数
   */
  const renderBody = (fn: (video: HTMLVideoElement,canvas: HTMLCanvasElement,context: CanvasRenderingContext2D|null) => void) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if(canvas && video){
      const context = canvas.getContext('2d');
      fn(video,canvas,context);
    }
  };

  /**
   * 绘图函数，用来画某一帧
   * @param video video标签
   * @param canvas canvas标签
   * @param context canvas创建的上下文对象
   */
  const drawVideo = async (video: HTMLVideoElement,canvas: HTMLCanvasElement, context: CanvasRenderingContext2D|null) => {
    if(canvas.width === containerWidth.current && canvas.height === containerHeight.current){
      context?.drawImage(video, 0, 0, containerWidth.current, containerHeight.current);
    } else if(canvas.height !== containerHeight.current){
      context?.fillRect(0,0,canvas.width, canvas.height);// 打底的黑色
      const offsetY = (canvas.height - containerHeight.current) / 2;
      context?.drawImage(video, 0, offsetY, containerWidth.current, containerHeight.current);
    } else if(canvas.width !== containerWidth.current){
      context?.fillRect(0,0,canvas.width, canvas.height);// 打底的黑色
      const offsetX = (canvas.width - containerWidth.current) / 2;
      context?.drawImage(video, offsetX, 0, containerWidth.current, containerHeight.current);
    }
  };

  

  const handleSeek =  useCallback((time: number) => {
    renderBody((video) => {
      video.currentTime = time;
    });
  },[]);

  const handleClickDecSecond = useCallback(() => {
    renderBody((video) =>{
      video.pause();
      dispatch(setIsPlaying(false));
      dispatch(setVideoTime(video.currentTime - 1));
      video.currentTime -= 1;
    });
  },[dispatch]);

  const handleClickIncSecond = useCallback(() => {
    renderBody((video) => {
      video.pause();
      video.currentTime += 1;
      dispatch(setIsPlaying(false));
      dispatch(setVideoTime(video.currentTime + 1));
    });
  },[dispatch]);

  const handleClickToStart = useCallback(() => {
    renderBody((video) => {
      video.pause();
      video.currentTime = 0;
      dispatch(setIsPlaying(false));
      dispatch(setVideoTime(0));
    });
  },[dispatch]);

  const handleClickToEnd = useCallback(() => {
    renderBody((video) => {
      video.pause();
      video.currentTime = video.duration;
      dispatch(setIsPlaying(false));
      dispatch(setVideoTime(video.duration));
    });
  },[dispatch]);

  // 视频渲染Loop
  useEffect(() => {
    let animationId: number;
    // let counter = 0;

    const render = () => {
      // counter = (counter + 1) % 1000;
      renderBody((video, canvas, context) => {
        if (canvas && video) {
          drawVideo(video, canvas, context);
          
          if (isVideoPlaying) {
            if (timeSliderRef.current) {
              timeSliderRef.current.updateTime(video.currentTime);
            }
            animationId = requestAnimationFrame(render);
          }
        }
      });
    };
  
    if (isVideoPlaying &&  videoItem.videoUrl) {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { return; });
        }

        animationId = requestAnimationFrame(render);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        dispatch(setVideoTime(videoRef.current.currentTime));
      }
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isVideoPlaying, dispatch, videoItem.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleSeeked = () => {
      if(video && canvas){
        const context = canvas.getContext('2d');
        drawVideo(video,canvas,context);
        dispatch(setVideoTime(video.currentTime));
        // 同时更新 UI
        timeSliderRef.current?.updateTime(video.currentTime);
      }
    };

    if(video){
      video.addEventListener('seeked',handleSeeked);
    }

    return () => {
      if(video){
        video.removeEventListener('seeked',handleSeeked);
      }
    };
  },[videoItem.id,dispatch]);


  // 更改视频源
  useEffect(() =>{
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // console.log(videoItem);
    console.log('Current videoItem:', videoItem);

    if(video && videoItem.id !== ''){
      if (!videoItem.videoUrl) {
        console.error('❌ 错误：尝试播放视频，但 videoUrl 为空！');
        return;
      }

      video.poster = videoItem.coverUrl;
      video.src = videoItem.videoUrl;
      video.pause();
      video.currentTime = 0;
      video.load();
      dispatch(setVideoTime(0));
      setVideoDuration(videoItem.duration);
      timeSliderRef.current?.updateTime(0);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            dispatch(setIsPlaying(true));
          })
          .catch(error => {
            console.error('⚠️ 播放失败，可能是浏览器不支持该格式或 URL 无效:', error);
            console.error('出错的 URL:', videoItem.videoUrl);
            
            dispatch(setIsPlaying(false)); // 停止播放状态
          });
      }
    }
    
    if(videoItem.id === '' && video && canvas){
      const context = canvas.getContext('2d');

      context?.fillRect(0, 0, canvas.width, canvas.height);
      video.src = '';
      video.currentTime = 0;

      dispatch(setIsPlaying(false));

      video.load();
      dispatch(setVideoTime(0));
      setVideoDuration(0);
      timeSliderRef.current?.updateTime(0); // 重置 UI
    }
  },[videoItem,dispatch]);

  // 自适应屏幕
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    const handleLoadedMetaData = () => {
      if(video && canvas){
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // 需要根据视频的长宽进行屏幕的自适应
        if(videoWidth / videoHeight > 1280 / 720){
          containerWidth.current = canvas.width;
          containerHeight.current = containerWidth.current * (videoHeight / videoWidth);
        } else {
          containerHeight.current = canvas.height;
          containerWidth.current = containerHeight.current * (videoWidth / videoHeight);
        }
        
        // console.log(canvas.width);
        // console.log(canvas.height);
        // console.log(containerWidth);
        // console.log(containerHeight);
      }
    };

    if(video){
      video.addEventListener('loadedmetadata', handleLoadedMetaData);
    }

    return () => {
      if(video){
        video.removeEventListener('loadedmetadata',handleLoadedMetaData);
      }
    };
  },[videoItem.id]);

  // 渲染video
  // useEffect(() => {
  //   let animationId: number;
  //   let counter = 0;

  //   const render = () => {
  //     counter = (counter + 1) % 1000;
  //     renderBody((video,canvas,context) => {
  //       if(canvas && video){
  //         drawVideo(video,canvas,context);
          
  //         if(isVideoPlaying){
  //           if(counter % 3 === 0){
  //             dispatch(setVideoTime(video.currentTime)); // videoTime这个状态是给时间滑轮用的
  //           }
  //           animationId = requestAnimationFrame(render);
  //         }
  //       }
  //     });
  //   };
  
  //   if(isVideoPlaying){
  //     if(videoRef.current){
  //       videoRef.current.play();
  //       animationId = requestAnimationFrame(render);
  //     }
  //   } else{
  //     if(videoRef.current){
  //       videoRef.current.pause();
  //     }
  //   }

  //   return () => {
  //     cancelAnimationFrame(animationId);
  //   };
  // },[isVideoPlaying,dispatch]);

  // 处理按键
  useEffect(()=> {
    const handleClickDecFrame = async () => {
      renderBody((video) =>{
        const newTime = decOneFrames(video.currentTime);
        video.pause();
        dispatch(setVideoTime(newTime));
        dispatch(setIsPlaying(false));
        video.currentTime = newTime;
      });
    };
  
    const handleClickIncFrame = () => {
      renderBody((video) => {
        const newTime = incOneFrames(video.currentTime);
        video.pause();
        dispatch(setIsPlaying(false));
        dispatch(setVideoTime(newTime));
        video.currentTime = newTime;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.defaultPrevented) return;
      
      if(videoItem.id !== ''){
        switch(e.key){
          case ' ': {
            e.preventDefault();
            dispatch(changeIsPlaying());
            break;
          }
          case 'ArrowLeft': {
            e.preventDefault();
            handleClickDecFrame();
            break;
          }
          case 'ArrowRight': {
            e.preventDefault();
            handleClickIncFrame();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  },[videoItem.id,dispatch]);


  return (
    <div className='video'>

      <div className='video__player-wrapper'>
        <div className='video__player'>
          <div className='player__monitorContainer'>
            <div className='player__monitorInner'>
              <>
                <video
                  style={{ objectFit: 'contain', display: 'none' }}
                  ref={videoRef}
                  onEnded={() => { dispatch(setIsPlaying(false)); }}
                ></video>
                <canvas
                  id='videoCanvas'
                  width={1280}
                  height={720}
                  style={{ touchAction: 'none', cursor: 'inherit' }}
                  ref={canvasRef}
                  className='player__canvas'
                ></canvas>
              </>
            </div>
          </div>
        </div>
        <VideoFooter
          timeSliderRef={timeSliderRef}
          duration={videoDuration}
          onSeek={handleSeek}
          onClickDecFrame={handleClickDecSecond}
          onClickIncFrame={handleClickIncSecond}
          onClickToStart={handleClickToStart}
          onClickToEnd={handleClickToEnd} />
      </div>
    </div>
  );
};

export default Video;