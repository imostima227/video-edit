import React from 'react';
import './index.less';

interface TimeLineTopPros {
  height: number
}

const TimeLineTop: React.FC<TimeLineTopPros> = ({ height }) => {
  return (
    <div
      className='time-line-top'
      style={{
        height
      }}>
      this is Top;
    </div>
  );
};

export default TimeLineTop;