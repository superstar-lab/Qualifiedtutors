import styled from 'styled-components'
import Card from '../../Components/Card'
import Underline from '../../Components/Underline'
import Colours from '../../Config/Colours.js'
import RadioButton from '../../Components/RadioButton'
import FixedWidth from '../../Components/FixedWidth'
import Link from '../../Components/Link'
import Circle from '../../Components/Circle'
import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import usePrevious from '../../Hooks/UsePrevious'
import {Helmet} from "react-helmet"
import { EmailRegex, PostcodeRegex } from '../../Config/Validation'

const Container = styled.div`
    margin: 64px;

    & h1 {
        font-size: 48px;
        margin-bottom: 64px;
    }

    & h2, & p {
        position: relative;
    }

    & p {
        color: ${Colours.b500};
        font-size: 14px;
        line-height: 24px;
    }

    & .circleSVG {
        position: absolute;
        top: 32px;
        right: 32px;
    }

    & .option {
        padding: 0;
        height: 232px;
        width: 288px;
    }

    & .card {
        margin-bottom: 32px;    
    }

    @media screen and (max-width: 1400px) { 
        & .clientopts {
            padding-right: 24px !important;
        }

        & .tutoropts {
            margin-left: 24px !important;
            justify-content: space-evenly !important;
        }
    }

    @media screen and (max-width: 1380px) {
        & .mainsplit {
            flex-direction: column;

            & .clientopts {
                padding-right: 0 !important;
                align-items: center;
            }

            & > img {
                display: none;
            }
        }
    }

    @media screen and (max-width: 1150px) {
        margin: 32px;

        & .mainsplit .tutoropts {
            flex-direction: column;
            align-items: center;
            margin-left: 0 !important;
        }
    }

    @media screen and (max-width: 800px) {
        & h1 {
            margin-bottom: 32px;
        }   

        & h2 {
            margin: 0;
            margin-bottom: 0 !important;
        }
    }

    @media screen and (max-width: 480px) {
        margin: 8px;

        & .option {
            width: 260px;
        }
    }
`

const Split = styled.div`
   display: flex; 
`

const Column = styled.div`
   display: flex;
   flex-direction: column;
`

/**
 * Initial Registration Page - User type selection
 * 
 * Determines which registration path to send the user down.
 * 
 * Responsible for setting the initial state of the progress component.
 */
function Registration() {

    const location = useLocation()
    const history = useHistory()

    const [userType, setUserType] = useState(null)
    const prevUserType = usePrevious(userType)

    const [progress, setProgress] = useState({
        steps: [],
        current: 'account'
    })
    const [initialLocationKey, setInitialLocationKey] = useState(location.key)

    const saveAndContinue = event => {
        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else { reg = {} }

        reg.userType = userType
        reg.progress = {
            current: "info"
        }

        window.localStorage.setItem("registration", JSON.stringify(reg))
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        let reg = window.localStorage.getItem("registration")
        if (reg) {
            reg = JSON.parse(reg)
            setUserType(reg.userType)
        }
    }, [])

    useEffect(() => {
        
        // Don't re-run on changes to the location key
        if (location.key != initialLocationKey) { 
            // Unless the user type has changed
            if (userType != prevUserType) {
                setInitialLocationKey(location.key)
            } else {
                return
            }
        }

        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else { reg = {} }

        const prog = {
            ...(location.state && location.state.progress ? location.state.progress : {}),
            current: 'account'
        }

        if (!prog.steps) {
            prog.steps = []
        }

        // Set steps already completed for the various registration types
        if (userType == 'tutor') {
           if (
               reg.firstName &&
               reg.lastName && 
               (reg.email && reg.email.match(EmailRegex)) &&
               (reg.password && reg.password.length >= 8) &&
               reg.acceptTos
           ) {
               prog.steps.push('account')
           }

           if (
               reg.addressLine1 && 
               (reg.town || (reg.postcode && reg.postcode.match(PostcodeRegex) )) &&
               reg.mobileNumber
           ) {
               prog.steps.push('address')
           }

           if (reg.subjects && reg.subjects.length > 0) {
                prog.steps.push('subjects')
           }

           if (reg.qualifications && reg.qualifications.length > 0) {
                prog.steps.push('qualifications')
           }

           if (
               reg.profileImgUrl &&
               reg.gender && 
               reg.summary && reg.summary.length < 200 && 
               reg.aboutYou && reg.aboutYou.length < 1200 && reg.aboutYou.length >= 50
           ) {
               prog.steps.push('profile')
           }

           if (
               (reg.profilePics && reg.profilePics.length > 0) ||
               reg.videoUrl
           ) {
               prog.steps.push('photos')
           }

           if (
               (reg.verificationDocs && reg.verificationDocs.length > 0) && 
               (reg.qualificationDocs && reg.qualificationDocs.length > 0)
           ) {
               prog.steps.push('documents')
           }

           if (
               reg.availability && (
                   reg.availability.morning.find(v => v) ||
                   reg.availability.afternoon.find(v => v) ||
                   reg.availability.evening.find(v => v)
               )
           ) {
               prog.steps.push('availability')
           }

           if (reg.references && reg.references.length > 0) {
               prog.steps.push('references')
           }
        }

        history.push({
            state: {
                ...location.state,
                progress: prog
            }
        })
    }, [location, userType, prevUserType])

    return (<>
        <Helmet>
            <title>Sign up - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1>Si<Underline offset="-16px">gn up.</Underline></h1>
                <Card>
                    <Circle colour={Colours.b050}>1</Circle>
                    <h2>Please choose one of these options</h2> 
                    <Split className='mainsplit'>
                        <Column className='clientopts' style={{paddingRight: '72px', marginTop: '32px'}}>
                            <Card className="option" primary centered hover onClick={e => setUserType("client")} style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>
                                <h2 style={{marginTop : 0}}>I am looking<br />for a <Underline>tutor</Underline></h2>
                                <RadioButton containerStyle={{width: '100%', justifyContent: 'center'}} style={{position: 'absolute', bottom: '16px'}} name="userType" setter={setUserType} current={userType}  value="client" />
                            </Card>
                            <p>Once you sign up, you can book directly<br />with a qualified tutor.</p>
                        </Column>
                        <img alt="border line" src="img/border-right.webp" />
                        <Split className='tutoropts' style={{marginLeft: '72px', justifyContent: 'space-between', width: '100%'}}>
                            <Column style={{marginTop: '32px'}}>
                                <Card className="option" primary centered hover onClick={e => setUserType("teacher")} style={{cursor: 'pointer'}}>
                                    <h2 style={{marginTop: 0}}>I am a<br />Qualified Te<Underline>acher</Underline></h2>
                                    <RadioButton containerStyle={{width: '100%', justifyContent: 'center'}} style={{position: 'absolute', bottom: '16px'}} name="userType" setter={setUserType} current={userType} value="teacher" />
                                </Card>
                                <Split>
                                    <img alt="alert" src="img/alert_18.webp" style={{width: '13.33px', height: '13.33px', margin: '19.2px 8px 0 0'}} />
                                    <div>
                                        <p>This requires:</p>
                                        <p style={{marginTop: '-8px'}}>
                                            a teaching qualification (QTS)<br />
                                            2 years of teaching experience<br />
                                            UK citizenship
                                        </p>
                                    </div>
                                </Split>
                            </Column>
                           
                           {/*
                            <Column style={{marginTop: '32px'}}>
                                <Card className="option" primary centered hover onClick={e => setUserType("tutor")} style={{cursor: 'pointer'}}>
                                    <h2 style={{marginTop: 0}}>I am a<br />Qualified <Underline>Tutor</Underline></h2>    
                                    <RadioButton style={{position: 'absolute', bottom: '16px'}} name="userType" setter={setUserType} current={userType} value="tutor" />
                                </Card>
                                <Split>
                                    <img src="img/alert.webp" style={{width: '13.33px', height: '13.33px', margin: '19.2px 8px 0 0'}} />
                                    <div>
                                        <p>This requires:</p>
                                        <p style={{marginTop: '-8px'}}>
                                            at least 2 references<br />
                                            a degree in your subject<br />
                                            UK citizenship
                                        </p>
                                    </div>
                                </Split>
                            </Column>
                           */}
                            <Column style={{marginTop: '32px'}}>
                                <Card className="option" primary centered hover onClick={e => setUserType("agency")} style={{cursor: 'pointer'}}>
                                    <h2 style={{marginTop: 0}}>I am a<br />Qualified A<Underline offset="-12px">gency</Underline></h2>    
                                    <RadioButton containerStyle={{width: '100%', justifyContent: 'center'}} style={{position: 'absolute', bottom: '16px'}} name="userType" setter={setUserType} current={userType} value="agency" />
                                </Card>
                                <Split>
                                    <img alt="alert" src="img/alert_18.webp" style={{width: '13.33px', height: '13.33px', margin: '19.2px 8px 0 0'}} />
                                    <div>
                                        <p>This requires:</p>
                                        <p style={{marginTop: '-8px'}}>
                                            UK citizenship
                                        </p>
                                    </div>
                                </Split>
                            </Column>
                        </Split>
                    </Split>
                    
                    <div style={{width: '100%'}}>
                        <Link primary btn to={{
                            pathname: userType == 'client' ? '/register-student' : '/register-tutor',
                                state: {
                                    userType,
                                    progress: {
                                        ...(location.state && location.state.progress ? location.state.progress : {}),
                                        current: 'info'
                                    }
                                },
                        }} onClick={saveAndContinue} disabled={!userType}  style={{float: 'right'}}>NEXT</Link>
                    </div>
                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default Registration
