// 通用布局3： header+input+label+content
import React,{ useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';

interface LayoutHILCProps {
  selectTab: number,
  selectSubTab: number,
  showSpread: boolean,
  placeHolder: string,
  headerList: string[],
  secondHeaderList: string[],
  setSelectTab: React.Dispatch<React.SetStateAction<number>>,
  setSelectSubTab: React.Dispatch<React.SetStateAction<number>>,
  onSearch: () => void
  children: React.ReactElement
}

const LayoutHILC: React.FC<LayoutHILCProps> = (props) => {
  const {
    selectTab,
    selectSubTab,
    showSpread,
    placeHolder,
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

  const handleClickMenu = (index: number) => {
    setSelectTab(index);
    setIsSpread(false);
  };

  // 控制旋转动画
  const selectSpanStyle = (): string => {
    if(firstClick){
      return 'second-menu__icon';
    }
    else{
      if(isSpread){
        return 'second-menu__icon clicked';
      }
      return 'second-menu__icon reset';
    }
  };

  return (
    <div className='layout-hilc'>
      <header className='layout-hilc__header'>
        <div className='layout-hilc__content'>
          <div className='layout-hilc__menu'>
            <ul className='menu__ul'>
              {headerList.map((el,index) => {
                return (
                  <li
                    key={index}
                    className={ index === selectTab ? 'menu__li selected': 'menu__li'}
                    onClick={() => handleClickMenu(index)}>
                    {el}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='layout-hilc__menu-input'>
            <Input
              prefix={<SearchOutlined style={{ color: '#b4b4b4' }}/>}
              className='menu-input__antd-input'
              placeholder={placeHolder} />
          </div>
          <div className='layout-hilc__second-menu'>
            <ul style={{ height: isSpread? 'auto': '' }} className='second-menu__ul'>
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

export default LayoutHILC;