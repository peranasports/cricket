import Catapult from '../assets/Catapult.gif'
import cricket from '../assets/cricket.gif'

function Spinner() {
  return (
    <div className='w-100 mt-20'>
      <img
        width={180}
        className='text-center mx-auto'
        src={cricket}
        alt='Loading...'
      />
    </div>
  )
}

export default Spinner
