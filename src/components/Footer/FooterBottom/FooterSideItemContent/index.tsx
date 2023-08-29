import React from 'react';
import { Space } from 'antd';
import './index.less';

const FooterSideItem: React.FC = () => {
  return (
    <div className='footer-side-item'>
      <div className='footer-side-item__wrapper'>
        <Space style={{ gap: 10 }}>
          <div className='footer-side-item__icon-wrapper'>
            <span className='footer-side-item__icon'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-home"></use>
              </svg>
            </span>
          </div>
          <div className='footer-side-item__icon-wrapper'>
            <span className='footer-side-item__icon'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-yincang"></use>
              </svg>
            </span>
          </div>
          <div className='footer-side-item__icon-wrapper'>
            <span className='footer-side-item__icon'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-shengyin_shiti"></use>
              </svg>
            </span>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default FooterSideItem;
