import React,{ memo } from 'react';
import './index.less';

interface FooterIconItemProps{
  imgName: string,
  disabled?: boolean,
  onClick?: () => void,
}


const FooterIconItem: React.FC<FooterIconItemProps> = ({ imgName,disabled,onClick }) => {
  // console.log(`render ${imgName}`);
  return (
    <div
      className={disabled ? 'footer-icon-item disabled' : 'footer-icon-item'}
      onClick={disabled ? () => {/*什么都不做*/} : onClick}>
      <span className={disabled ? 'footer-icon-item__wrapper disabled' : 'footer-icon-item__wrapper'}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref={`#icon-${imgName}`}></use>
        </svg>
      </span>
    </div>
  );
};

export default memo(FooterIconItem);