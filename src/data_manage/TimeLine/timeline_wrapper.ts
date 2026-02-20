import TrackWrapper from './track_wrapper';
import Track from './track';
import { TrackRender, TrackWrapperRender } from '@type/track';

// 包裹整个轨道的类
class TimeLineWrapper{
  private static instance: TimeLineWrapper;

  private materials: TrackWrapper[] = [];
  private main: TrackWrapper[] = [];
  private audio: TrackWrapper[] = [];
  private eventnames: string[] = ['addTrack','addTrackWrapper','delTrack','delTrackWrapper'];
  heights: number[] = [0,56,0];
  isEmpty = true;
  //materialsSeq = 0;
  //mainSeq = 0;
  //audioSeq = 0;
  totalHeight = 56; // 初始占用56像素，增减轨道容器时不会低于这个值
  maxFrames = 0;
  trackId2Wrapper = new Map<string,TrackWrapper>(); // 由trackId找到TrackWrapper
  trackId2Track = new Map<string, Track>();
  wrapperId2Wrapper = new Map<string,TrackWrapper>();

  // 发布订阅
  publish(eventname: string,data: TrackWrapper | Track | string,blocktype: string){
    switch(eventname){
      case 'addtrack':{
        if(!(data instanceof Track)){
          return;
        }
        break;
      }
      case 'deltrack':{
        if(typeof data !== 'string'){
          return;
        }
        break;
      }
      case 'addtrackwrapper':{
        if(!(data instanceof TrackWrapper)){
          return;
        }
        break;
      }
      case 'deltrackwrapper':{
        if(typeof data !== 'string'){
          return;
        }
        break;
      }
    }
    const event = new CustomEvent(eventname,{ detail: { data,blocktype }, bubbles: true });
    document.dispatchEvent(event);
  }

  // 单例模式
  static getInstance(){
    if(!TimeLineWrapper.instance){
      TimeLineWrapper.instance = new TimeLineWrapper();
    }
    return TimeLineWrapper.instance;
  }

  getMain(){
    return this.main;
  }

  getMaterials(){
    return this.materials;
  }

  getAudio(){
    return this.audio;
  }

  wrapTrackWrapperList(trackWrapperList: TrackWrapper[]){
    return trackWrapperList.map(el => {
      const item: TrackWrapperRender = {
        id: el.id,
        height: el.height,
        frames: el.totalFrames,
        trackList: el.trackList.map(el => {
          const item: TrackRender = {
            id: el.id,
            sourceId: el.sourceId,
            frames: el.frames,
            left: el.left,
            type: el.type,
          };
          return item;
        })
      };
      return item;
    });
  }

  getTrackWrapperNum(){
    return this.main.length + this.audio.length + this.materials.length;
  }

  private addTrackWrapper(trackWrapper: TrackWrapper,blocktype: string){
    switch(blocktype){
      case 'materials':{
        //trackWrapper.seq = this.materialsSeq ++;
        this.materials.push(trackWrapper);
        this.wrapperId2Wrapper.set(trackWrapper.id,trackWrapper);
        this.totalHeight += trackWrapper.height;
        this.heights[0] += trackWrapper.height;
        this.publish('addtrackwrapper',trackWrapper,'materials');
        break;
      }
      case 'main':{ // main轨道为空才能添加
        if(!this.isEmpty) return;
        //trackWrapper.seq = this.mainSeq ++;
        this.wrapperId2Wrapper.set(trackWrapper.id,trackWrapper);
        this.main.push(trackWrapper);
        this.isEmpty = false;
        //this.totalHeight = trackWrapper.height;
        this.publish('addtrackwrapper',trackWrapper,'main');
        break;
      }
      case 'audio':{
        //trackWrapper.seq = this.audioSeq ++;
        this.audio.push(trackWrapper);
        this.wrapperId2Wrapper.set(trackWrapper.id,trackWrapper);
        this.totalHeight += trackWrapper.height;
        this.heights[2] += trackWrapper.height;
        this.publish('addtrackwrapper',trackWrapper,'audio');
        break;
      }
    }
  }

  private delTrackWrapper(trackWrapper: TrackWrapper,blocktype: string){
    switch(blocktype){
      case 'materials':{
        const arr = this.materials;
        for(let i=0; i<arr.length; i++){
          if(arr[i].id === trackWrapper.id){
            for(let j=i; j<arr.length-1; j++){
              arr[j] = arr[j+1];
              arr[j].seq --;
            }
            arr.pop();
            //this.materialsSeq --;
            this.wrapperId2Wrapper.delete(trackWrapper.id);
            this.totalHeight -= trackWrapper.height;
            this.heights[0] -= trackWrapper.height;
            this.maxFrames = 0;
            this.publish('deltrackwrapper',trackWrapper.id,'materials');
          }
        }
        break;
      }
      case 'main':{
        this.main.pop();
        //this.mainSeq --;
        this.materials = [];
        this.audio = [];
        this.wrapperId2Wrapper.delete(trackWrapper.id);
        //this.materialsSeq = 0;
        //this.audioSeq = 0;
        this.isEmpty = true;
        this.totalHeight = 56;
        this.publish('deltrackwrapper',trackWrapper.id,'main');
        break;
      }
      case 'audio':{
        const arr = this.audio;
        for(let i=0; i<arr.length; i++){
          if(arr[i].id === trackWrapper.id){
            for(let j=i; j<arr.length-1; j++){
              arr[j] = arr[j+1];
              arr[j].seq --;
            }
            arr.pop();
            //this.audioSeq --;
            this.wrapperId2Wrapper.delete(trackWrapper.id);
            this.totalHeight -= trackWrapper.height;
            this.heights[2] -= trackWrapper.height;
            this.publish('deltrackwrapper',trackWrapper.id,'audio');
          }
        }
        break;
      }
    }
  }
  // 目前什么轨道都可以加，没有判断重复
  addTrack(track: Track){
    this.trackId2Track.set(track.id,track);
    switch(track.type){
      case 'video': { // 视频只会添加到主轨道
        if(this.isEmpty){ // 如果主轨道为空
          const newTrackWrapper = new TrackWrapper(track,'main'); // 创建新轨道容器
          this.trackId2Wrapper.set(track.id,newTrackWrapper); // 设置键值对
          this.maxFrames = newTrackWrapper.totalFrames;
          this.addTrackWrapper(newTrackWrapper,'main');
          this.isEmpty = false;
        } else{
          this.main[0].addTrack(track);
          this.trackId2Wrapper.set(track.id,this.main[0]); // 设置键值对
          this.maxFrames = Math.max(this.maxFrames,this.main[0].totalFrames);
        }
        this.publish('addtrack',track,'main');
        break;
      }
      case 'audio': {
        if(this.isEmpty) return;
        if(!this.audio.length){ // 不存在音频轨道
          const newTrackWrapper = new TrackWrapper(track,'audio');
          this.trackId2Wrapper.set(track.id,newTrackWrapper); // 设置键值对
          this.maxFrames = Math.max(this.maxFrames,newTrackWrapper.totalFrames);
          this.addTrackWrapper(newTrackWrapper,'audio');
        } else{ // 存在音频轨道
          this.audio[0].addTrack(track);
          this.trackId2Wrapper.set(track.id,this.audio[0]);
          this.maxFrames = Math.max(this.maxFrames,this.audio[0].totalFrames);
        }
        this.publish('addtrack',track,'audio');
        break;
      }
      default: {
        if(this.isEmpty) return;
        // 寻找是否存在同一type的轨道
        let hasFound = false;
        const arr = this.materials;
        for(let i=0; i<arr.length; i++){
          if(arr[i].type === track.type){
            hasFound = true;
            arr[i].addTrack(track);
            this.trackId2Wrapper.set(track.id,arr[i]);
            this.maxFrames = Math.max(this.maxFrames,arr[i].totalFrames);
          }
        }
        if(!hasFound){ // 没找到同类型的轨道
          const newTrackWrapper = new TrackWrapper(track,'materials');
          this.trackId2Wrapper.set(track.id,newTrackWrapper);
          this.maxFrames = Math.max(this.maxFrames,newTrackWrapper.totalFrames);
          this.addTrackWrapper(newTrackWrapper,'materials');
        }
        this.publish('addtrack',track,'materials');
      }
    }
    console.log(this.trackId2Wrapper);
  }

  delTrack(trackId: string){
    const targetWrapper = this.trackId2Wrapper.get(trackId);
    console.log(this.trackId2Wrapper);
    console.log(targetWrapper);
    if(!targetWrapper) return;
    let flag = false; // 记录是否需要更新maxFrames
    const track = this.trackId2Track.get(trackId);
    if(!track) return;
    switch(track.type){
      case 'video': { //视频也可能从materials中删除
        if(targetWrapper.totalFrames >= this.maxFrames){
          flag = true;
        }
        targetWrapper.delTrack(trackId);
        this.trackId2Wrapper.delete(trackId);
        let blocktype;
        // 需要判断是否为main轨道的track
        if(targetWrapper.id === this.main[0].id){
          blocktype = 'main';
          if(!targetWrapper.trackList.length){ // 删除后为空列表
            this.delTrackWrapper(targetWrapper,'main');
          }
        } else{
          blocktype = 'materials';
          if(!targetWrapper.trackList.length){ // 删除后为空列表
            this.delTrackWrapper(targetWrapper,'materials');
          }
        }
        this.publish('deltrack',trackId,blocktype);
        break;
      }
      case 'audio':{
        if(targetWrapper.totalFrames >= this.maxFrames){
          flag = true;
        }
        targetWrapper.delTrack(trackId);
        this.trackId2Wrapper.delete(trackId);
        if(!targetWrapper.trackList.length){ // 删除后为空列表
          this.delTrackWrapper(targetWrapper,'audio');
        }
        this.publish('deltrack',trackId,'audio');
        break;
      }
      default: {
        if(targetWrapper.totalFrames >= this.maxFrames){
          flag = true;
        }
        targetWrapper.delTrack(track.id);
        this.trackId2Wrapper.delete(trackId);
        if(!targetWrapper.trackList.length){ // 删除后为空列表
          this.delTrackWrapper(targetWrapper,'materials');
        }
        this.publish('deltrack',trackId,'materials');
      }
    }
    if(flag){
      this.main.forEach(el => {
        this.maxFrames = Math.max(this.maxFrames,el.totalFrames);
      });
      this.audio.forEach(el => {
        this.maxFrames = Math.max(this.maxFrames,el.totalFrames);
      });
      this.materials.forEach(el => {
        this.maxFrames = Math.max(this.maxFrames,el.totalFrames);
      });
    }
  }
}

export default TimeLineWrapper;