// 通用布局1： header+content
import React from 'react';
import './index.less';

interface LayoutHCProps {
  selectTab: number,
  headerList: string[],
  setSelectTab: React.Dispatch<React.SetStateAction<number>>,
  children: React.ReactElement
}

const LayoutHC: React.FC<LayoutHCProps> = ({ selectTab, headerList, setSelectTab, children }) => {
  const handleClick = (index: number) => {
    setSelectTab(index);
  };

  return (
    <div className='layout-hc'>
      <header className='layout-hc__header'>
        <div className='layout-hc__content'>
          <div className='layout-hc__menu'>
            <ul className='menu__ul'>
              {headerList.map((el,index) => {
                return (
                  <li
                    key={index}
                    className={ index === selectTab ? 'menu__li selected': 'menu__li'}
                    onClick={() => handleClick(index)}>
                    {el}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};

export default LayoutHC;