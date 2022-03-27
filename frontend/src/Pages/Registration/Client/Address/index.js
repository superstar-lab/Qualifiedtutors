import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import Colours from '../../../../Config/Colours.js'
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Input from '../../../../Components/Input'
import Checkbox from '../../../../Components/Checkbox'
import Link from '../../../../Components/Link'
import Toast from '../../../../Components/Toast'
import { API } from '../../../../Components/API'
import { RingLoader } from '../../../../Components/index.js'
import Progress from '../Components/StudentProgress'
import CircleSVG from '../../../../Components/Circle'

import { EmailRegex, PostcodeRegex, MobileNumberRegex } from '../../../../Config/Validation.js'
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

function StudentAddress(props) {
    
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

    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [town, setTown] = useState("")
    const [county, setCounty] = useState("")
    const [postcode, setPostcode] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [textMe, setTextMe] = useState(false)

    const [addressLine1Error, setAddressLine1Error] = useState(null)
    const [townError, setTownError] = useState(null)
    const [postcodeError, setPostcodeError] = useState(null)
    const [mobileNumberError, setMobileNumberError] = useState(null)
    
    const [loading, setLoading] = useState(false)

    const persist = () => {
        let reg = JSON.parse(window.localStorage.getItem('registration'))
        if (!reg) { reg = {student: {}}}
        if (!reg.student) { reg.student = {} }

        reg.student.addressLine1 = addressLine1
        reg.student.addressLine2 = addressLine2
        reg.student.city = town
        reg.student.county = county 
        reg.student.postcode = postcode
        reg.student.mobileNumber = mobileNumber

        window.localStorage.setItem('registration', JSON.stringify(reg))
    }

    const back = event => {
        event.preventDefault()
        persist()

        history.push('/register-student', {
            progress: {
                ...location.state.progress,
                complete: 1,
                current: 'info'
            } 
        })
    }

    const saveAndContinue = async event => {
        let hasErrors = false
        event.preventDefault()

        /*
        if (addressLine1 == "") {
            hasErrors = true
            console.log("setting addr1 error")
            setAddressLine1Error("Address line 1 is required")
        } else { setAddressLine1Error(null) }

        if (town == "") {
            hasErrors = true
            setTownError("Town or city is required")
        } else { setTownError(null) }

        if (!postcode.toLowerCase().match(PostcodeRegex)) {
            hasErrors = true
            setPostcodeError("Postcode is required")
        } else { setPostcodeError(null) }

        if (mobileNumber == "" || !mobileNumber.toLowerCase().match(MobileNumberRegex)) {
            hasErrors = true
            setMobileNumberError("Please enter a valid mobile number")
        } else { setMobileNumberError(null) }
        */

        if (hasErrors) {
            event.preventDefault()
        } else {
            persist()
            const steps = [...location.state.progress.steps]    
            steps.push('address')

            history.push('/register-student-profile', {
                progress: {
                    ...location.state.progress,
                    steps,
                    current: 'profile',
                    complete: 3
                }
            })
        }
    }

    useEffect(() => {
        const reg = JSON.parse(window.localStorage.getItem('registration'))

        if (reg && reg.student) {
            if (reg.student.addressLine1) { setAddressLine1(reg.student.addressLine1) }
            if (reg.student.addressLine2) { setAddressLine2(reg.student.addressLine2) }
            if (reg.student.city) { setTown(reg.student.city) }
            if (reg.student.county) { setCounty(reg.student.county) }
            if (reg.student.postcode) { setPostcode(reg.student.postcode) }
            if (reg.student.mobileNumber) { setMobileNumber(reg.student.mobileNumber) }
        }
    }, [])

    const submitDisabled = false /*!mobileNumber || !mobileNumber.match(MobileNumberRegex) ||
        !addressLine1 ||
        !town ||
        !postcode || !postcode.toLowerCase().match(PostcodeRegex)*/

    return <>
        <Helmet>
            <title>Address - Qualified Tutors</title>
        </Helmet>
        
        <FixedWidth>
            <Container>
                <h1>Sign up. <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
                <Card>
                    <CircleSVG colour={Colours.r050}>2</CircleSVG>
                    <Split>
                        <Column>
                        <h2>Address (optional)</h2>
                                <p style={{maxWidth: '400px'}}>This won’t be displayed but we use your postcode to calculate distances to potential tutors.<br />Also, if you add your mobile number, we can text you if you have a booking.</p>
                        </Column>

                        <Column style={{marginRight: '129px', maxWidth: '393px', marginTop: '24px'}}>
                            <Input label="Building and street name" valid={addressLine1.length > 0}  onChange={e => setAddressLine1(e.target.value)} value={addressLine1} error={addressLine1Error} />
                            <Input onChange={e => setAddressLine2(e.target.value)} value={addressLine2} valid={addressLine2.length > 0} />
                            <Input label="Town or city" onChange={e => setTown(e.target.value)} value={town} error={townError} valid={town.length > 0} />
                            <Input label="County" onChange={e => setCounty(e.target.value)} value={county} valid={county.length > 0} />
                            
                            <Split>
                                <Column style={{width: '50%', marginRight: '16px'}}>
                                    <Input label="Postcode" onChange={e => setPostcode(e.target.value)} value={postcode} error={postcodeError} valid={postcode.toLowerCase().match(PostcodeRegex)} />
                                </Column>
                                <Column style={{width: '50%'}}>
                                    <Input label="Mobile number" onChange={e => setMobileNumber(e.target.value)} value={mobileNumber} error={mobileNumberError} valid={mobileNumber && mobileNumber.match(MobileNumberRegex)} />
                                </Column>
                            </Split>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                        <Link primary to="/register" alt="back" onClick={back} style={{display: 'flex'}}><img style={{width: '14px', height: '14px', position: 'relative', top: '1.6px'}} src="/img/back-icon.svg" />&nbsp;  Back</Link> 
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

export default StudentAddress
