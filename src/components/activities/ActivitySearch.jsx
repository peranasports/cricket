import { useEffect } from 'react'
import { useState, useContext } from 'react'
import AlertContext from '../../context/Alert/AlertContext'
import CatapultAPIContext from '../../context/CatapultAPI/CatapultAPIContext'
import { getActivities } from '../../context/CatapultAPI/CatapultAPIAction'
// import { useCookies } from 'react-cookie'
import { toast } from 'react-toastify'
import Spinner from '../layout/Spinner'

function ActivitySearch() {
  const [text, setText] = useState('')
  const { activities, loading, dispatch } = useContext(CatapultAPIContext)
  const { setAlert } = useContext(AlertContext)
  // const [cookies, setCookie] = useCookies(['token'])

  const handleChange = (e) => setText(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (text === '') {
      toast('Please enter token', 'error')
    } else {
      localStorage.setItem("CatapultToken", text)
      dispatch({ type: 'SET_LOADING', payload: {message: "Loading activities..."} })
      // setCookie('token', text, { path: '/' })
      const activitiesData = await getActivities(text)
      if (activitiesData === null)
      {
        toast("Invalid token. Please check.");
        dispatch({ type: 'CLEAR_LOADING', payload: null })
      }
      else
      {
        dispatch({ type: 'GET_ACTIVITIES', payload: activitiesData })
      }
    }
  }

  useEffect(() => {
    // var token = cookies.token
    var token = localStorage.getItem("CatapultToken")
    if (token !== undefined) {
      setText(token)
    }
}, [])

  // if (activities === undefined)
  // {
  //   return <></>
  // }
  if (loading)
  {
    <Spinner />
  }

  return (
    <div className=''>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='form-control pt-6'>
            <p>Catapult Token</p>
            <div className='flex'>
              <input
                type='text'
                className='w-full bg-gray-200 input input-md rounded-xs text-black border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500'
                placeholder='Catapult Token'
                value={text}
                onChange={handleChange}
              />
              <button
                type='submit'
                className='w-40 ml-2 btn btn-md btn-primary'>
                {/* className='absolute top-0 right-0 rounded-l-none w-40 btn btn-md btn-primary'> */}
                Load Catapult Activities
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* {activities && (
        <div className='pt-6 mt-6'>
          <button
            onClick={() => dispatch({ type: 'CLEAR_ACTIVITIES' })}
            className='btn btn-primary btn-md'>
            Load Saved Data
          </button>
        </div>
      )} */}
    </div>
  )
}

export default ActivitySearch