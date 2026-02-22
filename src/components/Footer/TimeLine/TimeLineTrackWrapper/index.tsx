import React,{ memo } from 'react';
import TimeLineTrack from '../TimeLineTrack';
import { useAppSelector } from '@/redux/hook';
import { TrackWrapperRender } from '@type/track';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import TimeLineWrapper from '@data/TimeLine/timeline_wrapper';
import './index.less';

interface TimeLineTrackWrapperProps{
  trackWrapper: TrackWrapperRender
  actualWidth: number,
  offsetX: number
}

const TimeLineTrackWrapper: React.FC<TimeLineTrackWrapperProps> = ({ trackWrapper,actualWidth,offsetX }) => {
  const frameWidth = useAppSelector(state => state.frameWidth.value);
  // console.log(trackWrapper);

  // 配置拖拽传感器。防止点击和拖拽冲突（移动超过 5px 才判定为拖拽）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // 处理拖拽结束的逻辑
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 如果拖拽到了别的轨道上方，并且不是自己
    if (over && active.id !== over.id) {
      const oldIndex = trackWrapper.trackList.findIndex(t => t.id === active.id);
      const newIndex = trackWrapper.trackList.findIndex(t => t.id === over.id);

      // 获取单例，找到对应的包装器并执行我们在上一阶段写好的神仙方法 moveTrack
      const tlWrapper = TimeLineWrapper.getInstance();
      const targetWrapper = tlWrapper.trackId2Wrapper.get(active.id as string);

      if (targetWrapper) {
        // 调用我们重构的 moveTrack，底层数据会自动交换并重算 left
        targetWrapper.moveTrack(oldIndex, newIndex);
        
        // ⚠️【极度关键】：底层数据虽然更新了，但 React 还不知道。
        // 你需要在这里触发一次事件，让外层组件重新读取单例并 setState 触发渲染。
        // 鉴于你的架构使用了 CustomEvent，我们可以派发一个更新事件。
        const updateEvent = new CustomEvent('trackupdated', {
          detail: { blocktype: targetWrapper.blocktype }, // 补充 blocktype 参数
          bubbles: true });
        document.dispatchEvent(updateEvent);
      }
    }
  };


  return (
    <div className='time-line-track-wrapper' style={{ height: trackWrapper.height }}>
      <div className='time-line-track-wrapper__content' style={{ width: trackWrapper.frames * frameWidth, left: -offsetX }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={trackWrapper.trackList.map(el => el.id)}
            strategy={horizontalListSortingStrategy}
          >
            {
              trackWrapper.trackList.map(el => {
                return <TimeLineTrack track={el} key={el.id} />;
              })
            }
          </SortableContext>
        </DndContext>

      </div>
      <div
        className='time-line-track-wrapper__add'
        style={{
          width: actualWidth - trackWrapper.frames * frameWidth,
          left: -offsetX + trackWrapper.frames * frameWidth,
        }}></div>
    </div>
  );
};

export default memo(TimeLineTrackWrapper);