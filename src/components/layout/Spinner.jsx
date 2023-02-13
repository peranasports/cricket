import { useContext } from "react";
import cricket from '../assets/cricket.gif'
import CatapultAPIContext from "../../context/CatapultAPI/CatapultAPIContext";

function Spinner() {
  const { message } = useContext(CatapultAPIContext);


  return (
    <div className='w-100 mt-20'>
      <img
        width={180}
        className='text-center mx-auto'
        src={cricket}
        alt='Loading...'
      />
      <p className='text-center'>{message === undefined ? "Loading..." : message}</p>
    </div>
  )
}

export default Spinner
