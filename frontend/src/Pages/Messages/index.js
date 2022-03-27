import styled from 'styled-components'
import UserContext from '../../UserContext'
import {Helmet} from "react-helmet"
import Colours from '../../Config/Colours'
import { useEffect, useState, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import {
    FixedWidth,
    Accordion,
    Toast,
    Card,
    RingLoader,
    Button,
    Input,
    API,
    Link
} from '../../Components'
import useDebounce from '../../Hooks/UseDebounce'
import UserIcon from '../../Components/UserIcon'
import useWindowSize from '../../Hooks/UseWindowSize'

const Container = styled.div`

    margin-top: 12px;

    & .user-icon {
        margin-right: 8px;
    }

    & .action {
        color: ${Colours.n500};
        cursor: pointer;

        &:hover {
            color: black;
        }
    }

    & .list, .convo {
        padding: 0px;
        margin-bottom: 42px;
        height: 100vh;

        &.centered {
            justify-content: center;
            align-items: center;
        }
    }

    & .list.centered {
        justify-content: unset;
    }

    & .list {
        flex: 1;
        max-width: 320px;
        max-height: calc(100vh - 121px - 42px);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 0;
        border-right: 0;
    }

    & .convo {
        flex: 1;
        max-height: calc(100vh - 121px - 42px);
        position: relative;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    & .convo-header .user-icon {
        margin-right: 0;
    }

    @media screen and (max-width: 800px) {
        & .tab-container {
            padding-left: 8px;
            padding-right: 8px;

            & > div {
                margin-right: 16px;
            }
        }

        & .container-column {
            height: calc(100vh - 92px);
        }

        & .main {
            flex: 1;
            gap: 0;

            & .list {
                max-width: unset;
                margin-bottom: -1px;
                transition: width .25s, max-width .25s;

                ${props => props.activeConvo ? `
                    max-width: 48px;
                ` : ``}
            }

            & .convo {
                margin-bottom: 0;
                transition: width .25s;

                ${props => props.activeConvo ? `
                    width: 100%;
                    flex: 1;
                ` : `
                    width: 0;
                    flex: 0;   
                `}
            }
        }

        & .message-bar {
            flex-direction: column;
            padding: 8px;
            gap: 2px;
            width: calc(100% - 16px);

            & .inputcontainer {
                margin-bottom: -4px;
            }

            & > div > div:last-of-type {
                margin-top: 8px;
                gap: 8px;
            }

            & > div:last-of-type {
                gap: 23px;
                flex-direction: row;
                justify-content: space-between !important;
            }
        }

        & .list-convo-item {
            padding: 8px 1px;
        }

        & .list-scroll > div:first-of-type {
            overflow-x: hidden !important;
            overflow-y: visible;
        }
    }

    @media screen and (max-width: 520px) {
        margin-top: 0;
        position: relative;
        top: -1px;

        & .container-column {
            height: calc(100vh - 79px);
        }

        & .list, & .convo {
            max-height: calc(100vh - 121px - 8px);
        }

        & .convo-header .user-icon {
            display: none;
        }
    }
`

const Row = styled.div`
    display: flex;
    gap: 24px;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ListConvo = styled.div`
    display: flex;
    flex: 1;
    padding: 8px;
    border-bottom: 1px solid #e7e7e7;
    cursor: pointer;
    transition: background .25s;

    

    &:hover {
        background: ${Colours.b050};
    }

    ${props => props.active ? `
        background: ${Colours.b500};
        color: white;

        &:hover {
            background: ${Colours.b550};
        }
    ` : ''}
`

const ListName = styled.div`
    font-weight: bold;
`

const ListDate = styled.div`
    opacity: .33;
    margin-right: 8px;
`

const ListMsg = styled.div`
    &:first-of-type {
        padding-top: 8px;
    }
`

const MessageBar = styled.div`
    position: absolute;
    bottom: 0;
    width: calc(100% - 32px);
    display: flex;
    
    gap: 16px;
    padding: 16px;
    background: ${Colours.n825};
    border-top: 1px solid ${Colours.n815};

    & textarea {
        min-height: 96px;

        @media screen and (max-width: 800px) {
            min-height: 77px;
        }
    }
`

const ConvoHeader = styled.div`

`

const ConvoName = styled.div`
    position: relative;
    top: -2px;
    display: flex;
    align-items: center;

    @media screen and (max-width: 520px) {
        display: none;
    }
`

const ConvoSearch = styled.div`
    padding: 8px;
    background: ${Colours.n825};
    border-bottom: 1px solid ${Colours.n815};

    & > div {
        margin-bottom: 0;
    }

    & .inputcontainer {
        margin-bottom: 0;

        @media screen and (max-width: 800px) {
            display: ${props => props.activeConvo ? 'none' : 'block'};
        }
    }

    & img {
        display: none;
        transform: rotate(180deg);
        cursor: pointer;
        margin-left: 6px;

        @media screen and (max-width: 800px) {
            display: ${props => props.activeConvo ? 'block' : 'none'};
        }
    }

`

const Tabs = styled.div`
    display: flex;
    background: white;
    border: 1px solid #e0e0e0;
    padding: 16px 16px 0 16px;
    border-bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-shadow: inset 0 -7px 6px -7px rgba(0,0,0,0.033);
`

const Tab = styled.div`
    color: ${Colours.n500};
    padding-bottom: 12px;
    margin-right: 32px;
    cursor: pointer;

    &:hover {
        color: black;
    }

    ${props => props.active ? `
        color: black;
        font-weight: bold;

        border-bottom: 3px solid ${Colours.b500};
    ` : ''}
`

const Tag = styled.div`
    color: white;
    font-size: 14px;
    background: ${Colours.b500};
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
`

const TagText = styled.div`
    flex: 1;
    max-width: 96px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Attachment = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: border-color .25s, background .25s;
    border-radius: 4px;
    margin-top: 8px;

    & > img {
        width: 20px;
        height: 18px;
    }

    &:hover {
        border-color: ${Colours.b500};
        background: white;
    }
`

/**
 * Messages page
 * 
 * Allows users to view their active/archived/favourite conversations
 */
function Messages({user, setUser, style}) {

    const [convos, setConvos] = useState([])
    const [activeConvo, setActiveConvo] = useState({from: null, to: null, fromUser: null, toUser: null})
    const [convo, setConvo] = useState(null)
    const [loadingConvo, setLoadingConvo] = useState(false)
    const [moreConvosUrl, setMoreConvosUrl] = useState(null)
    const [moreCurrentConvoUrl, setMoreCurrentConvoUrl] = useState(null)
    const [initialLoading, setInitialLoading] = useState(true)
    const [initialLoadingError, setInitialLoadingError] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)    
    const [loadingMoreCurrentConvo, setLoadingMoreCurrentConvo] = useState(false)
    const [message, setMessage] = useState("")
    const [sendingMessage, setSendingMessage] = useState(false)

    const [convoSearch, setConvoSearch] = useState("")
    const convoSearchDebounced = useDebounce(convoSearch, 1000)

    const [activeConvoSearch, setActiveConvoSearch] = useState("")
    const activeConvoSearchDebounced = useDebounce(activeConvoSearch, 1000)

    const [view, setView] = useState('active')
    const [attachments, setAttachments] = useState([])

    const convoRef = useRef()
    const fileInputRef = useRef()
    const windowSize = useWindowSize()

    const mapConvo = convo => {

        const fromUser = convo.users.find(u => u.id != user.id)
        const toUser = convo.users.find(u => u.id == user.id)
        
        return {
            ...convo,
            created: new Date(convo.messages.length > 0 ? convo.messages.created_at : convo.created_at),
            updated: new Date(convo.messages.length > 0 ? convo.messages.updated_at : convo.updated_at),
            from: fromUser,
            to: toUser,
            from_id: fromUser.id,
            to_id: toUser.id,
            message: convo.messages && convo.messages.length > 0 ? convo.messages[0].message : ""
        }
    }

    const searchConversations = async () => {
        try {
            let response = null
            const url = view == 'active' ? 'user/messages/received' : (view == 'archived' ? 'user/messages/archived' : 'user/messages/favourite')
            if (convoSearchDebounced) {
                response = await API.get(url, {
                    params: { text: convoSearchDebounced }
                })
            } else {
                response = await API.get(url)
            }
            
            
            if (response && response.data && response.data.data) {
                setConvos(response.data.data.map(mapConvo))
                if (response.data.next_page_url) {
                    setMoreConvosUrl(response.data.next_page_url)
                }
                
            }
        } catch (error) {
            Toast.error("Unexpected error fetching messages, refresh to try again.")
        }
    }

    const searchConversation = async () => {
        setLoadingConvo(true)
        setMoreCurrentConvoUrl(null)
        setConvo(null)
        try {
            let response = null

            if (activeConvoSearchDebounced) {
                response = await API.get(`user/messages/conversation/${activeConvo.id}`, {
                    params: {
                        text: activeConvoSearchDebounced
                    }
                })
            } else {
                response = await API.get(`user/messages/conversation/${activeConvo.id}`)
            }
            
            if (response && response.data && response.data.data) {
                setConvo(response.data.data.map(convo => {
                        
                    const fromUser = convo.conversation.users.find(u => u.id == convo.user_id)
                    const toUser = convo.conversation.users.find(u => u.id != convo.user_id)

                    return {
                        ...convo,
                        from: fromUser,
                        from_id: fromUser.id,
                        to: toUser,
                        to_id: toUser.id,
                        created: new Date(convo.created_at),
                        updated: new Date(convo.updated_at)
                    }
                }))

                if (response.data.next_page_url) {
                    setMoreCurrentConvoUrl(response.data.next_page_url)
                }

                // delay until next event loop tick
                setTimeout(() => {
                    const node = document.getElementById('convoContainer')
                    node.firstElementChild.scroll({ top: node.firstElementChild.scrollHeight, behavior: 'smooth' });
                }, 0)
            } else {
                Toast.error("Unexpected error fetching conversation, please try again.")
            }
            setLoadingConvo(false)
        } catch (error) {
            Toast.error("Unexpected error fetching conversation, please try again.")
            setLoadingConvo(false)
        }
    }

    useEffect(() => {
        searchConversations()
    }, [convoSearchDebounced, view])

    useEffect(() => {
        searchConversation()
    }, [activeConvoSearchDebounced])

    useEffect(() => {
        if (!user) { return }

        const initialGetMessages = async () => {
            try {
                const url = view == 'active' ? 'user/messages/received' : (view == 'archived' ? 'user/messages/archived' : 'user/messages/favourite')
                const response = await API.get(url)
                
                if (response && response.data && response.data.data) {
                    const convos = response.data.data.map(mapConvo)
                    setConvos(convos)
                    if (response.data.next_page_url) {
                        setMoreConvosUrl(response.data.next_page_url)
                    }
                    setInitialLoading(false)

                    if (convos.length > 0 && windowSize.width > 800) {
                        setActiveConvo({
                            id: convos[0].id,
                            from: convos[0].from.id,
                            to: convos[0].to.id,
                            fromUser: convos[0].from,
                            toUser: convos[0].to
                        })
                    }
                }
            } catch (error) {
                Toast.error("Unexpected error fetching messages, refresh to try again.")
                setInitialLoading(false)
                setInitialLoadingError(true)
            }
        }

        initialGetMessages()
    }, [user])
    
    useEffect(() => {
        if (!activeConvo.from || !activeConvo.to) { return }

        const getConvo = async () => {
            setLoadingConvo(true)
            setMoreCurrentConvoUrl(null)
            setConvo(null)
            setAttachments([])
            try {
                const response = await API.get(`user/messages/conversation/${activeConvo.id}`)
                if (response && response.data) {
                    setConvo(response.data.data.map(convo => {
                        
                        const fromUser = convo.conversation.users.find(u => u.id == convo.user_id)
                        const toUser = convo.conversation.users.find(u => u.id != convo.user_id)

                        return {
                            ...convo,
                            from: fromUser,
                            from_id: fromUser.id,
                            to: toUser,
                            to_id: toUser.id,
                            created: new Date(convo.created_at),
                            updated: new Date(convo.updated_at)
                        }
                    }))

                    if (response.data.next_page_url) {
                        setMoreCurrentConvoUrl(response.data.next_page_url)
                    }

                    // delay until next event loop tick
                    setTimeout(() => {
                        const node = document.getElementById('convoContainer')
                        node.firstElementChild.scroll({ top: node.firstElementChild.scrollHeight, behavior: 'smooth' });
                    }, 0)
                } else {
                    Toast.error("Unexpected error fetching conversation, please try again.")
                }
                setLoadingConvo(false)
            } catch (error) {
                Toast.error("Unexpected error fetching conversation, please try again.")
                setLoadingConvo(false)
            }
        }

        getConvo()
    }, [activeConvo])

    const loadMore = async () => {
        try {
            setLoadingMore(true)
            const response = await API.get(moreConvosUrl)

            if (response && response.data && response.data.data) {
                setConvos([
                    ...convos,
                    ...response.data.data.map(mapConvo)
                ])
                if (response.data.next_page_url) {
                    setMoreConvosUrl(response.data.next_page_url)
                } else {
                    setMoreConvosUrl(null)
                }

                setLoadingMore(false)
            }
        } catch (error) {
            Toast.error("Unexpected error fetching messages, please try again.")
            setLoadingMore(false)
        }
    }

    const loadMoreCurrentConvo = async () => {
        try {
            setLoadingMoreCurrentConvo(true)
            const response = await API.get(moreCurrentConvoUrl)

            if (response && response.data && response.data.data) {
                setConvo([
                    ...convo,
                    ...response.data.data.map(mapConvo)
                ])
                if (response.data.next_page_url) {
                    setMoreCurrentConvoUrl(response.data.next_page_url)
                } else {
                    setMoreCurrentConvoUrl(null)
                }

                setLoadingMoreCurrentConvo(false)
            }
        } catch (error) {
            Toast.error("Unexpected error fetching messages, please try again.")
            setLoadingMoreCurrentConvo(false)
        }
    }

    const sendMsg = async () => {

        if (sendingMessage || window._sendDebounce) { return }

        window._sendDebounce = true
        const msg = message
        setMessage("")

        try {
            setSendingMessage(true)
            const response = await API.post('user/messages/add/' + activeConvo.id, {
                message,
                attachments
            })

            setSendingMessage(false)
            window._sendDebounce = false

            if (response && response.data && response.data.success) {

                const fromUser = activeConvo.from == user.id ? activeConvo.fromUser : activeConvo.toUser
                const toUser = activeConvo.from == user.id ? activeConvo.toUser : activeConvo.fromUser

                setConvo([
                    ...convo,
                    {
                        ...response.data.message,
                        from: fromUser,
                        to: toUser,
                        from_id: fromUser.id,
                        to_id: toUser.id,
                        created: new Date(response.data.message.created_at),
                        updated: new Date(response.data.message.updated_at)
                    }
                ])
                setAttachments([])
                // delay until next event loop tick
                setTimeout(() => {
                    const node = document.getElementById('convoContainer')
                    node.firstElementChild.scroll({ top: node.firstElementChild.scrollHeight, behavior: 'smooth' });
                }, 0)
            } else {
                Toast.error("Unexpected error sending your message, please try again.")
                setMessage(msg)
            }
        } catch (error) {
            Toast.error("Unexpected error sending your message, please try again.")
            setMessage(msg)
            setSendingMessage(false)
        }
    }

    const keyup = async event => {
        if ((!event.altKey && !event.shiftKey && !event.ctrlKey) && event.code == "Enter" && message && !sendingMessage && !window._sendDebounce) {
            sendMsg()
        }
    }

    const switchView = async (view) => {
        
        setConvo(null)
        setConvos([])
        setActiveConvo({from: null, to: null, fromUser: null, toUser: null})
        setView(view)
    }

    const favouriteConvo = async () => {

        try {
            const response = await API.post('/user/messages/favourite/' + activeConvo.id)
            if (response && response.data && response.data.success) {
                const cs = convos.filter(c => c.id != activeConvo.id)
                setConvos(cs)
                setActiveConvo({from: null, to: null, fromUser: null, toUser: null})
                setConvo(null)
                Toast.success("Conversation moved to " + (view == 'favourites' ? 'active chats' : 'favourites'))
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error(`Failed to move conversation to ${view == 'favourites' ? 'active chats' : 'favourites'}. Please try again.`)
        }
    }

    const archiveConvo = async () => {
        try {
            const response = await API.post('/user/messages/archive/' + activeConvo.id)
            if (response && response.data && response.data.success) {
                const cs = convos.filter(c => c.id != activeConvo.id)
                setConvos(cs)
                setActiveConvo({from: null, to: null, fromUser: null, toUser: null})
                setConvo(null)
                Toast.success("Conversation moved to " + (view == 'archived' ? 'active chats' : 'archive'))
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error(`Failed to move conversation to ${view == 'archived' ? 'active chats' : 'archive'}. Please try again.`)
        }
    }

    const attachFile = async () => {

        const newAttachments = []
        setSendingMessage(true)

        try {
            for(const file of fileInputRef.current.files) {
                const formdata = new FormData()
                formdata.append("file", file)

                const response = await API.post("upload/private", formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
    
                if (response && response.data && response.data.url) {
                    newAttachments.push(response.data.url)
                } else {
                    throw new Error("Unexpected API response")
                }
            }
        } catch (error) {
            Toast.error("Unexpected error attaching file. Please try again.")
        }
        setSendingMessage(false)
        setAttachments([...attachments, ...newAttachments])
    }

    const startAttachment = event => {
        fileInputRef && fileInputRef.current && fileInputRef.current.click()
    }

    const removeAttachment = index => {
        const a = [...attachments]
        a.splice(index, 1)
        setAttachments(a)
    }

    const download = async doc => {

        try {
            const response = await API.post('user/messages/download_attachment', {
                file: doc
            }, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', doc.substring(doc.lastIndexOf('/') + 1))
            link.click()
        } catch (error) {
            Toast.error("Failed to download document. Please try again.")
        }
    }

    return <>
        <Helmet>
            <title>Messages - Qualified Tutors</title>
        </Helmet>

        <Container style={style ? style : {}} activeConvo={!!activeConvo.toUser}>
            <FixedWidth>
                <Column className='container-column'>
                    <Tabs className="tab-container">
                        <Tab onClick={e => switchView('active')} active={view == 'active'}>Active Chats</Tab>
                        <Tab onClick={e => switchView('favourites')} active={view == 'favourites'}>Favourites</Tab>
                        <Tab onClick={e => switchView('archived')} active={view == 'archived'}>Archived</Tab>
                    </Tabs>
                
                    <Row style={{gap: 0}} className="main">
                        <Card className={"list" + (initialLoading ? ' centered' : '')}>
                            <ConvoSearch activeConvo={!!activeConvo.toUser}>
                                <img alt="close conversation" src="/img/left_arrow.svg" onClick={e => setActiveConvo({from: null, to: null, fromUser: null, toUser: null})} />
                                <Input placeholder="Search all conversations" value={convoSearch} onChange={e => setConvoSearch(e.target.value)} />
                            </ConvoSearch>

                            {initialLoading ? <RingLoader colour={Colours.b500} /> : null}

                            <Scrollbars autoHeight autoHeightMax={`calc(100vh - 164px - 42px)`} className="list-scroll">
                                {!initialLoading ? <>
                                    
                                    {convos.map(convo => <ListConvo className='list-convo-item' active={convo.from_id == activeConvo.from && convo.to_id == activeConvo.to} onClick={e => setActiveConvo({from: convo.from_id, to: convo.to_id, fromUser: convo.from, toUser: convo.to, id: convo.id})}>
                                        <UserIcon user={convo.from} />
                                        <Column style={{flex: 1}}>
                                            <Row style={{justifyContent: 'space-between', flex: 1}}>
                                                <ListName>{convo.from.name} {convo.from.surname}</ListName>
                                                <ListDate>{new Date(convo.messages.length > 0 ? convo.messages[0].created_at : convo.created_at).toLocaleString('default', { month: 'short' })} {new Date(convo.messages.length > 0 ? convo.messages[0].created_at : convo.created_at).getDate()}</ListDate>
                                            </Row>
                                            <Row>
                                                <ListMsg>{convo.message.slice(0, 54)}</ListMsg>
                                            </Row>
                                        </Column>
                                    </ListConvo>)}
                                    
                                    {moreConvosUrl ? 
                                        <Button primary disabled={loadingMore} onClick={loadMore} style={{marginTop: '8px', width: '100%'}}>{loadingMore ? <RingLoader small /> : 'Load More'}</Button> 
                                    : null}
                                </> : null}
                                
                            </Scrollbars>
                        </Card>

                        <Card className={"convo" + (loadingConvo ? ' centered' : '')}>
                            {loadingConvo ? <RingLoader colour={Colours.b500} /> : null}
                            {!loadingConvo && activeConvo && activeConvo.fromUser ? <ConvoSearch>
                                <Row style={{alignItems: 'center'}} className="convo-header">
                                    <UserIcon user={activeConvo.fromUser} size={60}  />
                                    <ConvoName style={{fontWeight: 'bold', whiteSpace: 'nowrap', height: '46px'}}>{activeConvo.fromUser.name} {activeConvo.fromUser.surname}</ConvoName>
                                    <Input placeholder="Search this conversation" value={activeConvoSearch} onChange={e => setActiveConvoSearch(e.target.value)} />
                                </Row>
                                <Row style={{position: 'relative', top: '4px'}}>
                                    <div className='action' onClick={favouriteConvo}>
                                        <img alt="favourite tutor" src={view == 'favourites' ? "/img/heart_full.svg" : "/img/heart.svg"} /> {view == 'favourites' ? 'Un-' : ''}Favourite
                                    </div>
                                    <div className='action' onClick={archiveConvo}>
                                        {view == 'archived' ? 'Un-' : ''}Archive
                                    </div>

                                    {activeConvo.fromUser.role == 'tutor' ? 
                                        <Link>View tutor profile</Link>
                                    : null}
                                </Row>
                                
                            </ConvoSearch> : null}
                            <Scrollbars autoHeight autoHeightMax={`calc(100vh - 164px - 233px)`} id="convoContainer">
                                {moreCurrentConvoUrl ? <Button primary disabled={loadingMoreCurrentConvo} onClick={loadMoreCurrentConvo} style={{width: '100%'}}>{loadingMoreCurrentConvo ? <RingLoader small /> : 'Load Older Messages'}</Button>  : null}
                                {convo ? convo.sort((a, b) => {
                                    if (a.created > b.created) {
                                        return 1
                                    } else if (a.created < b.created) {
                                        return -1
                                    } else {
                                        return 0
                                    }
                                }).map(msg => <ListConvo style={{cursor: 'unset'}}>
                                    <UserIcon user={msg.from} />
                                    <Column style={{flex: 1}}>
                                        <Row style={{justifyContent: 'space-between', flex: 1}}>
                                            <ListName>{msg.from.name} {msg.from.surname}</ListName>
                                            <ListDate>{msg.created.toLocaleString('default', { month: 'short' })} {msg.created.getDate()} @ {msg.created.toLocaleString('default', { hour: 'numeric', hour12: true, minute: '2-digit' })}</ListDate>
                                        </Row>
                                        <Row style={{flexDirection: 'column', gap: '4px'}}>
                                            {msg.message.split("\n").map(m => <ListMsg>{m}</ListMsg>)}
                                        </Row>
                                        <Row style={{flexWrap: 'wrap', gap: '8px'}}>
                                            {JSON.parse(msg.attachments).map(attachment => {
                                                let parts = attachment.split('%2F')
                                                if (parts.length == 1) {
                                                    parts = attachment.split('/')
                                                }

                                                return <Attachment onClick={e => download(attachment)}>
                                                    <img alt="download" src="/img/download_20.webp" />
                                                    {parts[parts.length - 1]}
                                                </Attachment>
                                            })}
                                        </Row>
                                    </Column>
                                </ListConvo>) : null}
                            </Scrollbars> 

                            {convo ? 
                            
                                <MessageBar className="message-bar">
                                    <Column style={{flex: 1}}>
                                        <Input text style={{marginBottom: '-4px'}} value={message} onChange={e => setMessage(e.target.value)} onKeyUp={keyup} />
                                        
                                        <Row style={{marginTop: '8px', gap: '8px'}}>
                                            {attachments.map((attachment, index) => {
                                                let parts = attachment.split('%2F')
                                                if (parts.length == 1) {
                                                    parts = attachment.split('/')
                                                }

                                                return <Tag><TagText>{parts[parts.length - 1]}</TagText> <img alt="remove" src="/img/close.webp" style={{cursor: 'pointer', width: '16px', height: '16px'}} onClick={e => removeAttachment(index)} /></Tag>
                                            })}
                                        </Row>
                                    </Column>
                                    
                                    <Column style={{justifyContent: 'flex-start', gap: '23px'}}>
                                        <input style={{display: 'none'}} type="file" ref={fileInputRef} onChange={attachFile} multiple />
                                        <Button outline bgWhite onClick={startAttachment}>{sendingMessage ? <RingLoader small /> : 'Attach'}</Button>
                                        <Button primary onClick={sendMsg}>{sendingMessage ? <RingLoader small /> : 'Send'}</Button>
                                    </Column>
                                </MessageBar> 
                            
                            : null}
                        </Card>
                    </Row>
                </Column>
            </FixedWidth>
        </Container>
    </>
}

export default Messages