import * as React from 'react'
import ReactDOM from 'react-dom/client'
import * as reactRouteDom from 'react-router-dom'
import Builder from '@dever/low-code-builder'
import ReactModel from '@dever/low-code-builder/dist/react'
import * as antd from 'antd'
import * as loadsh from 'loadsh'
import * as axios from 'axios'
import * as antdIcon from '@ant-design/icons'
import html2canvas from 'html2canvas'

function renderer(require, code) {
    const babelResult = code ? window.Babel.transform(code, { presets: ['es2015', 'react'] }) : code // 编译 jsx字符串代码为 js字符串代码
    let r
    try {
        r = eval(babelResult.code)
    } catch (e) {}
    return r
}

const modules = {
    react: React,
    '@dever/low-code-builder': Builder,
    '@dever/low-code-builder/dist/react': ReactModel,
    'react-router-dom': reactRouteDom,
    antd,
    '@ant-design/icons': antdIcon,
    loadsh,
    axios,
}

function loadModule(k) {
    return modules[k]
}

export const lowCodeRender = renderer.bind(this, loadModule)

export function LowCodeComponent(props) {
    let Component = null
    try {
        Component = lowCodeRender(props?.code)?.render()
    } catch (e) {
        Component = e.message
    }
    return <React.Fragment>{Component}</React.Fragment>
}

class ImageComponent extends React.Component {
    state = {
        width: 400,
        height: 220,
    }
    componentDidMount() {
        const { width, height } = this.state
        this.props.onMount && this.props.onMount({ width, height })
    }
    render() {
        const { width, height } = this.state
        const code = this.props.code
        return (
            <div style={{ width, height }}>
                <LowCodeComponent code={code} />
            </div>
        )
    }
}

function convertCanvasToImage(canvas) {
    return canvas.toDataURL('image/png', 1)
}

export function createImage(code) {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.top = 0
    div.style.zIndex = -999
    document.body.appendChild(div)
    return new Promise((resolve, reject) => {
        try {
            const root = ReactDOM.createRoot(div)
            const onMount = (opts) => {
                html2canvas(div, {
                    ...opts,
                }).then(function (canvas) {
                    document.body.removeChild(div)
                    const url = convertCanvasToImage(canvas)
                    resolve(url)
                })
            }
            root.render(<ImageComponent onMount={onMount} code={code} />)
            // ReactDOM.createPortal(<ImageComponent />, el)
        } catch (e) {
            document.body.removeChild(div)
            reject(e)
        }
    })
}
