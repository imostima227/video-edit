import React,{ memo } from 'react';
import './index.less';

interface IconItemProps {
  imgUrl: string
  disabled: boolean
  onClick?: () => void
}

const IconItem: React.FC<IconItemProps> = ({ imgUrl,disabled,onClick }) => {
  // console.log('enter IconItem'+imgUrl);
  return (
    <li className='icon-item' onClick={disabled ? ()=>{/* 空函数 */} : onClick}>
      <div className={disabled ? 'icon-item__icon-wrapper disabled':'icon-item__icon-wrapper'}>
        <button className={disabled ? 'icon-item__icon-button disabled':'icon-item__icon-button'}>
          <svg className='icon' aria-hidden='true'>
            <use xlinkHref={`#${imgUrl}`}></use>
          </svg>
        </button>
      </div>
    </li>
  );
};

export default memo(IconItem);