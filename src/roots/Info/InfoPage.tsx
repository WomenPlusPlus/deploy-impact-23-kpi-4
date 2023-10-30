import { Collapse } from 'antd'
import { collapsableItems } from './collapsableItems'
import Info1 from '../../assets/info_illustration1.svg'
import Info2 from '../../assets/info_illustration2.svg'

const InfoPage = () => {
  return (
    <div className='w-full'>
      <div className='flex flex-col items-center mt-20'>
        <div className='flex justify-start w-full'>
          <img  className='w-60' src={Info1} alt='info illustration'/>
        </div>
        <Collapse className='w-6/12' items={collapsableItems} />
        <div className='flex justify-end w-full'>
          <img className='w-80' src={Info2} alt='info illustration'/>
        </div>
      </div>
    </div>

  )
}
export default InfoPage