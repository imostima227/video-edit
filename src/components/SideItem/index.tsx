import React,{ memo } from 'react';
import './index.less';
import { useAppDispatch } from '@/redux/hook';
import { setSelectedTab } from '@/redux/features/sidebar/selectedTab';

interface SideItemProps {
  isSelected: boolean,
  value: string,
  id: string,
  iconUrl: string,
}

const SideItem: React.FC<SideItemProps> = ({ isSelected,value, id, iconUrl }) => {
  const dispatch = useAppDispatch();
  // console.log(`render${value}`);

  const handleClick = () => {
    dispatch(setSelectedTab(value));
  };

  return (
    <li className={isSelected ? 'side-item active' : 'side-item'} id={id} onClick={handleClick}>
      <div className='side-item__icon-wrapper'>
        <svg className='side-item__icon' aria-hidden='true'>
          <use xlinkHref={iconUrl}></use>
        </svg>
      </div>
      {value}
    </li>
  );
};

export default memo(SideItem);