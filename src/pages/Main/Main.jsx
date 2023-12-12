import React, { useEffect } from 'react'
import Sidebar from '../../Components/SidebarSection/Sidebar'
import TimelineSection from '../../Components/Timelinesection/TimelineSection'
import ExploreSection from '../../Components/ExploreSection/ExploreSection'
import SearchSection from '../../Components/SearchSection/SearchSection'



function Main(props) {

  const page = props.page;

  const SwitchComponent = ({ component }) => {
    switch (component) {
      case 'home':
        return <TimelineSection />
      case 'explore':
        return <ExploreSection />
      default:
        return <TimelineSection />
    }
  }

  useEffect(() => {
  }, [])

  return (
    <>
      <Sidebar />
      <SwitchComponent component={page} />
      <SearchSection />
    </>
  )
}

export default Main