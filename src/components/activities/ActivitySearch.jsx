import { useEffect } from 'react'
import { useState, useContext } from 'react'
import AlertContext from '../../context/Alert/AlertContext'
import CatapultAPIContext from '../../context/CatapultAPI/CatapultAPIContext'
import { getActivities } from '../../context/CatapultAPI/CatapultAPIAction'
import { useCookies } from 'react-cookie'

function ActivitySearch() {
  const [text, setText] = useState('')
  const { activities, dispatch } = useContext(CatapultAPIContext)
  const { setAlert } = useContext(AlertContext)
  const [cookies, setCookie] = useCookies(['token'])

  const handleChange = (e) => setText(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (text === '') {
      setAlert('Please enter token', 'error')
    } else {
      dispatch({ type: 'SET_LOADING' })
      setCookie('token', text, { path: '/' })
      const activitiesData = await getActivities(text)
      dispatch({ type: 'GET_ACTIVITIES', payload: activitiesData })
    }
  }

  useEffect(() => {
    var token = cookies.token
    if (token !== undefined) {
      setText(token)
    }
}, [cookies.token])

  // if (activities === undefined)
  // {
  //   return <></>
  // }

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 mb-8 gap-8'>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='form-control pt-6'>
            <div className='relative'>
              <input
                type='text'
                className='w-full pr-40 bg-gray-200 input input-lg text-black'
                placeholder='Enter Token'
                value={text}
                onChange={handleChange}
              />
              <button
                type='submit'
                className='absolute top-0 right-0 rounded-l-none w-36 btn btn-lg'>
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
      {activities && (
        <div className='pt-6'>
          <button
            onClick={() => dispatch({ type: 'CLEAR_ACTIVITIES' })}
            className='btn btn-ghost btn-lg'>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default ActivitySearch