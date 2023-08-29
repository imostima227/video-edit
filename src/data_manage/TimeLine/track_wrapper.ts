import Track from './track';
import { v4 as uuid } from 'uuid';

// 包裹一行轨道的类
class TrackWrapper {
  // blocktype = '';
  id = uuid();
  type = '';
  blocktype = '';
  seq = 0;
  trackList: Track[] = [];
  height = 0;
  totalFrames = 0; // 包括空格
  isVisible = true;
  isMute = false;

  constructor( track: Track,blocktype: string){
    if(this.isValidBlockType(blocktype)){
      this.blocktype = blocktype;
    }
    this.totalFrames = track.frames + track.left;
    this.type = track.type;
    // this.blocktype = blocktype;
    this.height = track.height;
    this.trackList.push(track);
  }

  private isValidBlockType(blocktype: string){
    return blocktype === 'materials' || blocktype === 'main' || blocktype === 'audio';
  }
  
  addTrack(track: Track){
    if(this.type !== track.type){
      return;
    }
    if(track.height > this.height){
      this.height = track.height;
    }
    track.left = this.totalFrames; // 每次在尾部增加轨道
    this.totalFrames += track.frames;
    this.trackList.push(track);
  }

  delTrack(trackId: string){ // 待修改：需要更新totalFrames和height
    let trackIndex = -1;
    let trackItem;
    let flag = false; // 用来记录是否需要更新轨道容器的宽度
    const arr = this.trackList;
    for(let i=0; i<arr.length; i++){
      if(this.trackList[i].id === trackId){
        trackIndex = i;
        trackItem = arr[i];
        arr.splice(i,1);
      }
    }
    if(trackItem){
      if(trackIndex === arr.length){
        if(trackIndex > 0){ // 该容器不是只有这一个轨道
          this.totalFrames = arr[trackIndex - 1].frames + arr[trackIndex - 1].left;
        } else{
          this.totalFrames = 0;
        }
      }
      if(trackItem.height > this.height){
        flag = true;
      }
    }
    if(flag){ // 需要更新高度
      this.height = -1;
      arr.forEach(el => {
        if(el.height > this.height){
          this.height = el.height;
        }
      });
    }
  }
}

export default TrackWrapper;