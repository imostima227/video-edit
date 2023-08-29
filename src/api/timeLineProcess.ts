import { ScaleBaseType,ScaleTimeType } from '@type/timeline';
import { timeLineScales } from '@data/TimeLine/data';
import { padZero } from '@api/videoTimeProcess';
import { VideoRawTimeType } from '@type/video';
export const MAX_FRAME_WIDTH = 50;

/**
 * 得到帧数
 * @param time 格式化的时间
 * @returns 帧数
 */
export function getFrames(time: VideoRawTimeType): number{
  return time.frames + (((time.hours * 60) + time.minutes) * 60 + time.seconds ) * 30;
}

/**
 * 得到最小帧宽度
 * @param width 时间轴的显示宽度
 * @param frames 视频的帧数
 * @returns 最小帧宽度
 */
export function getMinFrameWidth(width: number,frames: number): number{
  return width / 2 / frames;
}

/**
 * 得到刻度单位以及大小
 * @param frameWidth 帧宽度
 * @returns 刻度的数据格式
 */
export function getScaleBase(frameWidth: number): ScaleBaseType{
  if(frameWidth > MAX_FRAME_WIDTH) frameWidth = MAX_FRAME_WIDTH; // 限制取值
  if(frameWidth <= 50 && frameWidth > 33.3333){
    return timeLineScales[0];
  } else if(frameWidth <=100/3 && frameWidth > 20){
    return timeLineScales[1];
  } else if(frameWidth <= 20 && frameWidth > 10){
    return timeLineScales[2];
  } else if(frameWidth <= 10 && frameWidth > 20/3){
    return timeLineScales[3];
  } else if(frameWidth <= 20/3 && frameWidth > 10/3){
    return timeLineScales[4];
  } else if(frameWidth <= 10/3 && frameWidth > 5/3){
    return timeLineScales[5];
  } else if(frameWidth <=5/3 && frameWidth > 10/9){
    return timeLineScales[6];
  } else if(frameWidth <= 10/9 && frameWidth > 2/3){
    return timeLineScales[7];
  } else if(frameWidth <= 2/3 && frameWidth > 1/3){
    return timeLineScales[8];
  } else if(frameWidth <= 1/3 && frameWidth > 1/6){
    return timeLineScales[9];
  } else if(frameWidth <= 1/6 && frameWidth > 1/9){
    return timeLineScales[10];
  } else if(frameWidth <= 1/9 && frameWidth > 1/12){
    return timeLineScales[11];
  } else if(frameWidth <= 1/12 && frameWidth > 1/24){
    return timeLineScales[12];
  } else if(frameWidth <= 1/24 && frameWidth > 1/48){
    return timeLineScales[13];
  } else if(frameWidth <= 1/48 && frameWidth > 1/96){
    return timeLineScales[14];
  } else if(frameWidth <= 1/96 && frameWidth > 1/192){
    return timeLineScales[15];
  }
  else return timeLineScales[11];
}

/**
 * 计算每小格的长度(px)
 * @param frameWidth 帧宽度
 * @param scale 刻度格式
 * @returns 每小格的长度
 */
export function calSmallCellStep(frameWidth: number,scale: ScaleBaseType): number{
  return (scale.largeCell * frameWidth) / scale.cellNums ;
}

export function calFormateTime(cellNum: number, scale: ScaleBaseType): ScaleTimeType{
  let second = cellNum * (scale.largeCell / 30);
  const minute = Math.floor(second / 60);
  second %= 60;
  return {
    time: `${padZero(minute)}:${padZero(second)}`,
    leftDec: 14,
  };
}

export function calFrameTime(cellNum: number, scale: ScaleBaseType): ScaleTimeType{
  const frame = cellNum * scale.largeCell % 30;
  return {
    time: `${frame}f`,
    leftDec: 6,
  };
}


/**
 * 计算当前刻度的时间
 * @param cellNum 格数
 * @param scale 刻度规格
 */
export function calCurScaleTime(cellNum: number, scale: ScaleBaseType): ScaleTimeType{
  if(scale.index >= 5){ // 时间格式均为00:00
    return calFormateTime(cellNum,scale);
  } else if(scale.index === 4){ // 一大格是15帧
    if(cellNum % 2){
      return {
        time: '15f',
        leftDec: 8,
      };
    } else{
      return calFormateTime(cellNum,scale);
    }
  } else if(scale.index === 3){ // 一大格是10帧
    if(cellNum % 3){
      return calFrameTime(cellNum,scale);
    } else{
      return calFormateTime(cellNum,scale);
    }
  } else if(scale.index === 2){ // 一大格是5帧
    if(cellNum % 6){
      return calFrameTime(cellNum,scale);
    } else{
      return calFormateTime(cellNum,scale);
    }
  } else if(scale.index === 1){ // 一大格3帧
    if(cellNum % 10){
      return calFrameTime(cellNum,scale);
    } else{
      return calFormateTime(cellNum,scale);
    }
  } else if(scale.index === 0){ // 一大格2帧
    if(cellNum % 15){
      return calFrameTime(cellNum,scale);
    } else{
      return calFormateTime(cellNum,scale);
    }
  } else{
    return calFormateTime(cellNum,scale);
  }
}

/**
 * 返回视频的实际占用长度（px）
 * @param frames 帧数
 * @param frameWidth 帧宽
 * @returns 视频实际占用长度
 */
export const getTimeLineWidth = (frames: number, frameWidth: number) => {
  // console.log('enter getTimeLineWidth');
  // console.log(frames);
  // console.log(frameWidth);
  return frames * frameWidth;
};

/**
 * 将slider的值转化为帧宽度
 * @param value slider对应的值
 * @param index timeLineScales中最大的下标
 * @param step 步长
 * @param minFrameWidth 最小帧宽度
 * @returns 对应的帧宽度
 */
export const sliderValue2FrameWidth = (value:number,index:number,step: number,minFrameWidth: number) => {
  let curLevel = index - Math.floor(value / step);
  //console.log(value / step);
  curLevel = curLevel >= 0 ? curLevel : 0;
  let curOffset = value % step;
  //console.log(curOffset);
  const curScale = timeLineScales[curLevel]; // 当前帧长度所在分区
  //console.log(curScale);
  let ret = curScale.minFrame + (curScale.maxFrame - curScale.minFrame) * (curOffset / step + 0.0001);
  if(curLevel === index){ // 在最小值附近
    ret = minFrameWidth + (curScale.maxFrame - minFrameWidth) * (curOffset / step);
    //console.log(ret,minFrameWidth);
  } else if(curLevel === 0){ // 在最大值附近
    curOffset = value % step ? value % step : step;
    ret = curScale.minFrame + (curScale.maxFrame - curScale.minFrame) * (curOffset / step + 0.0001);
  }
  //console.log(ret);
  return ret;
};