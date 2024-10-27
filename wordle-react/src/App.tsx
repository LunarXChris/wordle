import { useState, useEffect, useRef } from 'react'
import './App.css'
import Layout from './components/Layout'
import SetUp from './components/SetUp'
import Game from './hooks/Game'
import ChooseGameMode from './hooks/ChooseGameMode'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  // implement path routing with react router module
  return (
    <>
      <div className="App">
        <Routes>
            <Route path="/" element={<Layout/>}>
              {/* <Route path="/" element={<SetUp/>}></Route> */}
              <Route path="/" element={<ChooseGameMode/>}></Route>
              <Route path="/game" element={<Game/>}></Route>
            </Route>
        </Routes>
      </div>
      
    </>
  )
}

export default App
