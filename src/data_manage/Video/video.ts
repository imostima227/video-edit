import { v4 as uuid } from 'uuid';
import { padZero } from '../../api/videoTimeProcess';
import { VideoRawTimeType, VideoRawType, VideoRenderType, VideoTimeType } from '../../types/video';

class Video {
  file: File;
  id = '';
  videoUrl = '';
  coverUrl = '';// 封面图像的url
  duration = -1;// 视频的持续时间
  videoTime!: VideoRawTimeType; //
  frames = -1;// 视频包含的帧数

  constructor(file: File,video: VideoRawType,videoUrl: string){
    this.id = uuid();
    this.file = file;
    this.videoUrl = videoUrl;
    this.duration = video.duration;
    this.coverUrl = video.coverUrl;
    this.videoTime = this.timeFormat();
    this.frames = this.getFrames();
  }

  //初始化
  initialize(){
    this.id = uuid();
    this.videoUrl = URL.createObjectURL(this.file);
  }

  /**
   * 得到视频的帧数
   * @returns 视频的帧数
   */
  getFrames(){
    if(this.frames < 0){
      return this.videoTime.frames + (((this.videoTime.hours * 60) + this.videoTime.minutes) * 60 + this.videoTime.seconds ) * 30;
    }
    return this.frames;
  }

  /**
   * 将时间格式化为时，分，秒，帧（1s是30帧）
   * @returns 含有时，分，秒，帧的对象
   */
  timeFormat(): VideoRawTimeType{
    const frames = Math.floor((this.duration % 1)*1000/(1000/30));
    const hours = Math.floor(this.duration/3600);
    const minutes = Math.floor(this.duration/60%60);
    const seconds = Math.floor(this.duration%60);
    return {
      frames,
      hours,
      minutes,
      seconds,
    };
  }

  /**
   * 将时间格式化为时，分，秒，帧各自的字符串形式
   * @returns 时，分，秒，帧的字符串
   */
  timeFormatString(videoTime: VideoRawTimeType): VideoTimeType{
    return{
      frames: padZero(videoTime.frames),
      hours: padZero(videoTime.hours),
      minutes: padZero(videoTime.minutes),
      seconds: padZero(videoTime.seconds),
    };
  }

  /**
   * 得到需要渲染的信息
   * @returns 渲染的相关信息
   */
  getVideoRenderInfo(): VideoRenderType{
    return {
      id: this.id,
      name:this.file.name,
      videoUrl: this.videoUrl,
      coverUrl: this.coverUrl,
      duration: this.duration,
    };
  }
}

export default Video;