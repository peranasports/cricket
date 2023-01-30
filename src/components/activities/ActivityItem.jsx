import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { secsToDateTime } from '../../utils/utils'

function ActivityItem({ activity }) {

  const { id, name, start_time } = activity
  return (
    <div className='card shadow-md compact side bg-base-100'>
      <div className='flex-row items-center space-x-4 card-body'>
        <div>
          <div className='avatar'>
            <div className='shadow w-14 h-14'>
              <img src={require(`../assets/logo64.png`)} alt='Profile' />
            </div>
          </div>
        </div>
        <div>
          <Link
            className='text-base-content'
            to={`/activities/${id}`}
          >
            <h2 className='card-title'>{name.toUpperCase()}</h2>
            <p>{secsToDateTime(start_time).toDateString()}</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default ActivityItem
