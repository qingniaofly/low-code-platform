import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { HomeOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons'
import Builder from '@dever/low-code-builder'
import ReactModel from '@dever/low-code-builder/dist/react'
import CodeEditor from '../views/codeEditor'
import CodeEditorPreview from '../views/codeEditor/preview'
import WorksPreview from '../views/works/preview'

import Works from '../views/works'

export const menus = [
    {
        key: '1',
        icon: <HomeOutlined rev={undefined} />,
        label: '首页',
        url: '/',
    },
    {
        key: '2',
        icon: <AppstoreOutlined rev={undefined} />,
        label: '作品',
        url: '/works',
    },
    {
        key: '3',
        icon: <EditOutlined rev={undefined} />,
        label: '编辑器',
        url: '/editor',
    },
]

function Home() {
    return <div>low code platform</div>
}

const builder = new Builder(ReactModel, {
    id: 'works-wrapper-1',
    componentType: 'Wrapper',
    props: {
        $$isCustom: true,
        style: {
            background: 'red',
            height: '100%',
        },
    },
})

function RootRoutes() {
    return (
        <Routes>
            <Route path={`works`}>
                <Route path={`:id`} element={<WorksPreview />} />
                <Route path={``} element={<Works />} />
            </Route>
            <Route path={`editor`}>
                <Route path={`preview/:id`} element={<CodeEditorPreview />} />
                <Route path={`:id`} element={<CodeEditor />} />
                <Route path={``} element={<CodeEditor />} />
            </Route>
            <Route path={`/`} element={<Home />} />
        </Routes>
    )
}

export default RootRoutes
