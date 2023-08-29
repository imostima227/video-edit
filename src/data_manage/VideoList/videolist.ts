import Video from '../Video/video';

class VideoList {
  private localVideos: Video[] = [];
  private static instance: VideoList;
  num = 0;

  // 单例模式
  static getInstance(){
    if(!VideoList.instance){
      VideoList.instance = new VideoList();
    }
    return VideoList.instance;
  }

  /**
   * 得到本地的视频列表
   * @returns 本地的视频列表
   */
  getLocalVideos(){
    return this.localVideos;
  }
  

  getVideoById(videoId: string): Video|undefined{
    let ret:Video|undefined = undefined;
    this.localVideos.forEach(el => {
      if(el.id === videoId){
        ret = el;
      }
    });
    return ret;
  }

  /**
   * 添加视频文件到列表里面
   * @param file 视频文件
   */
  addLocalVideo(video: Video){
    // console.log(this.localVideos);
    this.localVideos.push(video);
    this.num ++;
  }

  /**
   * 删除视频列表中的某个视频
   * @param video 需要删除的视频（打包后的类型）
   */
  delLocalVideo(videoId: string){
    console.log(this.localVideos);
    this.localVideos.forEach((el,index) => {
      if(el.id === videoId){
        this.localVideos.splice(index,1);
        this.num --;
      }
    });
  }
}

export default VideoList;
