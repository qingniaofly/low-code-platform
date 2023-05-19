import React, { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { storeAction } from '../store/actions'

function About() {
    const dispatch = useDispatch()
    useEffect(() => {
        setTimeout(() => {
            dispatch(storeAction.test('小张'))
        }, 3000)
    }, [])
    return <div>abput</div>
}

export default memo(About)
