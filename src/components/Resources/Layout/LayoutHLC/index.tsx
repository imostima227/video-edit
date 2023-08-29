// 通用布局2： header+label+content
import React, { useState } from 'react';
import './index.less';

interface LayoutHLCProps {
  selectTab: number,
  selectSubTab: number,
  showSpread: boolean,
  headerList: string[],
  secondHeaderList: string[],
  setSelectTab: React.Dispatch<React.SetStateAction<number>>,
  setSelectSubTab: React.Dispatch<React.SetStateAction<number>>,
  children: React.ReactElement
}

const LayoutHLC: React.FC<LayoutHLCProps> = (props) => {
  const {
    selectTab,
    selectSubTab,
    showSpread,
    headerList,
    secondHeaderList,
    setSelectTab,
    setSelectSubTab,
    children,
  } = props;
  const [isSpread, setIsSpread] = useState(false); // 是否展开
  const [firstClick, setFirstClick] = useState(true); // 是否是第一次点击

  const handleClickIcon = () => {
    setIsSpread(!isSpread);
    setFirstClick(false);
  };

  // 控制旋转动画
  const selectSpanStyle = (): string => {
    if(firstClick){
      return 'second-menu__span';
    }
    else{
      if(isSpread){
        return 'second-menu__span clicked clicked';
      }
      return 'second-menu__span clicked reset';
    }
  };

  return (
    <div className='layout-hlc'>
      <header className='layout-hlc__header'>
        <div className='layout-hlc__content'>
          <div className='layout-hlc__menu'>
            <ul className='menu__ul'>
              {headerList.map((el,index) => {
                return (
                  <li
                    key={index}
                    className={ index === selectTab ? 'menu__li selected': 'menu__li'}
                    onClick={() => setSelectTab(index)}>
                    {el}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='layout-hlc__second-menu'>
            <ul className='second-menu__ul' style={{ height: isSpread? 'auto': '' }}>
              {
                secondHeaderList.map((el,index) => {
                  return (
                    <li
                      key={index+100}
                      className={ index === selectSubTab ? 'second-menu__li selected': 'second-menu__li'}
                      onClick={() => setSelectSubTab(index)}>
                      {el}
                    </li>
                  );
                })
              }
            </ul>
            <div className='second-menu__icon-wrapper'
              onClick={() => handleClickIcon()}
              style={{ visibility: showSpread ? 'visible': 'hidden' }}>
              <span className={selectSpanStyle()}>
                <svg className='icon' aria-hidden='true'>
                  <use xlinkHref='#icon-xiangxia'></use>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default LayoutHLC;