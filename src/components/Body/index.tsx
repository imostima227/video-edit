import React from 'react';
import Content from '@components/Content';
import Sidebar from '@components/Sidebar';
import './index.less';


const Body: React.FC = () => {
  return (
    <div className='body'>
      <Sidebar />
      <Content />
    </div>
  );
};

export default Body;
