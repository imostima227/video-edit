import React, { useState } from 'react';
import Layout3 from '../Layout/LayoutHILC';
import './index.less';
interface TemplatesProps {
  showSpread: boolean
}

// 模板库

const headerList = ['模板'];
const secondHeaderList = ['收藏','全部','数字人','企业','教育','电商','新闻','娱乐','影视','Vlog'];

const placeHolder = '搜索模板';

const Templates: React.FC<TemplatesProps> = ({ showSpread }) => {
  const [selectTab, setSelectTab] = useState(0);
  const [selectSubTab, setSelectSubTab] = useState(0);
  return (
    <Layout3
      selectTab={selectTab}
      selectSubTab={selectSubTab}
      showSpread={showSpread}
      placeHolder={placeHolder}
      headerList={headerList}
      setSelectTab={setSelectTab}
      setSelectSubTab={setSelectSubTab}
      secondHeaderList={secondHeaderList}
      onSearch={() => {console.log('onSearch');} } >
      <div className='templates'></div>
    </Layout3>
  );
};

export default Templates;
