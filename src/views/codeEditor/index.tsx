import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { CaretRightOutlined } from '@ant-design/icons'
import { Form, Input, message, Button, Spin } from 'antd'
import { add as addWorks, update as updateWorks, find as findWorks } from '../../services/works'
import ButtonGroup from '../../components/button'
import { createImage } from '../../utils/html2image'
import CodeMirror from 'react-codemirror'
import Preview from './preview'
require('codemirror/lib/codemirror.css') //关键信息引入
require('codemirror/theme/seti.css') //引入主题颜色
require('codemirror/addon/display/fullscreen.css')
// require('../../styles/codemirror.less') //引入样式
require('codemirror/addon/display/panel')
// require('codemirror/mode/xml/xml') //引入编辑语言  xml
require('codemirror/mode/javascript/javascript') //引入编辑语言  JavaScript
// require('codemirror/mode/yaml/yaml') //引入编辑语言 yaml
require('codemirror/mode/sass/sass') //引入编辑语言 sass

require('codemirror/addon/display/fullscreen')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line') //代码高亮
require('codemirror/addon/fold/foldgutter.css') // 代码折叠
require('codemirror/addon/fold/foldcode.js') // 代码折叠
require('codemirror/addon/fold/foldgutter.js') // 代码折叠
require('codemirror/addon/fold/brace-fold.js') // 代码折叠
require('codemirror/addon/fold/comment-fold.js') // 代码折叠
import './index.scss'

function Style(props) {
    return <style>{props.value}</style>
}

export default function CodeEditor(props) {
    const params = useParams()
    const [form] = Form.useForm()
    const [code, setCode] = useState('')
    const [previewCode, setPreviewCode] = useState('')
    const [scssValue, setScssValue] = useState()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [widthMap, setWidthMap] = useState({
        infoWidth: 20,
        scssWidth: 20,
        jsWidth: 60,
    })
    const clientHeight = document.body.clientHeight - 60

    const [jsHeight, setJSHeight] = useState(clientHeight)
    const [scssHeight, setScssHeight] = useState(clientHeight)

    const instance = useRef({
        widthMap,
        jsHeight,
        scssHeight,
        containerWidth: 800,
        topHeight: 36,
        previewHeight: 50,
        codeMirrorJS: null,
        codeMirrorSCSS: null,
    })
    instance.current.widthMap = widthMap
    const containerRef = useRef(null)
    const resizerRef = useRef(null)
    const scssResizerRef = useRef(null)
    const jsResizerRef = useRef(null)

    instance.current.jsHeight = jsHeight
    instance.current.scssHeight = scssHeight

    const codeMirrorJSRef = useRef(null)
    const codeMirrorScssRef = useRef(null)

    function save() {
        const data = form.getFieldsValue()
        data.code = code
        setLoading(true)
        const saveData = params.id ? updateWorks : addWorks
        saveData(data).then(() => {
            setLoading(false)
            message.success('保存成功')
        })
    }

    useEffect(() => {
        const containerDOM = containerRef.current as HTMLDivElement
        if (!containerDOM) {
            return
        }
        const resizeObserver = new ResizeObserver((entries) => {
            if (Array.isArray(entries) && entries.length) {
                const { contentRect } = entries[0]
                instance.current.containerWidth = contentRect.width
            }
        })
        resizeObserver.observe(containerDOM)
        const { clientWidth } = containerDOM
        instance.current.containerWidth = clientWidth

        return () => {
            resizeObserver.unobserve(containerDOM)
        }
    }, [])

    const updateCodeMirrorSize = useCallback((height) => {
        const codeMirror1 = codeMirrorJSRef.current?.getCodeMirror()
        codeMirror1?.setSize(undefined, height)
        const codeMirror2 = codeMirrorScssRef.current?.getCodeMirror()
        codeMirror2?.setSize(undefined, height)
    }, [])

    useEffect(() => {
        createImage()
        if (params.id) {
            setLoading(true)
            findWorks(params.id).then((record) => {
                setLoading(false)
                form.setFieldsValue(record)
                setCode(record?.code)
                setPreviewCode(record?.code)
                const codeMirrorJS = codeMirrorJSRef.current?.getCodeMirror()
                const { jsHeight, topHeight, previewHeight } = instance.current
                const height = jsHeight - topHeight - previewHeight
                setJSHeight(height)
                updateCodeMirrorSize(height)
                codeMirrorJS.setValue(record?.code)
            })
        } else {
            const { jsHeight, topHeight } = instance.current
            const height = jsHeight - topHeight
            setJSHeight(height)
            updateCodeMirrorSize(height)
        }
    }, [])

    useEffect(() => {
        const resizerDOM = resizerRef.current
        const onmousedown = (e) => {
            const h = instance.current.jsHeight
            e = e || event
            const y1 = e.pageY
            document.body.style.cursor = 'row-resize'

            const onmousemove = (e) => {
                const y2 = e.pageY
                const n = parseFloat(y2 - y1 + '')
                const height = h + n
                console.log('ss:', height, clientHeight)
                if (height < clientHeight && height > 0) {
                    updateCodeMirrorSize(height)
                    setJSHeight(height)
                    setScssHeight(height)
                }
            }
            const onmouseup = (e) => {
                document.body.style.cursor = 'default'
                document.removeEventListener('mousemove', onmousemove)
                document.removeEventListener('mouseup', onmouseup)
            }
            document.addEventListener('mousemove', onmousemove)
            document.addEventListener('mouseup', onmouseup)
        }
        resizerDOM.addEventListener('mousedown', onmousedown)
        return () => {
            resizerDOM.removeEventListener('mousedown', onmousedown)
        }
    }, [])

    useEffect(() => {
        const resizerDOM = scssResizerRef.current
        const onmousedown = (e) => {
            const { widthMap, containerWidth } = instance.current
            const tw = containerWidth - 18 * 3 // 总宽度
            const cw = (widthMap.scssWidth / 100) * tw // scss当前宽度
            const jsWidth = (widthMap.jsWidth / 100) * tw // 当前js宽度
            e = e || event
            const x1 = e.pageX
            document.body.style.cursor = 'col-resize'

            const onmousemove = (e) => {
                const x2 = e.pageX
                const n = parseFloat(x2 - x1 + '')
                let width = cw - n
                width = width < 0 ? 0 : width
                if (width < 0) {
                    width = 0
                }
                if (width >= tw - jsWidth) {
                    width = tw - jsWidth
                }
                setWidthMap((r) => {
                    const scssw = (width / tw) * 100
                    let infow = 100 - r.jsWidth - scssw
                    infow = infow < 0 ? 0 : infow
                    return { ...r, infoWidth: infow, scssWidth: scssw }
                })
            }
            const onmouseup = (e) => {
                document.body.style.cursor = 'default'
                document.removeEventListener('mousemove', onmousemove)
                document.removeEventListener('mouseup', onmouseup)
            }
            document.addEventListener('mousemove', onmousemove)
            document.addEventListener('mouseup', onmouseup)
        }
        resizerDOM.addEventListener('mousedown', onmousedown)
        return () => {
            resizerDOM.removeEventListener('mousedown', onmousedown)
        }
    }, [])

    useEffect(() => {
        const resizerDOM = jsResizerRef.current
        const onmousedown = (e) => {
            const { widthMap, containerWidth } = instance.current
            const tw = containerWidth - 18 * 3 // 总宽度
            const cw = (widthMap.jsWidth / 100) * tw // js当前宽度
            const infoWidth = (widthMap.infoWidth / 100) * tw // info当前宽度
            e = e || event
            const x1 = e.pageX
            document.body.style.cursor = 'col-resize'

            const onmousemove = (e) => {
                const x2 = e.pageX
                const n = parseFloat(x2 - x1 + '')
                let width = cw - n
                width = width < 0 ? 0 : width
                if (width < 0) {
                    width = 0
                }
                if (width >= tw - infoWidth) {
                    width = tw - infoWidth
                }
                setWidthMap((r) => {
                    const jsw = (width / tw) * 100
                    let scssw = 100 - r.infoWidth - jsw
                    scssw = scssw < 0 ? 0 : scssw
                    return { ...r, scssWidth: scssw, jsWidth: jsw }
                })
            }
            const onmouseup = (e) => {
                document.body.style.cursor = ''
                document.removeEventListener('mousemove', onmousemove)
                document.removeEventListener('mouseup', onmouseup)
            }
            document.addEventListener('mousemove', onmousemove)
            document.addEventListener('mouseup', onmouseup)
        }
        resizerDOM.addEventListener('mousedown', onmousedown)
        return () => {
            resizerDOM.removeEventListener('mousedown', onmousedown)
        }
    }, [])

    const options = {
        mode: { name: 'javascript', json: true },
        lineNumbers: true,
        theme: 'seti',
        fullScreen: false,
        lineWrapping: true,
        smartIndent: true,
        matchBrackets: true,
        scrollbarStyle: null,
        showCursorWhenSelecting: true,
        readOnly: false,
    }

    return (
        <Spin spinning={loading} wrapperClassName="full-screen code-editor-container" className="ss">
            <Style value={scssValue} />
            <div className="code-editor full-screen" ref={containerRef}>
                <div className="code-editor-content full-screen" style={{ height: jsHeight }}>
                    <div className="editor-resizer"></div>
                    <div className="code-editor-info" style={{ width: `${widthMap.infoWidth}%` }}>
                        <div className="code-editor-type">
                            <span style={{ background: '#151718', color: '#fff' }}>基本信息</span>
                        </div>
                        <div style={{ flex: 1, padding: 10 }}>
                            <Form
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 600 }}
                                // initialValues={{ remember: true }}
                                // onFinish={onFinish}
                                // onFinishFailed={onFinishFailed}
                                form={form}
                                autoComplete="off"
                            >
                                <Form.Item label="编号" name="id" rules={[{ required: true, message: '请输入编号!' }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题!' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="描述" name="desc" rules={[{ required: true, message: '请输入描述!' }]}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Form>
                            {/* <Form form={form} name="horizontal_login">
                                <Form.Item name="id" rules={[{ required: true, message: '请输入编号!' }]}>
                                    <Input placeholder="请输入编号" />
                                </Form.Item>
                                <Form.Item name="title" rules={[{ required: true, message: '请输入标题!' }]}>
                                    <Input placeholder="请输入标题" />
                                </Form.Item>
                                <Form.Item name="desc" rules={[{ required: true, message: '请输入描述!' }]}>
                                    <Input placeholder="请输入描述" />
                                </Form.Item>
                            </Form> */}
                        </div>
                    </div>
                    <div className="editor-resizer" ref={scssResizerRef}></div>
                    <div className="code-editor-scss" style={{ width: `${widthMap.scssWidth}%` }}>
                        <div className="code-editor-type">
                            <span>scss</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <CodeMirror ref={codeMirrorScssRef} className="code-mirror-scss" options={{ ...options, mode: 'text/x-sass' }} value={scssValue} />
                        </div>
                    </div>
                    <div className="editor-resizer" ref={jsResizerRef}></div>
                    <div className="code-editor-javascript" style={{ width: `${widthMap.jsWidth}%` }}>
                        <div className="code-editor-type">
                            <ButtonGroup
                                buttons={[
                                    {
                                        text: '保存',
                                        options: {
                                            type: 'primary',
                                            size: 'small',
                                            onClick: save,
                                        },
                                    },
                                    params?.id
                                        ? {
                                              text: '取消',
                                              options: {
                                                  size: 'small',
                                                  onClick: () => {
                                                      navigate(-1)
                                                  },
                                              },
                                          }
                                        : null,
                                ]}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <CodeMirror
                                ref={codeMirrorJSRef}
                                className="code-mirror-js"
                                options={options}
                                value={code}
                                onChange={(v) => {
                                    setCode(v)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="resizer" ref={resizerRef} />
                <div className="preview" style={{ height: `calc(100% - 18px - ${jsHeight}px)` }}>
                    <Preview code={code} />
                </div>
            </div>
        </Spin>
    )
}
