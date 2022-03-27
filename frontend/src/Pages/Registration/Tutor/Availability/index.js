import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Progress from '../Components/Progress'
import Colours from '../../../../Config/Colours'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    FixedWidth,
    Card,
    Link,
    Dropdown,
    Checkbox,
    Circle,
    Table,
    TutorAvailability,
    Underline
} from '../../../../Components'

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

    @media screen and (max-width: 1150px) {
        & .mainsplit {
            flex-direction: column;

            & > div:first-of-type {
                margin-right: 0 !important;

                & > p {
                    max-width: unset !important;
                }
            }
        
            & .textcol {
                max-width: unset !important;
                margin-right: unset !important;

                & > p {
                    max-width: unset !important;
                }
            }

            
        }

        & .contentsplit {
            flex-direction: column;
            margin-top: 16px !important;

            & > div:first-of-type {
                display: none;
            }

            & > div:last-of-type {
                margin-top: 0 !important;
            }
        }
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

    @media screen and (max-width: 480px) {
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


function Availability() {
   
    const location = useLocation()
    const history = useHistory()

    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false]
    })
    const [userType, setUserType] = useState(null)

    useEffect(() => {
        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.availability) {
            setAvailability(reg.availability)
        }

        setUserType(reg.userType)
    }, [])

    const updateAvailability = (timeslot, index, value) => {

        const a = {...availability}
        a[timeslot][index] = value

        setAvailability(a)
    }

    const persist = () => {
        
        const reg = JSON.parse(window.localStorage.getItem("registration")) 
        
        reg.availability = availability

        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const back = event => {
        event.preventDefault()
        persist()
        history.push('/register-tutor-documents', {
            progress: {
                ...location.state.progress,
                current: 'verification',
                complete: 7
            }
        })
        window.scrollTo(0, 0)
    }

    const saveAndContinue = event => {
        event.preventDefault()
        persist()

        const reg = JSON.parse(window.localStorage.getItem('registration'))

        const steps = [...location.state.progress.steps]
        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            steps.push('availability')
        }

        if (reg.userType == 'teacher') {
            history.push('/register-tutor-finalize', {
                progress: {
                    ...location.state.progress,
                    steps,
                    current: 'finalize',
                    complete: 9
                }
            })
            window.scrollTo(0, 0)
        } else {
            history.push('/register-tutor-references', {
                progress: {
                    ...location.state.progress,
                    steps,
                    current: 'references',
                    complete: 9
                }
            })
            window.scrollTo(0, 0)
        }
    }

    return <>
        <Helmet>
            <title>Availability - Qualified Tutors</title>
        </Helmet>
        
        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
                <Card>
                    <Circle colour={Colours.r050}>9</Circle>

                    <Split className='mainsplit'>
                        <Column style={{flex: '8px', marginRight: '64px'}}>
                            <h2>Availability</h2>
                            <p style={{maxWidth: '375px'}}>Please upload documents that verify your identity and your teaching qualification. Your profile won’t go live on the platform until we have reviewed the documents.</p>
                        </Column>
                        
                        <Column></Column>
                    </Split>

                    <Split className='contentsplit'>
                        <Column>

                        </Column>

                        <Column style={{marginTop: '-124px'}}>

                            <TutorAvailability availability={availability} setAvailability={setAvailability} />

                        </Column>
                    </Split>

                        <Split style={{marginTop: '80px', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>  
                                <Link black onClick={back} style={{display: 'flex'}}>
                                    <img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back
                                </Link>
                            </div>

                            <div>
                                <Link black style={{marginRight: '24px'}} onClick={saveAndContinue}>Save as draft</Link>
                                <Link className='acceptBtn' primary btn onClick={saveAndContinue}>SAVE AND CONTINUE</Link>
                            </div>
                        </Split>

                </Card>
            </Container>
        </FixedWidth>
    </>
}

export default Availability
