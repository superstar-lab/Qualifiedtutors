import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Colours from '../../Config/Colours.js'
import {
    FixedWidth,
    WavyRect,
    Circle,
    Underline,
    Card,
    Input,
    Button,
    RingLoader,
    Toast,
    API,
    Link
} from '../../Components'
import Collapsible from '../../Components/Collapsible/index.js'
import { useState } from 'react'
import { EmailRegex } from '../../Config/Validation.js'
import { siteKey } from '../../Config/Recaptcha'

const Container = styled.div`
    margin-bottom: 48px;

    & .card {
        padding: 8px 0;
    }

    @media screen and (max-width: 1530px) {
        & .fixedWidth {
            padding-left: 32px;
            padding-right: 32px;
        }
    }

    @media screen and (max-width: 980px) {
        & .eyecatchRow {
            position: relative;
            z-index: 10;

            & .eyecatchIcon {
                position: absolute;
                height: 80%;
                width: 240px;
                right: -98px;
                z-index: -1;
                opacity: .33;
            }
        }
    }

    @media screen and (max-width: 800px) {
        & .formrow {
            flex-direction: column;

            & .address {
                padding-right: 0;
                border-right: 0;
                border-bottom: 1px solid #eee;
                margin-bottom: 16px;
            }

            & .form {
                padding-left: 0;
            }
        }
    }


    @media screen and (max-width: 680px) {
        .eyecatchRow h1 {
            font-size: 72px;
            line-height: 86.4px;
        }
    }

    @media screen and (max-width: 600px) {
        .eyecatchRow h1 {
            font-size: 60px;
            line-height: 72px;
        }
    }

    @media screen and (max-width: 520px) {
        .eyecatchRow h1 {
            font-size: 48px;
            line-height: 57.6px;
        }

        & .eyecatchIcon {
            top: -48px;
        }

        & .fixedWidth {
            padding: 0 16px;
        }
    }

    @media screen and (max-width: 420px) {
        h1 {
            font-size: 34px !important;
            line-height: 40.8px !important;
        }

        & .eyecatchIcon {
            right: unset !important;
            left: 180px;
        }
    }
`

const LeadIn = styled.div`
    margin: 48px 0;

    h1 {
        font-weight: bold;
        font-size: 48px;
        line-height: 60px;
        color: ${Colours.n100};
    }
`

const EyeCatch = styled.div`
    flex: 1;

    h1 {
        font-weight: bold;
        font-size: 80px;
        line-height: 96px;
    }
`

const EyeCatchIcon = styled.div`
    flex: 1;
    position: relative;

    & .circleSVG {
        position: absolute;
        right: 100px;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const Row = styled.div`
    display: flex;
`

const FaqLeadIn = styled.div`
    margin-top: 142px;

    h2 {
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
    }
`

const Faqs = styled.section`
    margin-bottom: 64px;
`

const Address = styled.div`
    flex: 1;
    padding-right: 64px;
    border-right: 1px solid #EEEEEE;

    & p {
        color: #616161;
        font-size: 18px;
        line-height: 32px;
    }
`

const Form = styled.div`
    flex: 1;
    padding-left: 64px;
    margin-bottom: 48px;
`

const Captcha = styled.div`
    margin-top: 52px;
    line-height: 24px;
    font-size: 16px;
    color: #616161;

    & a, & a:active, & a:visited {
        color: ${Colours.b500};
    }
`

/**
 * Contact us page
 * 
 * Allows users to contact the sites administration. 
 * Form is protected by Google reCAPTCHA v3. See public/index.html for its inclusion.
 * 
 */
function ContactUs(props) {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [messageError, setMessageError] = useState("")

    const submit = async event => {
        
        event.preventDefault()

        let hasErrors = false
        setEmailError("")
        setMessageError("")
        setNameError("")

        if (!name) {
            setNameError("Name is required")
            hasErrors = true
        }

        if (!email || !email.match(EmailRegex)) {
            setEmailError("Valid email required")
            hasErrors = true
        }

        if (!message) {
            setMessageError("Message is required")
            hasErrors = true
        }
        
        if (!hasErrors) {
            window.grecaptcha.ready(function() {
                window.grecaptcha.execute(siteKey, {action: 'submit'}).then(async function(token) {
                    setLoading(true)
                    try {
                        const response = await API.post('contactus', {
                            token,
                            name,
                            email,
                            message
                        })
                        
                        if (response && response.data && response.data.success) {
                            setName("")
                            setEmail("")
                            setMessage("")
                            Toast.success("Message submitted successfully")
                        } else {
                            throw new Error("Unexpected API response")
                        }
                    } catch(error) {
                        if (error && error.response && error.response.data && error.response.data.error && error.response.data.error.startsWith("reCAPTCHA verification failed")) {
                            console.log('err', error.response.data.error)
                            Toast.error("reCAPTCHA verification failed")
                        } else {
                            Toast.error("Unexpected error submitting message. Please try again.")
                        }
                        
                    }

                    setLoading(false)
                })
            })
        }
    }

    return <>
        <Helmet>
            <title>Contact us - Qualified Tutors</title>
        </Helmet>

        <Container>
        <LeadIn>
            <FixedWidth>
                <h1>Contact us.</h1>
            </FixedWidth>
        </LeadIn>

        <WavyRect>
            <FixedWidth width="1280px">
                <Row className="eyecatchRow">
                    <EyeCatch>
                        <h1>We'd love to hear from you.</h1>
                        <p>You can check the section to see if the answer you need is there or contact us using the form or message bubble below.</p>
                    </EyeCatch>

                    <EyeCatchIcon className='eyecatchIcon'>
                        <Circle colour={Colours.b300} width="322px"><img alt="speech baloon" src="/img/speech.webp" /></Circle>
                    </EyeCatchIcon>
                </Row>
            </FixedWidth>
        </WavyRect>

        <FixedWidth>
            <Card>
                <FixedWidth width="1280px" style={{flex: 1}}>
                    <h2>Co<Underline offset="-16px">ntact us&nbsp;</Underline></h2>

                    <Row className="formrow">
                        <Address className='address'>
                            <p>Please get in touch, whether you have a question, or feedback, or a complaint - we’d love to hear from you!</p>
                            <p>You can also write to us at:</p>
                            <p>
                                Qualified Tutors<br />
                                1 Buckingham Palace Road<br />
                                Substantial Row<br />
                                London<br />
                                SW1A 1AA 
                            </p>
                        </Address>

                        <Form className='form'>
                            <Input value={name} error={nameError} onChange={e => setName(e.target.value)} label="Your name" />
                            <Input value={email} error={emailError} onChange={e => setEmail(e.target.value)} valid={email && email.match(EmailRegex)} label="Enter your email" />
                            <Input value={message} error={messageError} onChange={e => setMessage(e.target.value)} text label="Your message" style={{height: '220px'}} />

                            <Captcha>
                                This form is protected by reCAPTCHA and the Google <Link primary target="_blank" to={{pathname: "https://policies.google.com/privacy"}}>Privacy Policy</Link> and <Link primary target="_blank" to={{pathname: "https://policies.google.com/terms"}}>Terms of Service</Link> apply.
                            </Captcha>
                        </Form>

                        
                    </Row>

                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '32px'}}>
                        <div></div>
                        <Link primary btn onClick={submit}>{loading ? <RingLoader small /> : 'Submit'}</Link>
                    </div>
                </FixedWidth>
            </Card>
        </FixedWidth>
    </Container>
    </>
}

export default ContactUs