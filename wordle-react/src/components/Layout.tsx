import { Outlet } from "react-router-dom";

import React from 'react'

// use outlet to react the child web pages
const Layout = () => {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default Layout