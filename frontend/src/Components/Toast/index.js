import styled from 'styled-components'
import { toast as toastify } from 'react-toastify'

const Container = styled.div`
    display: flex;
    align-items: center;
`

function msgToId(message) {
    return message.replaceAll(' ', '-')
}

function success(message) {
    return toastify.success(<Container><img alt="success" style={{width: '20px', height: '18px', marginRight: '16px'}} src="/img/checkmark.webp" /> {message}</Container>, {
        toastId: msgToId(message)
    })
}

function info(message) {
    return toastify(<Container><img alt="info" style={{width: '24px', height: '24px', marginRight: '16px'}} src="/img/info.webp" /> {message}</Container>, {
        toastId: msgToId(message)
    })
}

function warning(message) {
    return toastify.warning(<Container><img alt="warning" style={{width: '24px', height: '24px', marginRight: '16px'}} src="/img/warning.webp" /> {message}</Container>, {
        toastId: msgToId(message)
    })
}

function error(message) {
    return toastify.error(<Container><img alt="error" style={{width: '24px', height: '24px', marginRight: '16px'}} src="/img/alert_white.webp" /> {message}</Container>, {
        toastId: msgToId(message)
    })
}
/**
 * Wrapping react-toastify to include custom icons
 */
const toast = {
    success,
    info,
    warning,
    error
}

export default toast
