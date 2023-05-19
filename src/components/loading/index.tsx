import React, { memo, PropsWithChildren } from 'react'
import classNames from 'classnames'
import './index.scss'

interface ILoadingProps {
    loading: boolean
    className?: string
}

function Loading(props: ILoadingProps) {
    const { loading, className = '' } = props
    if (!loading) {
        return null
    }
    return <div className={classNames('common-loading', { [className]: true })} style={{ backgroundImage: `url('/static/images/loading.png')` }}></div>
}

export function LoadingWrapper(props: PropsWithChildren<ILoadingProps>) {
    return (
        <div
            className={classNames({
                'loading-wrapper': props.loading,
                'full-screen': !props.loading,
            })}
        >
            {props.loading && (
                <div className="loading-container">
                    <div className="loading-content">
                        <Loading loading={props.loading} />
                    </div>
                </div>
            )}
            {props.children}
        </div>
    )
}

export default memo(Loading)
