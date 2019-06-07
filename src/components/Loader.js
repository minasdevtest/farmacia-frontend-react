import React from 'react'
import { CircularProgress } from '@material-ui/core';

const containerStyle = {
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.6)',
    position: 'fixed',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: '1'
}


export default function Loader(props) {
    return (
        <div style={containerStyle}>
            <CircularProgress size={56} {...props} />
        </div>
    )
}
