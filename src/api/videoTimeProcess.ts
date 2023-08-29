import { VideoTimeType,VideoRawTimeType, VideoRawType } from '@type/video';

/**
   * 异步得到cover和duration
   * @returns cover和duration
   */
export function getCoverAndDuration(videoUrl: string): Promise<VideoRawType> {
  return new Promise((resolve) => {
    let dataUrl = '';
    const video = document.createElement('video');
    video.setAttribute('crossOrigin','anonymous'); // 处理跨域
    video.setAttribute('src',videoUrl);
    video.setAttribute('width', '1280px');
    video.setAttribute('height', '720px');
    video.setAttribute('preload', 'auto');
    video.setAttribute('muted', 'muted');
    video.addEventListener('loadeddata', () => {
      const duration = video.duration;
      const canvas = document.createElement('canvas');
      canvas.width = video.width;
      canvas.height = video.height;
      let containerWidth = canvas.width;
      let containerHeight = canvas.height;

      // 根据视频的长宽对封面进行屏幕自适应
      if(video.videoWidth / video.videoHeight > video.width / video.height){ // 视频源相对更“宽”
        containerWidth = video.width;
        containerHeight = containerWidth * video.videoHeight / video.videoWidth;
      } else { // 视频源相对更“窄”
        containerHeight = video.height;
        containerWidth = containerHeight * video.videoWidth / video.videoHeight;
      }
      const context = canvas.getContext('2d');
      if(containerWidth === canvas.width && containerHeight === canvas.height){
        context?.drawImage(video,0,0,containerWidth,containerHeight);
      } else if(containerWidth === canvas.width){
        const offsetY = (canvas.height - containerHeight) / 2;
        context?.fillRect(0,0,canvas.width,canvas.height); // 黑色背景
        context?.drawImage(video,0,offsetY,containerWidth,containerHeight);
      } else if(containerHeight === canvas.height){
        const offsetX = (canvas.width - containerWidth) / 2;
        // console.log(offsetX);
        context?.fillRect(0,0,canvas.width,canvas.height); // 黑色背景
        context?.drawImage(video,offsetX,0,containerWidth,containerHeight);
      }
      dataUrl = canvas.toDataURL('image/jpeg'); // 转化为base64
      resolve({
        coverUrl: dataUrl,
        duration,
      });
    });
  });
}


/**
 * 将时间格式化为时，分，秒，帧（1s是30帧）
 * @param time 以秒为单位的时间
 * @returns 含有时，分，秒，帧的对象
 */
export function timeFormat(time: number): VideoRawTimeType{
  const frames = Math.floor((time % 1)*1000/(1000/30));
  const hours = Math.floor(time/3600);
  const minutes = Math.floor(time/60%60);
  const seconds = Math.floor(time%60);
  return {
    frames,
    hours,
    minutes,
    seconds,
  };
}

/**
 * 将时，分，秒，帧的数字类转化为字符串类
 * @param format VideoRawTimeType类型的时间
 * @returns VideoTimeType类型的时间
 */
export function timeFormatString(format: VideoRawTimeType): VideoTimeType{
  return{
    frames: padZero(format.frames),
    hours: padZero(format.hours),
    minutes: padZero(format.minutes),
    seconds: padZero(format.seconds),
  };
}

/**
 * 为不足两位的时/分/秒/帧 自动补零
 * @param value 时/分/秒/帧
 * @returns 自动补零后的时/分/秒/帧
 */
export function padZero(value: number): string{
  return value.toString().padStart(2,'0');
}

/**
 * 从videoTimeType格式中提取出“时：分：秒”格式的时间
 * @param videoTime 源数据
 * @returns “时：分：秒”格式的字符串
 */
export function timeToSeconds(videoTime: VideoTimeType): string {
  return videoTime.hours + ':' + videoTime.minutes + ':' + videoTime.seconds;
}

/**
 * 从videoTimeType格式中提取出“时：分：秒：帧”格式的时间
 * @param videoTime 源数据
 * @returns “时：分：秒：帧”格式的字符串
 */
export function timeToMilliSeconds(videoTime: VideoTimeType): string {
  return videoTime.hours + ':' + videoTime.minutes + ':' + videoTime.seconds + ':' + videoTime.frames;
}

/**
 * 将video的curTime减少1帧的时间
 * @param curTime video当前的时间
 * @returns video当前时间减少1帧后的时间
 */
export function decOneFrames(curTime: number): number{
  const intPart = Math.floor(curTime);
  let decPart = curTime % 1;
  decPart = decPart - 1 / 30;
  return intPart + decPart;
}


export function incOneFrames(curTime: number): number{
  const intPart = Math.floor(curTime);
  let decPart = curTime % 1;
  decPart = decPart + 1 / 30;
  return intPart + decPart;
}


