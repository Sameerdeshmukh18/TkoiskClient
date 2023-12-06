import React, { useEffect } from 'react'
import Sidebar from '../../Components/SidebarSection/Sidebar'
import TimelineSection from '../../Components/Timelinesection/TimelineSection'
import SearchSection from '../../Components/SearchSection/SearchSection'



function Main() {
  useEffect(() => {
    console.log('main')
  }, [])
  
    
  return (
    <>
          <Sidebar/>
          <TimelineSection/>
          <SearchSection/>
    </>
  )
}

export default Main