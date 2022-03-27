import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../Components/FixedWidth'
import Card from '../../Components/Card'
import Input from '../../Components/Input'
import Checkbox from '../../Components/Checkbox'
import Link from '../../Components/Link'
import RingLoader from '../../Components/Loader/Ring'
import Toast from '../../Components/Toast'
import { API } from '../../Components/API'
import { EmailRegex } from '../../Config/Validation.js'

import UserContext from '../../UserContext.js'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Underline } from '../../Components'

const Container = styled.div`
    margin-top: 64px;
    margin-bottom: 64px;

    h1 {
        font-size: 48px;
        margin-bottom: 64px;
    }

    & .fixedWidth {
        padding: 0 32px;
    }

    @media screen and (max-width: 800px) {
        margin-top: 32px;
        margin-bottom: 32px;

        h1 {
            margin-bottom: 24px;
            margin-top: 0;
        }
    }

    @media screen and (max-width: 640px) {
        & .fixedWidth {
            padding: 0 16px;
        }

        & .card {
            padding: 32px;
        }
    }

    @media screen and (max-width: 420px) {
        & .controlrow {
            flex-direction: column;
            align-items: flex-start;

            & > a {
                order: 1;
            }

            & > div {
                order: 0;
            }
        }

        & .signinrow {
            flex-direction: column;

            & > div {
                order: 1;

            }

            & > a {
                order: 0;
                margin-bottom: 16px;
            }
        }
    }
`

/**
 * Login page
 */
function Login(props) {

    let ctx = null

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [generalError, setGeneralError] = useState("")
    
    const emailRef = useRef()

    const history = useHistory()

    const login = async (event, context) => {

        event.preventDefault()
        let hasErrors = false
        setEmailError("")
        setPasswordError("")

        if (email == "") {
            setEmailError("Email is required")
            hasErrors = true
        } else if (!email.match(EmailRegex)) {
            setEmailError("Invalid email address")
            hasErrors = true
        }

        if (password == "") {
            setPasswordError("Password is required")
            hasErrors = true
        }

        if (!hasErrors) {
            setLoading(true)
            
            try {
                const response = await API.post('login', {
                    email,
                    password,
                    rememberMe
                })
            
                if (response && response.errors && response.errors.email) {
                    setEmailError(response.errors.email)
                    hasErrors = true
                }

                if (response && response.errors && response.errors.password) {
                    setPasswordError(response.errors.password)
                    hasErrors = true
                }

                if (response && response.data && !response.data.success) {
                    if (response.data.errors.email) {
                        //setGeneralError(response.data.errors.email)
                        Toast.error(response.data.errors.email)
                    } else {
                        //setGeneralError("An unknown error has occured, please try again.")
                        Toast.error("An unknown error has occured, please try again.")
                    }
                    hasErrors = true
                }
                context.setUser(response.data.user)
                setLoading(false)

                if (!hasErrors) {
                    if (response.data.user.role == 'admin') {
                        history.push('/admin/overview')
                    } else {
                        history.push('/dashboard')
                    }
                }
            } catch (error) {
                hasErrors = true
                //setGeneralError("An unknown error has occured, please try again.")
                Toast.error("An unknown error has occured, please try again.")
                setLoading(false)
            }
        }
    }

    const updateEmail = event => {
        setEmail(event.target.value)
        if (emailError && email.match(EmailRegex)) {
            setEmailError("")
        }

        if (generalError) {
            setGeneralError("")
        }
    }

    const updatePassword = event => {
        setPassword(event.target.value)
        if (passwordError && password.length >= 8) {
            setPasswordError("")
        }
        
        if (generalError) {
            setGeneralError("")
        }
    }

    const submitOnEnter = useCallback(event => {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            login(event, ctx)
        }
    }, [email, password])

    useEffect(() => {   
        window.addEventListener('keyup', submitOnEnter)

        return () => window.removeEventListener('keyup', submitOnEnter)
    }, [submitOnEnter])

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus()
        }
    }, [emailRef])

    return (<>
        <Helmet>
            <title>Sign in - Qualified Tutors</title>
        </Helmet>
    
    
        <UserContext.Consumer>
        {context => {

            ctx = context

            return <Container>
                <FixedWidth width="720px">
                    <h1>S<Underline>ign in.</Underline></h1>

                    <Card>
                        <Input forwardRef={emailRef} label="Email" error={emailError} value={email} valid={email.match(EmailRegex)} onChange={updateEmail} />
                        <Input label="Password" type="password" error={passwordError} value={password} valid={password.length >= 8} onChange={updatePassword} />
                       
                        <div className='controlrow' style={{display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '8px', marginBottom: '64px', alignItems: 'center'}}>
                            <Link primary to="/forgot-password">Forgot password?</Link>
                            <Checkbox value={rememberMe} setter={setRememberMe} label="Remember me" />
                       </div>
     
                        <div className='signinrow' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>Not a member yet? <Link to="/register" primary>Sign up</Link></div>
                            <Link btn primary onClick={e => login(e, context)}>{loading ? <RingLoader small /> : 'Sign in'}</Link>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '32px', marginBottom: '-16px'}}>
                            <div>Need help? <Link to="/contact-us" primary>Contact us</Link></div>
                        </div>
                    </Card>
                </FixedWidth>
            </Container>
        }}
        </UserContext.Consumer>
    </>)
}

export default Login
