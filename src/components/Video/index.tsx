import React,{ useRef,useEffect,useState,useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Switch } from 'antd'; // UI组件，用于切换
import VideoFooter from './VideoFooter';
import Scene3D from './Scene3D';

import { changeIsPlaying, setIsPlaying } from '@/redux/features/video/isVideoPlayingSlice';
import { useAppDispatch,useAppSelector } from '@/redux/hook';
import { setVideoTime, addVideoFrameTime } from '@/redux/features/video/videoTimeSlice';
import { decOneFrames,incOneFrames } from '@api/videoTimeProcess';
import './index.less';



const Video: React.FC = () => {
  // console.log('render Video');
  const videoItem = useAppSelector(state => state.videoItem.value);
  const isVideoPlaying = useAppSelector(state => state.isVideoPlaying.value);
  const dispatch = useAppDispatch();
  const [videoDuration,setVideoDuration] = useState<number>(0);

  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerHeight = useRef(0);
  const containerWidth = useRef(0);

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
      context?.fillRect(0,0,1280,720);// 打底的黑色
      const offsetY = (canvas.height - containerHeight.current) / 2;
      context?.drawImage(video, 0, offsetY, containerWidth.current, containerHeight.current);
    } else if(canvas.width !== containerWidth.current){
      context?.fillRect(0,0,1280,720);// 打底的黑色
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

  // 3D模式 Loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const loop3D = (time: number) => {
      if (!isVideoPlaying || !is3DMode) return; // 如果不是3D模式，或者暂停了，就不跑这里

      const delta = time - lastTime;
      // 模拟 30 FPS (约 33.33ms)
      if (delta >= 33.33) {
        dispatch(addVideoFrameTime()); // 手动推时间
        lastTime = time;
      }
      animationId = requestAnimationFrame(loop3D);
    };

    if (isVideoPlaying && is3DMode) {
      // 3D 模式播放时，启动这个循环
      lastTime = performance.now();
      animationId = requestAnimationFrame(loop3D);
      
      // 确保视频元素暂停，防止声音干扰
      if (videoRef.current) videoRef.current.pause();
    }

    return () => cancelAnimationFrame(animationId);
  }, [isVideoPlaying, is3DMode, dispatch]);

  // 视频渲染Loop
  useEffect(() => {
    let animationId: number;
    let counter = 0;

    const render = () => {
      // 如果切到了 3D 模式，原来的视频渲染逻辑要停止，否则会抢占资源
      if (is3DMode) return;

      counter = (counter + 1) % 1000;
      renderBody((video, canvas, context) => {
        if (canvas && video) {
          drawVideo(video, canvas, context);
          
          if (isVideoPlaying) {
            if (counter % 3 === 0) {
              dispatch(setVideoTime(video.currentTime));
            }
            animationId = requestAnimationFrame(render);
          }
        }
      });
    };
  
    // 只有在非 3D 模式下，才去操作 video 标签
    if (isVideoPlaying && !is3DMode && videoItem.videoUrl) {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { return; });
        }

        animationId = requestAnimationFrame(render);
      }
    } else {
      // 暂停或 3D 模式下，都要暂停视频标签
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isVideoPlaying, is3DMode, dispatch, videoItem.videoUrl]); // 依赖项加入了 is3DMode

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleSeeked = () => {
      if(video && canvas){
        const context = canvas.getContext('2d');
        drawVideo(video,canvas,context);
        dispatch(setVideoTime(video.currentTime));
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


      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 播放成功，更新状态（如果需要）
            // console.log("✅ 视频开始播放");
          })
          .catch(error => {
            // 3. 捕获 "NotSupportedError" 防止程序崩溃
            console.error('⚠️ 播放失败，可能是浏览器不支持该格式或 URL 无效:', error);
            console.error('出错的 URL:', videoItem.videoUrl);
            
            // 可以在这里提示用户
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
      if(e.defaultPrevented){
        return;
      }
      if(videoItem.id !== ''){
        e.preventDefault();
        switch(e.key){
          case ' ': {
            dispatch(changeIsPlaying());
            break;
          }
          case 'ArrowLeft': {
            handleClickDecFrame();
            break;
          }
          case 'ArrowRight': {
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
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
          <span style={{ color: 'white', marginRight: 8 }}>3D Mode</span>
          <Switch
            checked={is3DMode}
            onChange={(checked) => {
              setIs3DMode(checked);
              dispatch(setIsPlaying(false)); // 切换模式时自动暂停，防止状态混乱
            }}
          />
        </div>
        <div className='video__player'>
          <div className='player__monitorContainer'>
            <div className='player__monitorInner'>
              {/* 条件渲染：
                  is3DMode 为 true 显示 R3F Canvas
                  is3DMode 为 false 显示 原有结构
              */}
              
              {is3DMode ? (
                <div className='player_3d'>
                  <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                    <color attach="background" args={['#1e1e1e']} />
                    <Scene3D />
                    <OrbitControls makeDefault />
                  </Canvas>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
        <VideoFooter
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