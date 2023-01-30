import React from 'react'
import ActivitySearch from '../components/activities/ActivitySearch'
import ActivityResults from '../components/activities/ActivityResults'

function Home() {
  return (
    <div>
        <ActivitySearch />
        <ActivityResults />
    </div>
  )
}

export default Home