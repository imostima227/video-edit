import React from 'react';
import './index.less';

interface TimeLineBottomPros {
  height: number
}

const TimeLineBottom: React.FC<TimeLineBottomPros> = ({ height }) => {
  return (
    <div
      className='time-line-bottom'
      style={{
        height
      }}>
      this is Bottom;
    </div>
  );
};

export default TimeLineBottom;