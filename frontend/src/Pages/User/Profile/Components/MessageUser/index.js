import styled from 'styled-components'
import { useState, useEffect } from 'react'
import {
    Card,
    Input,
    Button,
    RingLoader,
    Toast,
    API,
    Checkbox,
    Link,
    Modal
} from '../../../../../Components'
import Colours from '../../../../../Config/Colours'
import { EmailRegex, MobileNumberRegex } from '../../../../../Config/Validation'
import toast from '../../../../../Components/Toast'
import UserContext from '../../../../../UserContext'

const Container = styled.div`
 & ._card {
     padding-left: 24px; 
     padding-right: 24px;
 }

& .msgbox {
    height: 191px;
    border: 2px solid ${Colours.n300};
}

& .modal {
    max-width: 480px;

    & h1 {
        margin: 0;
        font-size: 26px;
        color: ${Colours.n200};
        width: 100%;
        text-align: center;
        position: relative;
        top: -24px;
    }

    & .row {
        gap: 16px;
    }

    & .close {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 24px;
        right: 24px;
        cursor: pointer;
    }
}
`

const Row = styled.div`
    display: flex;
`

const ResponseTime = styled.div`
    font-size: 14px;
    color: ${Colours.n600};
    display: flex;
    flex: 1;
    justify-content: right;
    margin-top: -14px;
    margin-bottom: 32px;
`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: 4px;
`

function MessageUser({user, authedUser}) {

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [averageResponseTime, setAverageResponseTime] = useState(null)

    const [signupVisible, setSignupVisible] = useState(false)

    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [acceptTos, setAcceptTos] = useState(false)

    const [emailError, setEmailError] = useState(null)
    const [firstNameError, setFirstNameError] = useState(null)
    const [lastNameError, setLastNameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [mobileNumberError, setMobileNumberError] = useState(null)
    const [acceptTosError, setAcceptTosError] = useState(null)

    const [signupInProgress, setSignupInProgress] = useState(false)

    const sendMessage = async () => {

        if (!authedUser) {
            setSignupVisible(true)
            return
        }

        try {
            setLoading(true)
            const response = await API.post('user/messages/send/' + user.message_uuid, {
                message
            })

            if (response && response.data && response.data.success) {
                Toast.success("Your message has been sent")
                setMessage("")
            } else {
                Toast.error("An unexpected error occured sending your message, please try again.")    
            }
            setLoading(false)
        } catch(error) {
            Toast.error(
                error && error.response && error.response.data && error.response.data.error ? 
                    error.response.data.error 
                  : "An unexpected error occured sending your message, please try again."
            )
            setLoading(false)
        }
    }

    const signUp = async setUser => {
        
        let hasErrors = false

        if (!email.match(EmailRegex)) {
            setEmailError("Required")
            hasErrors = true
        }

        if (!email.match(EmailRegex)) {
            setEmailError("Must be a valid email")
            hasErrors = true
        }

        if (email && email.match(EmailRegex)) {
            setEmailError(null)
        }

        if (!firstName) {
            setFirstNameError("Required")
            hasErrors = true
        } else {
            setFirstNameError(null)
        }

        if (!lastName) {
            setLastNameError("Required")
            hasErrors = true
        } else {
            setLastNameError(null)
        }

        if (password.length < 8) {
            setPasswordError("Must be at least 8 characters")
            hasErrors = true
        }

        if (!password) {
            setPasswordError("Required")
            hasErrors = true
        }

        if (password && password.length >= 8) {
            setPasswordError(null)
        }

        const match = MobileNumberRegex.exec(mobileNumber.replaceAll(/\D/g, ''))
        console.log('mn match', mobileNumber, match)
        
        if (match === null) {
            setMobileNumberError("Must be a valid mobile number")
            hasErrors = true
        }

        if (!mobileNumber) {
            setMobileNumberError("Required")
            hasErrors = true
        }

        if (mobileNumber && mobileNumber.match(MobileNumberRegex)) {
            setMobileNumberError(null)
        }

        if (!acceptTos) {
            setAcceptTosError("You must accept the terms and conditions")
            hasErrors = true
        } else {
            setAcceptTosError("")
        }

        if (!hasErrors) {
            setSignupInProgress(true)
            try {
                const response = await API.post('/register/client', {
                    name: firstName,
                    surname: lastName,
                    email,
                    password,
                    accept_tos: acceptTos,
                    mobile_number: mobileNumber
                })

                if (response && response.data && response.data.success) {
                    setUser(response.data.user)
                    setSignupVisible(false)
                    toast.success("Successfully signed up & logged in.")
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {

                if (
                    (error && error.response && error.response.data && error.response.data.errors) &&
                    error.response.data.errors.hasOwnProperty('email')
                ) {
                    setEmailError(error.response.data.errors.email)
                } else {
                    toast.error("Unexpected error signing up. Please try again.")
                }
            }
            setSignupInProgress(false)
        }
    }

    useEffect(() => {
        if (user && user.average_response_time) {
            const minutes = user.average_response_time / 60
            
            if (minutes == -1) {
                setAverageResponseTime("")
            } else if (minutes <= 15) {
                setAverageResponseTime("15 minutes")
            } else if (minutes <= 30) {
                setAverageResponseTime("half an hour")
            } else if (minutes <= 60) {
                setAverageResponseTime("an hour")
            } else if (minutes <= (60 * 24)) {
                setAverageResponseTime(Math.round(minutes / 60) + " hours")
            } else if (minutes <= (60 * 24 * 7)) {
                const days = Math.round(minutes / 60 / 24)
                setAverageResponseTime(days + " day" + (days > 1 ? 's' : ''))
            } else if (minutes <= (60 * 24 * 7 * 4)) {
                const weeks = Math.round(minutes / 60 / 24 / 7)
                setAverageResponseTime(weeks + " week" + (weeks > 1 ? 's' : ''))
            } else {
                const months = Math.round(minutes / 60 / 24 / 7 / 4)
                setAverageResponseTime(months + " month" + (months > 1 ? 's' : ''))
            }
        }
    }, [user])

    const dismiss = event => {
        setEmail("")
        setFirstName("")
        setLastName("")
        setPassword("")
        setMobileNumber("")
        setAcceptTos(false)

        setEmailError(null)
        setFirstNameError(null)
        setLastNameError(null)
        setPasswordError(null)
        setMobileNumberError(null)
        setAcceptTosError(null)

        setSignupVisible(false)
    }

    useEffect(() => emailError && setEmailError(null), [email])
    useEffect(() => firstNameError && setFirstNameError(null), [firstName])
    useEffect(() => lastNameError && setLastNameError(null), [lastName])
    useEffect(() => passwordError && setPasswordError(null), [password])
    useEffect(() => mobileNumberError && setMobileNumberError(null), [mobileNumber])
    useEffect(() => acceptTosError && setAcceptTosError(null), [acceptTos])

    return <Container className='message-card'>
        <Card className="_card">
            <h1>Message {user.tutor_type == 'agency' ? user.company_name : user.name}</h1>

            <Input className="msgbox" text placeholder={`Hi ${user.name},\nI'm looking for a tutor. Are you available to teach at the moment? I am hoping to book an hour sometime next week.`} value={message} onChange={e => setMessage(e.target.value)} />
            {user.average_response_time != -1 && averageResponseTime ? <ResponseTime>Usually responds within {averageResponseTime}</ResponseTime> : null}
            <Row style={{justifyContent: 'space-between'}}>
                <div></div>
                <Button primary onClick={sendMessage} disabled={!message}>{loading ? <RingLoader small /> : 'Send message'}</Button>
            </Row>
        </Card>

        <UserContext.Consumer>
        {context => <Modal visible={signupVisible} dismiss={dismiss}>
                <Card>
                    <h1>Sign up to send</h1>

                    <Input label="Enter your Email" value={email} error={emailError} valid={email && email.match(EmailRegex)} onChange={e => setEmail(e.target.value)} />
                    {emailError == "This email address is already registered." ? <Row style={{gap: '8px', top: '-14px', position: 'relative'}}>
                        <Link primary to="/sign-in">Sign in</Link> or <Link primary to="/forgot-password">forgot your password</Link>?
                    </Row> : null}
                    <Row className='row'>
                        <Input label="First name" value={firstName} error={firstNameError} onChange={e => setFirstName(e.target.value)} />
                        <Input label="Last name" value={lastName} error={lastNameError} onChange={e => setLastName(e.target.value)} />
                    </Row> 
                    <Input label="Create password" value={password} error={passwordError} onChange={e => setPassword(e.target.value)} />
                    <Input label="Mobile number" value={mobileNumber} error={mobileNumberError} onChange={e => setMobileNumber(e.target.value)} />

                    <Checkbox value={acceptTos} setter={setAcceptTos} label={<span>I accept the <Link primary target="_blank" to="/terms-of-service" onClick={e => e.stopPropagation()}>terms and conditions</Link></span>} />
                    {acceptTosError ? <Error>{acceptTosError}</Error> : null}

                    <Button primary style={{marginTop: '32px'}} onClick={e => signUp(context.setUser)}>{signupInProgress ? <RingLoader small /> : 'Sign up'}</Button>
                </Card>
            </Modal>}
        </UserContext.Consumer>
    </Container>
}

export default MessageUser