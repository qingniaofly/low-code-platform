import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Builder from '@dever/low-code-builder'
import ReactModel from '@dever/low-code-builder/dist/react'
import { LowCodeComponent, createImage } from '../../utils/lowCodeBuilder'
import { Layout, message, Card, Avatar, List, Modal, Skeleton, Spin } from 'antd'
import { ExclamationCircleOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { getList as getWorksList, remove as deleteWorks, setMockData } from '../../services/works'
import mockData from './mock'
import './index.scss'
const { Header, Content, Footer } = Layout

export const config = {
    id: 'works-wrapper',
    componentType: 'Layout',
    props: {
        className: 'works-wrapper',
    },
    children: [
        {
            id: 'works-layout',
            componentType: 'Layout',
            props: {
                className: 'works-layout',
            },
            children: [
                {
                    id: 'works-content',
                    componentType: 'Content',
                    children: [
                        {
                            id: 'works-list',
                            componentType: 'WorksList',
                        },
                    ],
                },
            ],
        },
    ],
}
const builder = new Builder(ReactModel, config)

builder.registerComponent({
    Layout,
    Header,
    Content,
    WorksList,
})

function WorksList() {
    const [modal, contextHolder] = Modal.useModal()
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])

    const confirm = useCallback((callback) => {
        modal.confirm({
            title: '是否删除？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                callback('ok')
            },
            onCancel: () => {
                callback('cancel')
            },
        })
    }, [])

    const getList = useCallback(() => {
        setLoading(true)
        getWorksList().then((list) => {
            if (!list.length) {
                setMockData(mockData)
                list = mockData
            }
            createImageList(list.map((r) => r.code))
            setLoading(false)
            setList(list)
        })
    }, [])

    const createImageList = useCallback((codeList) => {
        const promiseList = codeList.map((code) => {
            return createImage.bind(this, code)
        })
        Promise.all(promiseList.map((fn) => fn())).then((res) => {
            setList((list) => {
                return list.map((r, index) => {
                    r.url = res[index]
                    return r
                })
            })
        })
    }, [])

    useEffect(() => {
        getList()
    }, [])

    return (
        <Spin spinning={loading} wrapperClassName="full-screen">
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 3,
                    md: 3,
                    lg: 3,
                    xl: 3,
                    xxl: 3,
                }}
                dataSource={list}
                renderItem={(item, index) => (
                    <WorksItem
                        key={index}
                        item={item}
                        confirm={confirm}
                        reload={() => {
                            getList()
                        }}
                    />
                )}
            />
            {contextHolder}
        </Spin>
    )
}

function WorksItem(props) {
    const navigate = useNavigate()
    const { item, confirm, reload } = props

    return (
        <List.Item>
            <Card
                className="works-item-card"
                // actions={[
                //     // <EyeOutlined
                //     //     key="preview"
                //     //     title="预览"
                //     //     onClick={() => {
                //     //         if (!item.id) {
                //     //             return
                //     //         }
                //     //         navigate(`/editor/preview/${item.id}`)
                //     //     }}
                //     // />,
                //     <EditOutlined
                //         key="edit"
                //         title="编辑"
                //         onClick={() => {
                //             if (!item.id) {
                //                 return
                //             }
                //             navigate(`/editor/${item.id}`)
                //         }}
                //     />,
                //     <DeleteOutlined
                //         key="delete"
                //         title="删除"
                //         onClick={() => {
                //             confirm((type) => {
                //                 if (type === 'ok') {
                //                     deleteWorks(item.id)
                //                     message.success('删除成功')
                //                     reload()
                //                 }
                //             })
                //         }}
                //     />,
                //     // <EllipsisOutlined key="ellipsis" title="更多" />,
                // ]}
                cover={
                    <div className="works-item-card-cover" style={{ width: '100%', height: 220 }}>
                        <div
                            className="works-item-card-cover-detail"
                            onClick={() => {
                                navigate(`/works/${item.id}`)
                            }}
                        >
                            <div className="works-item-card-cover-detail-title">{item.title}</div>
                            <div className="works-item-card-cover-detail-desc">{item.desc || '---'}</div>
                        </div>
                        {!item.url ? <LowCodeComponent code={item.code} /> : <img width="100%" height="100%" src={item.url} />}
                    </div>
                }
            >
                <Skeleton loading={false} avatar active>
                    <Card.Meta title={item.title} description={item.desc || '---'} />
                </Skeleton>
            </Card>
        </List.Item>
    )
}

export default function Works() {
    return <div className="full-screen">{builder.render()}</div>
}
