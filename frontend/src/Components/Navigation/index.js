import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLocation, useHistory } from 'react-router-dom'
import Link from '../Link'
import Card from '../Card'
import Toast from '../Toast'
import Button from '../Button'
import Colours from '../../Config/Colours.js'
import UserContext from '../../UserContext.js'
import { API } from '../API'
import { ToastContainer, Zoom } from 'react-toastify'
import Badge from '../Badge'
import zIndex from '../../Config/zIndex'
import Underline  from '../Underline'
import UserIcon from '../UserIcon'

const Container = styled.nav`
    display: flex;
    justify-content: space-between;
    background: white;
    height: 52.4px;
    padding: 12.8px 64px;
    border-bottom: 1px solid ${Colours.n800};

    & .user-icon {
        margin-left: 8px;
    }

    & .userMenu {
        &  li {
            text-align: left;
        }
    }

    @media screen and (max-width: 1150px) {
        padding: 12.8px 16px;
    }
    

`

const Column = styled.div`
    display: flex;
    flex-direction: column;

    &.outer {
        & .userMenu {
            & > li {


                &:after {
                    left: 16px;
                    transform: unset;
                    background-position: left center;
                }
            }
        }
    }

    & .Toastify {
        position: relative;
    }

    & .Toastify__toast-container {
        position: unset;
        width: 100%;
        padding: 0;
    }

    & .Toastify__toast--success {
        background: ${Colours.g300} !important;
    }

    & .Toastify__toast--default {
        background: ${Colours.b500} !important;
    }

    & .Toastify__toast--warning {
        background: ${Colours.y500} !important;
    }

    & .Toastify__toast--error {
        background: ${Colours.r500} !important;
    }

    & .Toastify__toast {
        position: relative;
        min-height: 40px;
        padding: 0;
        margin: 0;
        box-shadow: unset;
        font-size: 16px;
        line-height: 28px;
        display: flex;
        justify-content: center;
        color: white;
        border-radius: 0;
    }

    & .Toastify__close-button {
        position: absolute;
        right: 16px;
    }

    & .Toastify__toast-body {
        flex: unset;
    }
`

const MenuItem = styled.li`
    position: relative;
    transition: color .25s;
    color: ${Colours.n600};
    user-select: none;
    white-space: nowrap;

    &:hover a {
        color: black;
        font-weight: bold;
        margin-right: ${props => props.active ? '0' : '-1.5px'};
    }

    /*
    ${props => props.active ? `
        &:after {
            display: block;
            content: "";
            position: absolute;
            bottom: ${props.bottom};
            ${props.right ? `right: ${props.right};` : ''}
            ${props.left ? `left: ${props.left};` : ''}
            width: ${props.width};
            height: ${props.height};
            background: url('/img/line.svg') no-repeat center center;
            background-size: contain;
        }
    ` : ''};
    */
`

const UserOptions = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 64px;

  

    & .card {
        position: absolute;
        opacity: 0;
        transition: opacity .25s, top .25s;
        top: 32px;
        right: 0;
        pointer-events: none;
        width: 200px;
        flex-direction: column;
        padding: 16px;
        width: 200px;
        z-index: ${zIndex.modal + 100};

        & ul {
            flex-direction: column;
            list-style-type: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;

            @media screen and (max-width: 1150px) {
                gap: 24px;
            }

            & li.divider {
                border-top: 1px solid ${Colours.n300};
            }

            & li a {
                width: 100%;
                display: block;

                &:hover {
                    color: black;
                }
            }
        }
    }

    & .badge {
        position: absolute;
        right: 16px;
        bottom: 20px;
    }

    &:hover .card {
        opacity: 1;
        pointer-events: auto;
        top: 36px;
        display: flex;
        right: 0;

    }
`

const DesktopNav = styled.ul`
    display: flex;
    list-style-type: none;
    justify-content: center;
    align-items: center;    
    gap: 32px;

    & li {
        text-align: center;
        white-space: nowrap;
    }

    & > li:first-of-type { width: 72px; }
    & > li:nth-of-type(2) { width: 90px; }
    & > li:nth-of-type(3) { width: 110px; }
    & > li:nth-of-type(4) { width: 92px; }

    @media screen and (max-width: 1150px) {
        display: none;
    }
`

const MobileNav = styled.div`
    display: none;

    @media screen and (max-width: 1150px) {
        display: block;
    }
`

const MenuButton = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 40px;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;

    &:hover > div {
        background: ${Colours.n100};
    }

    & > div:first-of-type {
        transform-origin: top left;
    }

    & > div:nth-of-type(2) {
        transform-origin: center center;
    }

    & > div:last-of-type {
        transform-origin: bottom left;
    }

    ${props => props.open ? `
        & > div:first-of-type {
            transform: rotate(45deg);
        }

        & > div:nth-of-type(2) {

            opacity: 0;
            transform: scale(0);
        }

        & > div:last-of-type {
            transform: rotate(-45deg);
        }
    ` : ''}
`

const MobileMenu = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 24px;
    transition: transform .25s;
    position: absolute;
    top: 78px;
    left: 0;
    width: calc(100vw - 64px);
    transform-origin: top center;
    z-index: ${zIndex.navigation};
    max-height: calc(100vh - 79px);
    overflow-y: scroll;
    background: white;
    list-style-type: none;
    margin: 0;
    border-bottom: 1px solid #E0E0E0;
    padding: 18px 32px 24px 32px;

    & .useropts {
        margin-left: 0;
        top: 0;

        & > img, & > b { display: none; }

        & .card {
            position: unset;
            opacity: 1;
            top: unset;
            width: 100%;
            border: 0;
            box-shadow: unset;
            margin: 0;
            padding: 0;
        }

        & .badge {
            position: relative !important;
            right: unset !important;
            bottom: unset !important;
        }

        @media screen and (max-width: 1150px) {
            .user-icon {
                display: none;
            }
        }
    }

    & .register {
        margin: 0 0 16px 0 !important;
        display: block;
    }

    & .login {
        display: block;

        &:hover {
            color: ${Colours.b550};
        }
    }

    & > li:last-of-type {
        border-top: 1px solid #E0E0E0;
        padding-top: 16px;
    }

    & > li {
        &:after {
            transform: unset;
            background-position: left center;
        }
        
       
    }

    

    @media screen and (min-width: 1150px) {
        display: none;
    }
     
    ${props => props.open ? `
        transform: scaleY(1);
    ` : `
        transform: scaleY(0);
    `}
`

const Line = styled.div`
    height: 4px;
    width: 100%;
    background: ${Colours.n400};
    transition: transform .25s, height .25s, opacity .25s;
`

const AdminReturn = styled.div`
    width: 100%;
    background: ${Colours.r500};
    color: white;
    padding: 4px 0;
    display: flex;
    justify-content: center;
    align-items: center;

    & button {
        color: white;
        background: transparent;
    }
`

const ToastCloseButton = ({closeToast}) => <img 
    style={{
        width: '20px', 
        height: '20px',
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)'
    }} 
    className="toast-close-btn"
    onClick={closeToast} 
    src="/img/cross_white_20.webp" 
    alt="close toast"
/>

/**
 * Navigation 
 * 
 * Sites main navigation, both desktop and mobile.
 * Also houses the toast notifications and updates the users unread message count.
 * 
 * @param user 
 * @param setUnreadMessageCount 
 */
function Navigation({user, setUnreadMessageCount}) {
    
    const location = useLocation()
    const history = useHistory()

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [unreadMessages, setUnreadMessages] = useState(0)

    const logout = async onSuccess => {
        try {
            const response = await API.get('logout')
            history.push('/')
            onSuccess()
        } catch(error) {
            Toast.error("Unexpected error occured, please try again.")
        }
    }

    const returnToAdmin = async (token, setUser, to) => {
        try {
            const response = await API.post('admin/users/return', {
                return_token: token
            })
    
            if (response && response.data && response.data.success) {
                setUser(response.data.user)
                if (to) {
                    history.push(to)
                } else {
                    history.push('/admin/manage-users')
                }
                
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Unexpected error returning to admin session. Please try again.")
        }
    }

    useEffect(() => {
        let messageCheckInterval = null

        const updateUnreadMessageCount = async () => {
            const response = await API.get('user/messages/unread_count')
            if (response && (response.data || response.data == 0)) {
                setUnreadMessages(response.data)
                setUnreadMessageCount(response.data)
            }
        }

        if (user) {
            updateUnreadMessageCount()
            messageCheckInterval = setInterval(updateUnreadMessageCount, 1000 * 60)        
        }
        
        return () => clearInterval(messageCheckInterval)
    }, [user])

    const userMenu = <li>
        <UserContext.Consumer>
            {context => !context.user ? <>
                <Link primary to="/register" className="register" style={{margin: '0 32px 0 40px'}} onClick={e => setMobileMenuOpen(false)}>{location.pathname.startsWith('/register') ? <Underline offset={'-12px'}>Sign up</Underline> : 'Sign up'}</Link>
                <Link primary btn small to="/sign-in" className="login" onClick={e => setMobileMenuOpen(false)}>Sign in</Link>
            </> : <UserOptions className="useropts">
                {context.user.tutor_type == 'agency' ? 
                    <b>{context.user.company_name}</b>
                :
                    <b>{context.user.name} {context.user.surname}</b>
                }
                
                <UserIcon user={context.user} initials="UN" />
                {unreadMessages ? <Badge>{unreadMessages < 10 ? unreadMessages : '9+'}</Badge> : null}

                <Card>
                    <ul className="userMenu">
                        {context.user.role == 'tutor' ? <MenuItem 
                            onClick={e => setMobileMenuOpen(false)} 
                            active={location.pathname == '/profile'}
                            left="28px !important"
                            bottom="-9px"
                            height="8.6px"
                            width="72.7px"
                        ><Link active={location.pathname == '/profile'} to="/profile">My Profile</Link></MenuItem> : null}
                        {context.user.role != 'admin' ? <MenuItem 
                            onClick={e => setMobileMenuOpen(false)} 
                            active={location.pathname == '/dashboard'}
                            left="38px !important"
                            bottom="-9px"
                            height="8.6px"
                            width="72.7px"
                        ><Link active={location.pathname == '/dashboard'} to="/dashboard">Dashboard</Link></MenuItem> : null}
                        <MenuItem 
                            onClick={e => setMobileMenuOpen(false)} 
                            active={location.pathname == '/dashboard/personal-details'}
                            left="82px !important"
                            bottom="-9px"
                            height="8.6px"
                            width="72.7px"
                        ><Link active={location.pathname == '/dashboard/personal-details'} to="/dashboard/personal-details">Account Settings</Link></MenuItem>
                        {context.user.role == 'tutor' ? 
                            <MenuItem 
                                onClick={e => setMobileMenuOpen(false)} 
                                active={location.pathname == '/dashboard/subjects'}
                                left="118px !important"
                                bottom="-9px"
                                height="8.6px"
                                width="72.7px"
                            ><Link active={location.pathname == '/dashboard/subjects'} to="/dashboard/subjects">Tutor Profile Settings</Link></MenuItem>
                        : null}
                        <MenuItem
                            onClick={e => setMobileMenuOpen(false)}  
                            active={location.pathname == '/messages'}
                            left="28px !important"
                            bottom="-9px"
                            height="8.6px"
                            width="72.7px"
                        ><Link style={{display: 'flex'}} active={location.pathname == '/messages'} to="/messages">Messages {unreadMessages > 0 ? <Badge>{unreadMessages}</Badge> : null}</Link></MenuItem>

                        {context.user.role == 'admin' ? <>
                            <li className="divider"></li>    
                            <MenuItem 
                                onClick={e => setMobileMenuOpen(false)} 
                                active={location.pathname.startsWith('/admin')}
                                right="-13px"
                                bottom="-9px"
                                height="8.6px"
                                width="72.7px"
                            ><Link active={location.pathname.startsWith('/admin')} to="/admin/overview">Administration</Link></MenuItem>
                        </> : null}

                        <li className="divider"></li>
                        <MenuItem 
                            onClick={e => setMobileMenuOpen(false)} 
                            active={location.pathname == '/help'}
                            left="-6px !important"
                            bottom="-9px"
                            height="8.6px"
                            width="72.7px"
                        ><Link active={location.pathname == '/help'} to="/help">Help</Link></MenuItem>
                        <li><Link to="/" onClick={e => { logout(() => context.setUser(null)); }}>Sign Out</Link></li>
                    </ul>
                </Card>
            </UserOptions>}
        </UserContext.Consumer>
    </li>

    return (<Column className="outer" style={{position: 'sticky', top: '0', zIndex: zIndex.navigation}}>
        <Container>
            <img alt="Qualified Tutors logo" onClick={e => {history.push('/'); setMobileMenuOpen(false);}} src="/img/logo.svg" style={{width: '198.067px', height: '52.4px', cursor: 'pointer'}} />
            <DesktopNav>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/'}
                    right="-1px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/'} to="/">Home</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/find-a-tutor'}
                    right="-14px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/find-a-tutor'} to="/find-a-tutor">Find a tutor</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/how-it-works'}
                    right="-6px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/how-it-works'} to="/how-it-works">How it works</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/contact-us'}
                    right="-13px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/contact-us'} to="/contact-us">Contact us</Link></MenuItem>
                
                {userMenu}
            </DesktopNav>

            <MobileNav>
                <MenuButton open={mobileMenuOpen} onClick={e => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Line />
                    <Line />
                    <Line />
                </MenuButton>
            </MobileNav>
        </Container>

          <ToastContainer
                position="top-right"
                autoClose={3500}
                hideProgressBar
                newestOnTop={false}
                transition={Zoom}
                icon={false}
                closeButton={ToastCloseButton}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
          />
        <UserContext.Consumer>
            {context => context && context.user && context.user.return_token ? <AdminReturn>
                You are impersonating a user. &nbsp; <Button outline white onClick={e => returnToAdmin(context.user.return_token, context.setUser, context.user.return_to)}>Click here</Button> &nbsp; to return to your admin session.
            </AdminReturn> : null}
        </UserContext.Consumer>
        <MobileMenu open={mobileMenuOpen}>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/'}
                    left="0px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/'} to="/">Home</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/find-a-tutor'}
                    left="36px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/find-a-tutor'} to="/find-a-tutor">Find a tutor</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/become-a-tutor'}
                    left="70px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/become-a-tutor'} to="/become-a-tutor">Become a tutor</Link></MenuItem>
                <MenuItem 
                    onClick={e => setMobileMenuOpen(false)} 
                    active={location.pathname == '/how-it-works'}
                    left="49px"
                    bottom="-9px"
                    height="8.6px"
                    width="72.7px"
                ><Link active={location.pathname == '/how-it-works'} to="/how-it-works">How it works</Link></MenuItem>
                
                {userMenu}
        </MobileMenu>
    </Column>
    )
}

export default Navigation

