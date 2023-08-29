
export interface TrackRender{
  id: string,
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