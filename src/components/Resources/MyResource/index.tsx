import React, { useState } from 'react';
import Layout1 from '../Layout/LayoutHC';
import Layout4 from '../Layout/LayoutHILCp';
import MyResBody1 from './MyResBodyProM';
interface MyResourceProps {
  showSpread: boolean
  width: number
}

// 我的资源

const headerList = ['项目素材','我的资源'];
const secondHeaderList = ['不限类型','视频','音频','图片'];
const placeHolder = '搜索我的资源';

const MyResource: React.FC<MyResourceProps> = ({ showSpread,width }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);



  return (
    selectTab === 0
      ? (<Layout1
        selectTab={selectTab}
        headerList={headerList}
        setSelectTab={setSelectTab} >
        <MyResBody1 width={width}/>
      </Layout1>)
      : (<Layout4
        selectTab={selectTab}
        selectSubTab={selectSubTab}
        showSpread={showSpread}
        placeHolder={placeHolder}
        headerList={headerList}
        setSelectTab={setSelectTab}
        setSelectSubTab={setSelectSubTab}
        secondHeaderList={secondHeaderList}
        onSearch={() => {console.log('onSearch');} } >
        <div className='myresource'></div>
      </Layout4>

      )
  );
};

export default MyResource;
