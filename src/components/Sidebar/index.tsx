import React from 'react';
import SideItem from '../SideItem';
import './index.less';
import { v4 as uuid } from 'uuid';
import { useAppSelector } from '@/redux/hook';

const sideItems = [
  {
    id: uuid(),
    iconSrc: '#icon-24gf-playSquare',
    value: '我的资源',
  },
  {
    id: uuid(),
    iconSrc: '#icon-tiquzimu',
    value: '字幕编辑',
  },
  // {
  //   id: uuid(),
  //   iconSrc: '#icon-lvjing',
  //   value: '滤镜库',
  // },
  /*{ id: uuid(),iconSrc: '#icon-sucai',value: '在线素材' },
  { id: uuid(),iconSrc: '#icon-yinpin',value: '在线音频' },
  {id: uuid(),iconSrc: '#icon-mobanguanli',value: '模板库'},
  {id: uuid(),iconSrc: '#icon-shengyin',value: '数字人库'},
  {id: uuid(),iconSrc: '#icon-biaoqing',value: '贴纸库',},
  {id: uuid(),iconSrc: '#icon-jiacuziti',value: '花字库'},
  {id: uuid(),iconSrc: '#icon-zhuanchang',value: '转场库',},
  {id: uuid(),iconSrc: '#icon-texiao',value: '特效库',},
  {id: uuid(),iconSrc: '#icon-gongju',value: '智能工具',
  },*/
]; // 侧边栏的相关信息

const Sidebar: React.FC = () => {
  // console.log('render sidebar');
  const selectedTab = useAppSelector(state => state.selectedTab.value);
  return (
    <aside className='sidebar'>
      <div className='sidebar__wrap'>
        <ul className='sidebar__menu'>
          {
            sideItems.map((el) => {
              return <SideItem
                isSelected={ selectedTab === el.value }
                key={el.id}
                value={el.value}
                id={el.id}
                iconUrl={el.iconSrc}/>;
            })
          }
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;