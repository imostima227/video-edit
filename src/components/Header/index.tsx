import React from 'react';
import { Button,Space } from 'antd';
import './index.less';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <div className='header__wrapper'>
        <div className='header__left'>
          <div className='left__logo'>
            {/* <a href='https://www.kdocs.cn/welcome#home'>
              <img src="https://volcengine-kdocs-cache.wpscdn.cn/s1/static/images/1798ea613f31952af006.svg"
                alt=""
                className='left__img'/>
            </a> */}
            <div className='left__text'>本地视频剪辑 (LocalEdit)</div>
          </div>
        </div>
        <div className='header__center'>
          {/* <div className='center__cover'>
            <div className='center__img-wrapper'>
              <img
                src="	https://zenvideo.gtimg.com/images/bg_default_pic.png/144p_webp"
                crossOrigin='anonymous'
                className='center__img'/>
              <span className='center__tips active'>截取封面</span>
            </div>
          </div> */}
          <div className='center__title'>
            <input
              type="text"
              placeholder='未命名项目'
              value='未命名项目'
              className='center__title-input'
              onChange={() => null}/>
            <div className='center__title-name'>未命名项目</div>
          </div>
          <div className='center__save'>
            <div className='center__save-content'>
              <span className='center__save-icon'>
                <svg width='32' height='32' viewBox='0 0 32 32' fill='currentColor'>
                  <path d="M16 3.2c7.069 0 12.8 5.731 12.8 12.8s-5.731 12.8-12.8 12.8c-7.069 0-12.8-5.731-12.8-12.8s5.731-12.8 12.8-12.8zM23.402 12.283c-0.469-0.469-1.228-0.469-1.697 0v0l-7.071 7.071-4.243-4.243c-0.469-0.469-1.228-0.469-1.697 0s-0.469 1.228 0 1.697v0l5.94 5.94 8.768-8.768c0.469-0.469 0.469-1.228 0-1.697z"></path>
                </svg>
              </span>
              已保存
            </div>
          </div>
        </div>
        <div className='header__right'>
          <Space>
            <Space>
              <Button type='primary' className='right__btn'>导出视频</Button>
            </Space>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Header;

