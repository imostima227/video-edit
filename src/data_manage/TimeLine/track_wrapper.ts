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

  recalculate() {
    if (this.trackList.length === 0) {
      this.totalFrames = 0;
      this.height = 0;
      return;
    }

    if (this.blocktype === 'main') {
      // 主轨道磁性吸附
      let currentLeft = 0;
      this.trackList.forEach(track => {
        track.left = currentLeft;
        currentLeft += track.frames;
      });
      this.totalFrames = currentLeft;
    } else {
      // 自由轨道(字幕、音频、特效)允许有空隙，位置由 track.left 绝对决定。
      let maxFrames = 0;
      this.trackList.forEach(track => {
        const rightEdge = track.left + track.frames;
        if (rightEdge > maxFrames) {
          maxFrames = rightEdge;
        }
      });
      this.totalFrames = maxFrames;
    }

    this.height = Math.max(...this.trackList.map(t => t.height));
  }
  
  addTrack(track: Track, insertLeft?: number){
    if(this.type !== track.type){
      return;
    }

    if (this.blocktype === 'main') {
      track.left = this.totalFrames; // 主轨道新轨道直接添加在末尾
    } else {
      track.left = insertLeft !== undefined ? insertLeft : 0;
    }
    this.trackList.push(track);
    this.recalculate();
  }

  delTrack(trackId: string){ // 待修改：需要更新totalFrames和height
    this.trackList = this.trackList.filter(t => t.id !== trackId);
    this.recalculate();
  }

  moveTrack(oldIndex: number, newIndex: number) {
    if (oldIndex < 0 || oldIndex >= this.trackList.length || newIndex < 0 || newIndex >= this.trackList.length) return;
    const [movedTrack] = this.trackList.splice(oldIndex, 1);
    this.trackList.splice(newIndex, 0, movedTrack);
    this.recalculate();
  }
}

export default TrackWrapper;