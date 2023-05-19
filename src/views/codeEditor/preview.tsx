import React, { memo, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams, useLocation } from 'react-router-dom'
import { find as findWorks } from '../../services/works'
import { LowCodeComponent } from '../../utils/lowCodeBuilder'
import { Layout, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { getList as getWorksList, remove as deleteWorks, setMockData } from '../../services/works'

interface ICodePreviewProps {
    code?: string
}

function Preview(props: ICodePreviewProps) {
    const location = useLocation()
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
        setCode(props.code)
    }, [props.code])

    useEffect(() => {
        if (params.id) {
            findWorks(params.id).then((record) => {
                setCode(record?.code)
            })
        }
    }, [])

    const isPreview = params.id && location.pathname.indexOf('preview') > -1

    return (
        <Layout className="full-screen" style={{ background: '#fff', padding: isPreview ? '10px 0 0' : 0 }}>
            {isPreview && (
                <Layout.Header style={{ height: 32, background: '#fff', lineHeight: '32px', padding: '0 10px' }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate(`/editor/${params.id}`)
                        }}
                        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => {
                            confirm((type: string) => {
                                if (type === 'ok') {
                                    deleteWorks(params.id)
                                    message.success('删除成功')
                                    navigate(-1)
                                }
                            })
                        }}
                        style={{ borderRadius: 0 }}
                    >
                        删除
                    </Button>
                    <Button
                        onClick={() => {
                            navigate(-1)
                        }}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                        返回
                    </Button>
                </Layout.Header>
            )}
            <Layout.Content style={{ padding: isPreview ? 10 : '10px 10px 0', overflow: 'auto' }}>
                <LowCodeComponent code={code} />
            </Layout.Content>
            {contextHolder}
        </Layout>
    )
}
export default memo(Preview)
