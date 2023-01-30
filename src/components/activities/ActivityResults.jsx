import { useContext, useState, useEffect } from 'react'
import Spinner from '../layout/Spinner'
import ActivityItem from './ActivityItem'
import CatapultAPIContext from '../../context/CatapultAPI/CatapultAPIContext'
import MultiChoice from '../layout/MultiChoice'

function ActivityResults() {
  const { activities, tags, loading } = useContext(CatapultAPIContext)
  const [tagsFilter, setTagsFilter] = useState(null)

  const toggleTagSelect = () => {
  }

  const doOptionChanged = (filter, item) => {

  }
  useEffect(() => {
    var tf = {}
    tf.title = 'Tags'
    tf.allselected = true
    tf.singleSelection = false
    tf.tagsstring = ''
    tf.items = []
    var xtags = tags.sort((a, b) => a.localeCompare(b))

    for (var nt = 0; nt < xtags.length; nt++) {
      if (tf.tagsstring.length > 0) tf.tagsstring += ', '
      tf.tagsstring += xtags[nt].toUpperCase()
      var item = {}
      item.name = xtags[nt]
      item.selected = true
      item.amount = 0
      tf.items.push(item)
    }
    setTagsFilter(tf)
  }, [])

  if (!loading) {
    if (tagsFilter === null) {
      return <></>
    }
    return (
      <>
        <div>
          <label htmlFor="my-modal-3" className="btn">open modal</label>

          {/* Put this part before </body> tag */}
          <input type="checkbox" id="my-modal-3" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box relative">
              <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
              <MultiChoice filter={tagsFilter}
                handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
              </MultiChoice>
            </div>
          </div>

          {/* <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <div className="collapse-title text-xl font-medium">
              TAGS SELECTION
              <p className='text-sm'>
                {tagsFilter.tagsstring}
              </p>
            </div>
            <div className="collapse-content">
              <MultiChoice filter={tagsFilter}
                handleOptionChanged={(filter, item) => doOptionChanged(filter, item)}>
              </MultiChoice>
            </div>
          </div> */}
        </div>
        <div className='grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
          {activities && activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </>
    )
  } else {
    return <Spinner />
  }
}

export default ActivityResults
