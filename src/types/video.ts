export interface VideoRawType{
  coverUrl: string,// 封面图片的url
  duration: number,// 视频的持续时间
}
export interface VideoType extends VideoRawType{
  id: string,
  file: File, // 上传的文件
}

export interface VideoRawTimeType{
  frames: number,
  hours: number,
  minutes: number,
  seconds: number,
}
export interface VideoTimeType{
  frames: string,
  hours: string,
  minutes: string,
  seconds: string,
}

export interface VideoSaveType extends VideoType{
  name: string,
  videoUrl: string,
  coverUrl: string,
  duration: number,
  frames: number,
}

export interface VideoRenderType{
  id: string,
  name: string,
  videoUrl: string,
  coverUrl: string,
  duration: number,
}

