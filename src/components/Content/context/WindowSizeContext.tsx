import React, { createContext,useReducer } from 'react';

interface WindowSizeState {
  width: number,
  height: number,
}

export interface WindowSizeAction{
  type: string,
  payload: WindowSizeState,
}

export interface WindowSizeProps{
  state: WindowSizeState,
  dispatch: React.Dispatch<WindowSizeAction>,
}

const getWindowSize = () => {
  const { innerWidth,innerHeight } = window;
  return { width:innerWidth,height:innerHeight };
};


export const WindowSizeContext = createContext<WindowSizeProps>({
  state: getWindowSize(),
  dispatch: () => {/**/},
});

export enum WINDOW_SIZE_ACTION_TYPE{
  SET_WINDOW_SIZE = 'setWindowSize',
}

interface Props{
  children: React.ReactElement,
}

const windowSizeReducers = (state: WindowSizeState, { type,payload }: WindowSizeAction): WindowSizeState =>{
  switch(type){
    case WINDOW_SIZE_ACTION_TYPE.SET_WINDOW_SIZE: {
      return { ...payload };
    }
    default: return state;
  }
};

const initialWindowSize: WindowSizeState = getWindowSize();
const WindowSizeProvider: React.FC<Props> = ({ children }) => {
  const [state,dispatch] = useReducer(windowSizeReducers, initialWindowSize);

  return (
    <WindowSizeContext.Provider value={{ state,dispatch }}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export default WindowSizeProvider;

