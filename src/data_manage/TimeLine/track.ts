import { v4 as uuid } from 'uuid';
import { getFrames } from '@api/timeLineProcess';
import { timeFormat } from '@api/videoTimeProcess';

// 描述轨道的类
class Track{
  id = '';
  type = '';
  left = 0; // 以帧为单位，作为渲染相关的数值时需要乘帧宽度
  duration = -1;
  height = -1;
  frames = -1;
  data: Blob;

  constructor(type: string, data: Blob, duration: number){
    this.id = uuid();
    if(this.isValidType(type)){
      this.type = type;
    }
    this.data = data;
    this.duration = duration;
    this.height = this.calHeight();
    this.frames = getFrames(timeFormat(this.duration));
  }

  private isValidType(type: string){
    return type === 'video' ||
      type === 'audio' ||
      type === 'digital-people' ||
      type === 'pasters' ||
      type === 'fonts' ||
      type === 'caption' ||
      type === 'filter' ||
      type === 'effects';
  }

  private calHeight(){
    switch(this.type){
      case 'video': {
        return 56;
      }
      case 'digital-people': {
        return 40;
      }
      default: {
        return 32;
      }
    }
  }
}

export default Track;