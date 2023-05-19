import React from 'react'
import Builder from '@dever/low-code-builder'
import ReactModel from '@dever/low-code-builder/dist/react'
import RootRoutes, { menus } from '../../routes'
import { Layout, Menu, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'
const { Header, Content, Footer, Sider } = Layout

function MainSider(props) {
    const { state, model, $$isCustom, modelMap, ...extraProps } = props
    return (
        <Sider {...extraProps} collapsed={state.collapsed}>
            {props.children}
        </Sider>
    )
}

function CollapsedButton(props) {
    const model = props.modelMap.get('main-sider')
    let collapsed = model.getState('collapsed')
    collapsed = collapsed === undefined ? model.__data?.props?.collapsed : collapsed
    return (
        <Button
            onClick={() => {
                model.setState('collapsed', !model.getState('collapsed'))
            }}
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
                fontSize: '14px',
                width: 40,
                height: 32,
                background: 'none',
            }}
        />
    )
}

function MainMenu(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedKeys = menus
        .filter((r) => {
            const name = location.pathname.slice(1)
            const url = r.url.slice(1)
            return name === url.slice(1) || (name && url && name.indexOf(url) > -1)
        })
        .map((r) => r.key)
    return (
        <Menu
            theme="dark"
            mode="inline"
            style={{ background: '#060606' }}
            items={menus}
            selectedKeys={selectedKeys}
            onClick={({ key }) => {
                const menu = menus.find((r) => r.key === key)
                console.log('menu click:', key, menu)
                if (menu && menu.url) {
                    navigate(menu.url)
                }
            }}
        />
    )
}

function MainSiderLogo() {
    return <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', lineHeight: '28px', color: '#fff' }}>xx</div>
}

export const config = {
    id: 'wrapper',
    componentType: 'Layout',
    props: {
        className: 'wrapper',
    },
    children: [
        {
            id: 'main-sider',
            componentType: 'MainSider',
            props: {
                trigger: null,
                collapsible: true,
                collapsed: true,
                collapsedWidth: 0,
                width: 150,
                state: {
                    collapsed: true,
                },
                style: {
                    background: '#060606',
                },
                $$isCustom: true,
            },
            children: [
                {
                    id: 'main-sider-logo',
                    componentType: 'MainSiderLogo',
                    props: {
                        $$isCustom: true,
                    },
                },
                {
                    id: 'main-sider-menu',
                    componentType: 'MainMenu',
                    props: {
                        $$isCustom: true,
                    },
                },
            ],
        },
        {
            id: 'site-layout',
            componentType: 'Layout',
            props: {
                className: 'site-layout',
            },
            children: [
                {
                    id: 'header',
                    componentType: 'Header',
                    props: {
                        style: {
                            background: '#fff',
                            paddingLeft: '0',
                            height: 32,
                            lineHeight: '32px',
                        },
                    },
                    children: [
                        {
                            id: 'collapsed-button',
                            componentType: 'CollapsedButton',
                            props: {
                                $$isCustom: true,
                            },
                        },
                    ],
                },
                {
                    id: 'content',
                    componentType: 'Content',
                    props: {
                        style: {
                            padding: 10,
                            overflow: 'auto',
                        },
                    },
                    children: [
                        {
                            id: 'routes',
                            componentType: 'RootRoutes',
                        },
                    ],
                },
            ],
        },
    ],
}

const builder = new Builder(ReactModel, config)

builder.registerComponent({
    RootRoutes,
    Layout,
    MainSider,
    CollapsedButton,
    MainSiderLogo,
    Header,
    Content,
    Footer,
    Sider,
    MainMenu,
})
export default builder
