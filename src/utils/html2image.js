import html2canvas from 'html2canvas'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { eventUtil } from './event'

class ImageComponent extends React.Component {
    componentDidMount() {
        this.props.onMount && this.props.onMount()
    }
    render() {
        return <div style={{ width: 200, height: 200, background: 'red' }}>123</div>
    }
}

function convertCanvasToImage(canvas) {
    return canvas.toDataURL('image/png')
}

export function createImage() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    return new Promise((resolve, reject) => {
        try {
            // const el = document.getElementById(id)
            const root = ReactDOM.createRoot(div)
            const onMount = () => {
                html2canvas(div).then(function (canvas) {
                    document.body.removeChild(div)
                    const url = convertCanvasToImage(canvas)
                    // const image = document.createElement('img')
                    // image.setAttribute('src', url)
                    // document.body.appendChild(image)
                    resolve(url)
                })
            }
            root.render(<ImageComponent onMount={onMount} />)
            // ReactDOM.createPortal(<ImageComponent />, el)
        } catch (e) {
            document.body.removeChild(div)
            reject(e)
        }
    })
}
