
export interface TrackRender{
  id: string,
  sourceId: string, // 轨道上视频对应的视频列表中的id
  frames: number,
  left: number,
  type: string,
}

export interface TrackWrapperRender{
  id: string,
  height: number,
  frames: number,
  trackList: TrackRender[],
}