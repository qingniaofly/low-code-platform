import React, { memo } from 'react'
import { Button } from 'antd'

interface IButtonGroupProps {
    className?: string
    buttons: {
        text: any
        // type: 'primary' | 'text' | 'default'
        options?: any
    }[]
}
function ButtonGroup(props: IButtonGroupProps) {
    const count = props.buttons.length
    return (
        <>
            {props.buttons.map((r, index) => {
                if (!r) {
                    return
                }
                const style: any = {}
                if (count > 1 && index == 0) {
                    style['borderBottomRightRadius'] = 0
                    style['borderTopRightRadius'] = 0
                } else if (index > 0 && index < count - 1) {
                    style['borderRadius'] = 0
                } else if (count > 1 && index == count - 1) {
                    style['borderTopLeftRadius'] = 0
                    style['borderBottomLeftRadius'] = 0
                }
                return (
                    <Button key={index} {...r.options} style={style}>
                        {r.text}
                    </Button>
                )
            })}
        </>
    )
}
export default memo(ButtonGroup)
