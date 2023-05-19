import React, { memo, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams, useLocation } from 'react-router-dom'
import { find as findWorks } from '../../services/works'
import { LowCodeComponent } from '../../utils/lowCodeBuilder'
import { Layout, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { getList as getWorksList, remove as deleteWorks, setMockData } from '../../services/works'
import ButtonGroup from '../../components/button'

interface ICodePreviewProps {
    code?: string
}

function Preview(props: ICodePreviewProps) {
    const params = useParams()
    const [code, setCode] = useState(props.code)
    const navigate = useNavigate()
    const [modal, contextHolder] = Modal.useModal()

    const confirm = useCallback((callback: any) => {
        modal.confirm({
            title: '确认是否删除？',
            icon: <ExclamationCircleOutlined rev={undefined} />,
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

    useEffect(() => {
        if (params.id) {
            findWorks(params.id).then((record) => {
                setCode(record?.code)
            })
        }
    }, [])

    return (
        <Layout className="full-screen" style={{ background: '#fff', padding: '10px 0 0' }}>
            <Layout.Header style={{ height: 32, background: '#fff', lineHeight: '32px', padding: '0 10px' }}>
                <ButtonGroup
                    buttons={[
                        {
                            text: '编辑',
                            options: {
                                type: 'primary',
                                onClick: () => {
                                    navigate(`/editor/${params.id}`)
                                },
                            },
                        },
                        {
                            text: '删除',
                            options: {
                                danger: true,
                                type: 'primary',
                                onClick: () => {
                                    confirm((type: string) => {
                                        if (type === 'ok') {
                                            deleteWorks(params.id)
                                            message.success('删除成功')
                                            navigate(-1)
                                        }
                                    })
                                },
                            },
                        },
                        {
                            text: '返回',
                            options: {
                                type: 'primary',
                                onClick: () => {
                                    navigate(-1)
                                },
                            },
                        },
                    ]}
                />
            </Layout.Header>
            <Layout.Content style={{ padding: 10, overflow: 'auto' }}>
                <LowCodeComponent code={code} />
            </Layout.Content>
            {contextHolder}
        </Layout>
    )
}
export default memo(Preview)
