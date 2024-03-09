import React, { useEffect } from 'react'
import Sidebar from '../../Components/SidebarSection/Sidebar'
import TimelineSection from '../../Components/Timelinesection/TimelineSection'
import ExploreSection from '../../Components/ExploreSection/ExploreSection'
import SearchSection from '../../Components/SearchSection/SearchSection'
import ProfileSection from '../../Components/ProfileSection/ProfileSection'
import './Main.css'


function Main(props) {

  const page = props.page;

  const SwitchComponent = ({ component }) => {
    switch (component) {
      case 'home':
        return <TimelineSection />
      case 'explore':
        return <ExploreSection />
      case 'profile':
        return <ProfileSection />
      default:
        return <TimelineSection />
    }
  }

  return (
    <>
      <Sidebar />
      <SwitchComponent component={page} />
      <SearchSection />
    </>
  )
}

export default Main