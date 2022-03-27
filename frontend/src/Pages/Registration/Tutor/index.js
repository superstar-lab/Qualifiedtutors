import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Colours from '../../../Config/Colours.js'
import FixedWidth from '../../../Components/FixedWidth'
import Card from '../../../Components/Card'
import Input from '../../../Components/Input'
import Checkbox from '../../../Components/Checkbox'
import Link from '../../../Components/Link'
import Progress from './Components/Progress'
import CircleSVG from '../../../Components/Circle'
import { EmailRegex } from '../../../Config/Validation.js'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Underline from '../../../Components/Underline/index.js'

const Container = styled.div`
    margin: 64px;

    & h1 {
        font-size: 48px;
        margin-bottom: 80px;
        white-space: nowrap;
        display: flex;
    }

    & h2, & p {
        position: relative;
    }

    & p {
        font-size: 18px;
        line-height: 32px;
        color: ${Colours.n500};
    }

    & .circleSVG {
        position: absolute;
        top: 32px;
        right: 32px;
    }

    & .mainsplit {
        gap: 32px;
    }

    @media screen and (max-width: 980px) {
        & h1 {
            flex-direction: column;
            margin-bottom: 96px;
        }

        & .mainsplit {
            flex-direction: column;
            gap: 0;

            & .form {
                max-width: unset !important;
                margin-right: 0 !important;
            }
        }
    }

    @media screen and (max-width: 800px) {
        margin: 32px;
    }

    @media screen and (max-width: 720px) {
        margin: 16px;

        & .card {
            padding: 32px 32px 64px 32px;
        }
    }

    @media screen and (max-width: 480px) {
        .acceptBtn {
            font-size: 16px;
            padding: 16px 18px;
        }
    }

    @media screen and (max-width: 400px) {
        & .card {
            padding: 16px 16px 32px 16px;
        }

        & h1 {
            margin-bottom: 32px;
        }

        & .namesplit {
            flex-direction: column;

            & > div {
                width: 100% !important;
            }
        }
    }

    @media screen and (max-width: 360px) {
        .acceptBtn {
            padding: 9px;
        }
    }
`

const Split = styled.div`
    display: flex;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`


const Error = styled.div`
    white-space: nowrap;
   color: ${Colours.r400}; 
`

const Circle = styled.div`
    
`

/**
 * Tutor Registration - Account Information
 * 
 * Collects name, email, password & TOS acceptance.
 * 
 * Reads/writes the following from the localstorage variable "registration":
 *  - firstName
 *  - lastName
 *  - email
 *  - password
 *  - acceptTos
 * 
 */
function TutorRegistration(props) {
    
    const history = useHistory()
    const location = useLocation()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [acceptTos, setAcceptTos] = useState(false)
   
    const [firstNameError, setFirstNameError] = useState("")
    const [lastNameError, setLastNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [acceptTosError, setAcceptTosError] = useState("")

    useEffect(() => {
        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.firstName) { setFirstName(reg.firstName) }
        if (reg.lastName)  { setLastName(reg.lastName) }
        if (reg.email)     { setEmail(reg.email) }
        if (reg.password)  { setPassword(reg.password) }
        if (reg.acceptTos) { setAcceptTos(reg.acceptTos) }
    }, [])

    const saveAndContinue = event => {
        let hasErrors = false

        /*
        if (firstName == "") {
            hasErrors = true
            setFirstNameError("First name is required")
        } else {setFirstNameError(null)}

        if (lastName == "") {
            hasErrors = true
            setLastNameError("Last name is required")
        } else {setLastNameError(null)}
        */

        if (!email.toLowerCase().match(EmailRegex)) {
            hasErrors = true
            setEmailError("Please enter a valid email")
        } else {setEmailError(null)}

        if (password.length < 8) {
            hasErrors = true
            setPasswordError("Password must be at least 8 characters")
        } else {
            setPasswordError(null)
        }

        if (!acceptTos) {
            hasErrors = true
            setAcceptTosError("You must accept the terms and conditions")
        } else (setAcceptTosError(null))

        if (hasErrors) {
            event.preventDefault()
        } else {
            const reg = JSON.parse(window.localStorage.getItem("registration"))
            
            reg.firstName = firstName
            reg.lastName = lastName
            reg.email = email
            reg.password = password
            reg.acceptTos = acceptTos
            reg.progress.current = "address"
            reg.progress.complete = 2

            window.localStorage.setItem("registration", JSON.stringify(reg))
            window.scrollTo(0, 0)
        }
    }

    const getProgress = () => {
        if (location && location.state && location.state.progress) {
            return location.state.progress
        } else {
            return {
                current: 'account',
                steps: [],
            }
        }
    }

    return <>
        <Helmet>
            <title>Account information - Qualified Tutors</title>
        </Helmet>
        
        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...getProgress()} /></h1>
                <Card>
                    <CircleSVG colour={Colours.t050}>2</CircleSVG>

                    <Split className='mainsplit'>
                        <Column>
                            <h2>Account information</h2> 
                            <p style={{maxWidth: '375px'}}>After the sign up process, we will send a link to your email address. You need to click it to verify your account.</p>
                        </Column>

                        <Column className='form' style={{marginRight: '129px', maxWidth: '393px', marginTop: '24px'}}>
                            <Split className='namesplit'>
                                <Column style={{width: '50%', marginRight: '16px'}}>
                                    <Input label="First name" valid={firstName.length > 0}  onChange={e => setFirstName(e.target.value)} value={firstName} error={firstNameError} />
                                </Column>

                                <Column style={{width: '50%'}}>
                                    <Input label="Last name" valid={lastName.length > 0} onChange={e => setLastName(e.target.value)} value={lastName} error={lastNameError} />
                                </Column>
                            </Split>
                            <Column>
                                <Input label="Enter your Email" valid={email.toLowerCase().match(EmailRegex)} onChange={e => setEmail(e.target.value)} value={email} error={emailError} />
                            </Column>
                            <Column>
                                <div style={{position: 'relative'}}>
                                    <Input error={passwordError ? true : false} valid={password.length >= 8} validRight="36px" validBottom="15px"  autocomplete="off" label="Create password" type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.target.value)} value={password} style={{borderColor: emailError ? Colours.r400 : Colours.n300}} />
                                    <img alt="show/hide password" src="/img/eye.webp" style={{width: '20px', cursor: 'pointer', position: 'absolute', right: '12px', top: '47.4px'}} onClick={e => setShowPassword(!showPassword)}  />
                                </div>
                                <p style={{marginTop: '0', color: passwordError ? Colours.r400 : Colours.n200}}>Password must be 8 characters long</p>
                                <Column>
                                    <Checkbox value={acceptTos} setter={setAcceptTos} label={<span>I accept the <Link primary target="_blank" to="/terms-of-service" onClick={e => e.stopPropagation()}>terms and conditions</Link></span>} />
                                    {acceptTosError ? <Error style={{marginTop: '4px'}}>{acceptTosError}</Error> : null}
                                </Column>
                            </Column>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                            <Link black to="/register" style={{display: 'flex'}}><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp;  Back</Link> 
                        </div>

                        <div>
                            <Link style={{marginRight: '24px'}} black disabled={!email || password.length < 8 || !acceptTos} to={{
                                    pathname: "/register-tutor-address",
                                    state: {
                                        progress: {
                                            ...getProgress(),
                                            steps: [...getProgress().steps, 'account'],
                                            current: 'address',
                                            complete: 2
                                        }
                                    }
                                }} 
                                onClick={saveAndContinue}>Save as draft</Link>

                            <Link className="acceptBtn" primary btn disabled={!email || password.length < 8 || !acceptTos} 
                                to={{
                                    pathname: "/register-tutor-address",
                                    state: {
                                        progress: {
                                            ...getProgress(),
                                            steps: [...getProgress().steps, 'account'],
                                            current: 'address',
                                            complete: 2
                                        }
                                    }
                                }} 
                                onClick={saveAndContinue}
                            >SAVE AND CONTINUE</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>
}

export default TutorRegistration
