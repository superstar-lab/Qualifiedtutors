import { createContext } from 'react'

const UnreadMessageCountContext = createContext({
    unreadMessageCount: 0,
    setUnreadMessageCount: () => {}
})

export default UnreadMessageCountContext
