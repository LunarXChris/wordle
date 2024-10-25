import { useState, useEffect, useRef } from 'react'
import './App.css'
import WordBoard from './hooks/WordBoard'
import Keyboard from './components/Keyboard'
import Layout from './components/Layout'
import SetUp from './components/SetUp'
import Game from './hooks/Game'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <div className="App">
        <Routes>
            <Route path="/" element={<Layout/>}>
              <Route path="/" element={<SetUp/>}></Route>
              <Route path="/game" element={<Game/>}></Route>
            </Route>
        </Routes>
      </div>
      
    </>
  )
}

export default App
