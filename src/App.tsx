import React from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { IRootState } from './store/type'
import Home from './views/home'
import About from './views/about'
import wrapper from './views/wrapper'
import './style/common.scss'
import '@babel/polyfill'

const App = () => {
    const { test } = useSelector((state: IRootState) => state)
    return (
        <div data-test={test} className="app-wrapper full-screen">
            {wrapper.render()}
        </div>
    )
}

export default App
