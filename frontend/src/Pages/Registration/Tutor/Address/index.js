import styled from 'styled-components'
import Card from '../../../../Components/Card'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Input from '../../../../Components/Input'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
import Circle from '../../../../Components/Circle'
import Colours from '../../../../Config/Colours.js'
import { MobileNumberRegex, PostcodeRegex } from '../../../../Config/Validation.js'
import { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Underline } from '../../../../Components'

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
                margin-top: 16px !important;
                margin-left: 0 !important;
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

/**
 * Tutor Registration - Address
 * 
 * Collects address, town, city, postcode & mobile number.
 * 
 * Reads/writes the following from the localstorage variable "registration":
 *  - addressLine1
 *  - addressLine2
 *  - town
 *  - county
 *  - postcode
 *  - mobileNumber
 *  - textMe 
 * 
 */
function Address(props) {
    
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

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {

        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.addressLine1) { setAddressLine1(reg.addressLine1) }
        if (reg.addressLine2) { setAddressLine2(reg.addressLine2) }
        if (reg.town) { setTown(reg.town) }
        if (reg.county) { setCounty(reg.county) }
        if (reg.postcode) { setPostcode(reg.postcode) }
        if (reg.mobileNumber) { setMobileNumber(reg.mobileNumber) }
        if (reg.textMe) { setTextMe(reg.textMe) }

    }, [])

    const persist = () => { 
        
        const reg = JSON.parse(window.localStorage.getItem("registration"))

        reg.addressLine1 = addressLine1 
        reg.addressLine2 = addressLine2 
        reg.town = town 
        reg.county = county 
        reg.postcode = postcode 
        reg.mobileNumber = mobileNumber 
        reg.textMe = textMe 

        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const saveAndContinue = event => {

        event.preventDefault()
        

        let hasErrors = false

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

        

        
        */
        
        if (postcode && !postcode.toLowerCase().match(PostcodeRegex)) {
            hasErrors = true
            setPostcodeError("Must be a valid UK postcode")
        } else { setPostcodeError(null) }

        if (mobileNumber && !mobileNumber.toLowerCase().match(MobileNumberRegex)) {
            hasErrors = true
            setMobileNumberError("Must be a valid mobile number")
        } else { setMobileNumberError(null) }

        if (hasErrors) {
            event.preventDefault()
        } else {
            persist()
            const reg = JSON.parse(window.localStorage.getItem('registration'))
            const steps = [...location.state.progress.steps]

            if (
                reg.addressLine1 &&
                (reg.city || (reg.postcode && reg.postcode.match(PostcodeRegex))) &&
                reg.mobileNumber
            ) {
                steps.push('address')
            }

            history.push({
                pathname: "/register-tutor-subjects",
                state: {
                    progress: {
                        ...location.state.progress,
                        steps,
                        current: 'subjects',
                        complete: 3
                    }
                }
            })
            window.scrollTo(0, 0)
        }
    }

    return (<>
        <Helmet>
            <title>Address - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
                <Card>
                    <Circle colour={Colours.r050}>3</Circle>
                    <Split className='mainsplit'>
                        <Column>
                            <h2>Address</h2>
                            <p style={{maxWidth: '400px'}}>This won’t be displayed but we use your postcode to calculate distances to potential clients, if you offer an in person service.<br />Also, if you add your mobile number, we can text you if you have a booking.</p>
                        </Column>
                        <Column className='form' style={{marginTop: '96px', marginLeft: '128px'}}>
                            <Input label="Street name" valid={addressLine1.length > 0}  onChange={e => setAddressLine1(e.target.value)} value={addressLine1} error={addressLine1Error} />
                            <Input onChange={e => setAddressLine2(e.target.value)} value={addressLine2} valid={addressLine2.length > 0} />
                            <Input label="Town/area" onChange={e => setTown(e.target.value)} value={town} error={townError} valid={town.length > 0} />
                            <Input label="City" onChange={e => setCounty(e.target.value)} value={county} valid={county.length > 0} />
                          
                            <Split className='namesplit'>
                                <Column style={{width: '50%', marginRight: '16px'}}>
                                    <Input label="Postcode" onChange={e => setPostcode(e.target.value)} value={postcode} error={postcodeError} valid={postcode.toLowerCase().match(PostcodeRegex)} />
                                </Column>
                                <Column style={{width: '50%'}}>
                                    <Input label="Mobile number" onChange={e => setMobileNumber(e.target.value)} value={mobileNumber} error={mobileNumberError} valid={!!mobileNumber && mobileNumber.match(MobileNumberRegex)} />
                                </Column>
                            </Split>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                            <Link black to={{
                                pathname: "/register-tutor",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'info',
                                        complete: 1
                                    }
                                }
                            }} onClick={e => {persist(); window.scrollTo(0, 0);}} style={{display: 'flex'}}>
                               <img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back
                            </Link>
                        </div>
                        <div>
                            <Link 
                                black
                                style={{marginRight: '24px'}}
                                to={{
                                    pathname: "/register-tutor-subjects",
                                    state: {
                                        progress: {
                                            ...location.state.progress,
                                            steps: [...location.state.progress.steps, 'address'],
                                            current: 'subjects',
                                            complete: 3
                                        }
                                    }
                                }}
                                onClick={saveAndContinue}
                            >Save as draft</Link>

                            <Link 
                                className='acceptBtn'
                                primary 
                                btn 
                                to={{
                                pathname: "/register-tutor-subjects",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        steps: [...location.state.progress.steps, 'address'],
                                        current: 'subjects',
                                        complete: 3
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
    </>)
}

export default Address
