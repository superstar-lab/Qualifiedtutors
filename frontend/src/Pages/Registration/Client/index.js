import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import Colours from '../../../Config/Colours.js'
import FixedWidth from '../../../Components/FixedWidth'
import Card from '../../../Components/Card'
import Input from '../../../Components/Input'
import Checkbox from '../../../Components/Checkbox'
import Link from '../../../Components/Link'
import Toast from '../../../Components/Toast'
import { API } from '../../../Components/API'
import { RingLoader } from '../../../Components/index.js'
import Progress from './Components/StudentProgress'
import CircleSVG from '../../../Components/Circle'

import { EmailRegex, PostcodeRegex, MobileNumberRegex } from '../../../Config/Validation.js'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'


const Container = styled.div`
    margin: 64px;

    & h1 {
        font-size: 48px;
        margin-bottom: 80px;
        white-space: nowrap;
        display: flex;
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

function ClientRegistration(props) {
    
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
    
    const [loading, setLoading] = useState(false)

    const persist = () => {
        let reg = JSON.parse(window.localStorage.getItem('registration'))
        if (!reg) { reg = {student: {}}}
        if (!reg.student) { reg.student = {} }

        reg.student.name = firstName
        reg.student.surname = lastName
        reg.student.email = email
        reg.student.password = password
        reg.student.acceptTos = acceptTos

        window.localStorage.setItem('registration', JSON.stringify(reg))
    }

    const back = event => {
        event.preventDefault()
        persist()

        history.push('/register')
    }

    const saveAndContinue = async event => {
        let hasErrors = false
        event.preventDefault()

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

            persist()

            const steps = [...location.state.progress.steps]    
            steps.push('account')

            history.push('/register-student-address', {
                progress: {
                    ...location.state.progress,
                    steps,
                    current: 'address',
                    complete: 2
                }
            })

            /*
            try {
                setLoading(true)
                const response = await API.post('register/client', {
                    name: firstName,
                    surname: lastName,
                    email,
                    password,
                    accept_tos: acceptTos,
                })

                if (response && response.data && response.data.success) {
                    Toast.success("Registration completed successfully, please sign in.")
                    history.push('/sign-in')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                    Toast.error("An unexpected error occured, please try again.")
                }
                setLoading(false)
            } catch (error) {
                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.email) {
                    Toast.error(error.response.data.errors.email)
                } else {
                    Toast.error("An unexpected error occured, please try again.")
                }
                setLoading(false)
            }
            */
        }
    }

    useEffect(() => {
        const reg = JSON.parse(window.localStorage.getItem('registration'))
        
        if (reg && reg.student) {
            if (reg.student.name) { setFirstName(reg.student.name) }
            if (reg.student.surname) { setLastName(reg.student.surname) }
            if (reg.student.email) { setEmail(reg.student.email) }
            if (reg.student.password) { setPassword(reg.student.password) }
            if (reg.student.acceptTos) { setAcceptTos(reg.student.acceptTos) }
        }
    }, [])

    const submitDisabled = !email || !email.toLowerCase().match(EmailRegex) || !acceptTos || password.length < 8

    return <>
        <Helmet>
            <title>Account information - Qualified Tutors</title>
        </Helmet>
        
        <FixedWidth>
            <Container>
                <h1>Sign up. <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
                <Card>
                    <CircleSVG colour={Colours.r050}>1</CircleSVG>
                    <Split>
                        <Column>
                            <h2>Account information</h2> 
                            <p style={{maxWidth: '375px'}}>After the sign up process, we will send a link to your email address. You need to click it to verify your account.</p>
                        </Column>

                        <Column style={{marginRight: '129px', maxWidth: '393px', marginTop: '24px'}}>
                            <Split>
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

                            <div style={{position: 'relative'}}>
                                <Input error={passwordError ? true : false} valid={password.length >= 8} validRight="36px" validBottom="15px"  autocomplete="off" label="Create password" type={showPassword ? 'text' : 'password'} onChange={e => setPassword(e.target.value)} value={password} style={{borderColor: emailError ? Colours.r400 : Colours.n300}} />
                                <img alt="show/hide password" src="/img/eye.webp" style={{width: '20px', cursor: 'pointer', position: 'absolute', right: '12px', top: '47.4px'}} onClick={e => setShowPassword(!showPassword)}  />
                            </div>
                            <p style={{marginTop: '0', color: passwordError ? Colours.r400 : Colours.n200}}>Password must be 8 characters long</p>
                            <Column>
                                <Checkbox value={acceptTos} setter={setAcceptTos} label={<span>I accept the <Link to="/terms-of-service" style={{color: Colours.b500}}>terms and conditions</Link></span>} />
                                {acceptTosError ? <Error style={{marginTop: '4px'}}>{acceptTosError}</Error> : null}
                            </Column>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                        <Link primary to="/register" onClick={back} style={{display: 'flex'}}><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '1.6px'}} src="/img/back-icon.svg" />&nbsp;  Back</Link> 
                        </div>

                        <div>
                            <Link primary btn disabled={submitDisabled} 
                                onClick={e => !submitDisabled && saveAndContinue(e)}
                            >{loading ? <RingLoader small /> : 'SAVE AND CONTINUE'}</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>
}

export default ClientRegistration
