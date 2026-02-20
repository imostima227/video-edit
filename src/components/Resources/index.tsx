import React,{ useRef,useEffect, useContext } from 'react';
import MyResource from './MyResource';
import Caption from './Caption';
import './index.less';
import { WindowSizeContext, type WindowSizeProps,WINDOW_SIZE_ACTION_TYPE } from '../Content/context/WindowSizeContext';
import { useAppSelector } from '@/redux/hook';


interface ResourcesProps {
  width: number,
  setWidth: React.Dispatch<React.SetStateAction<number>>,
  setCursor: React.Dispatch<React.SetStateAction<string>>
}

let MAX_WIDTH = window.innerWidth - 580;
const MIN_WIDTH = 312;

const Resources: React.FC<ResourcesProps> = ({ width, setWidth, setCursor }) => {
  const selectedTab = useAppSelector(state => state.selectedTab.value);

  const getWindowSize = () => {
    const { innerWidth,innerHeight } = window;
    return { width:innerWidth,height:innerHeight };
  };
  const { state:windowSize,dispatch }: WindowSizeProps = useContext(WindowSizeContext);
  const xIndex = useRef(width + 112);

  // 动态改变窗口宽高，并改变windowSize状态
  useEffect(() => {
    const handleWindowResize = () => {
      dispatch({
        type: WINDOW_SIZE_ACTION_TYPE.SET_WINDOW_SIZE,
        payload: getWindowSize(),
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return ()=>{
      window.removeEventListener('resize',handleWindowResize);
    };
  },[dispatch]);

  // 根据windowSize改变最MAX_WIDTH
  useEffect(() => {
    MAX_WIDTH = windowSize.width - 580; // 这里出bug了（已修复）
    if(width > MAX_WIDTH && width >= MIN_WIDTH){
      console.log('setMaxWidth');
      setWidth(MAX_WIDTH);
    }
  },[windowSize,width,setWidth]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    xIndex.current = e.clientX;
    setCursor('col-resize');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent): void => {
    console.log('mousemove');
    let offsetX = e.clientX - xIndex.current;
    const newWidth = width + offsetX;
    // 向左拉
    if(offsetX < 0){
      // 不足最小宽度
      if(newWidth < MIN_WIDTH){
        offsetX = MIN_WIDTH - width;
        setWidth(MIN_WIDTH);
      }
      else{
        setWidth(newWidth);
      }
    }
    // 向右拉
    else{
      //超过最大宽度
      if(newWidth > MAX_WIDTH){
        offsetX = MAX_WIDTH - width;
        setWidth(MAX_WIDTH);
      }
      else{
        setWidth(newWidth);
      }
    }
    console.log(width);
  };

  const handleMouseUp = (): void => {
    console.log('mouseup');
    setCursor('default');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const selectSubComp = (value: string): React.ReactElement => {
    switch(value){
      case '我的资源': {
        return <MyResource showSpread={width <= 363} width={width}/>;
      }
      case '字幕编辑': {
        return <Caption />;
      }
      // case '滤镜库': {
      //   return <Filter showSpread={width <= 728} />;
      // }
      // case '特效库': {
      //   return <Effects showSpread={false} />;
      // }
      // case '在线素材': {
      //   return <Materials showSpread={width < 760} />;
      // }
      // case '在线音频': {
      //   return <Audio showSpread={width < 1324}/>;
      // }
      // case '模板库': {
      //   return <Templates showSpread={width <= 728} />;
      // }
      // case '数字人库': {
      //   return <DigitalPeople showSpread={false} />;
      // }
      // case '贴纸库': {
      //   return <Pasters showSpread={width <= 1191} />;
      // }
      // case '花字库': {
      //   return <Fonts />;
      // }
      // case '转场库': {
      //   return <Transitions showSpread={width <= 400}/>;
      // }
      default: {
        return <MyResource showSpread={width < 362} width={width}/>;
      }
    }
  };

  

  return (
    <div className='resources'>
      <section id='material' className='resources__section'>
        {selectSubComp(selectedTab)}
      </section>
      <div className='resources__resizer' onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Resources;