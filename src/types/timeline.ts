// 刻度尺的单位
export interface ScaleBaseType{
  index: number;
  minFrame: number, // 最小帧长度(px)
  maxFrame: number, // 最大帧长度(px)
  largeCell: number, // 每大格的帧数
  cellNums: number, // 每大格有多少小格
  unit: string, // 每大格渲染时选择的单位
}

// 用于记录刻度的返回值
export interface ScaleTimeType{
  time: string, // 时间，可能出现的时间为'xx:xx','xf'(不会出现'15f'的原因是这种情况只出现了一次，直接特判了)
  leftDec: number, // 需要减去的像素，对应时间按顺序分别为14px,6px
}
