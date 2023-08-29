import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import TimeLine from '../TimeLine';
import './index.less';

interface FooterBottomProps {
  wrapperWidth: number,
  height: number,
  setWrapperWidth: React.Dispatch<React.SetStateAction<number>>,
}

const items1: MenuProps = {
  items: [
    {
      key: '1',
      label: (
        <span>1st menu item</span>
      ),
    },
    {
      key: '2',
      label: (
        <span>2st menu item</span>
      ),
    },
  ],
};

const FooterBottom: React.FC<FooterBottomProps> = ({ wrapperWidth,height,setWrapperWidth }) => {
  return (
    <div className='footer-bottom'>
      <Dropdown
        menu={items1}
        trigger={['contextMenu']}
        className='footer-bottom__dropdown'>
        <div className='footer-bottom__content'>
          <div className='footer-bottom__left-box'>
            <div className='footer-bottom__left-content'>
              
            </div>
          </div>
          <div className='footer-bottom__right-box'>
            <TimeLine
              wrapperWidth={wrapperWidth}
              height={height}
              setWrapperWidth={setWrapperWidth} />
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default FooterBottom;