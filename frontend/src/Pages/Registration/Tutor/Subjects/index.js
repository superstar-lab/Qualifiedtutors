import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
import Colours from '../../../../Config/Colours.js'
import CircleSVG from '../../../../Components/Circle'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SubjectTable, Underline } from '../../../../Components'
import useWindowSize from '../../../../Hooks/UseWindowSize'

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

        & .subject-column {
            margin-left: 0 !important;
            margin-top: 0 !important;
        }

        & .copy-column {
            max-width: unset !important;
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
 * Tutor Registration - Subjects
 * 
 * Collects the subjects offered by the tutor.
 * 
 * Reads/writes the following from the localstorage variable "registration":
 *  - subjects
 * 
 * registration.subjects structure:
 *  - subject: String (for new subjects) or Int (for existing subjects)
 *  - level: String
 *  - perHour: Int (expressed in 1p)
 *  - inPerson: Boolean
 *  - online: Boolean
 */
function Subjects(props) {

    const [subjects, setSubjects] = useState([]) 

    const location = useLocation()
    const history = useHistory()
    const windowSize = useWindowSize()

    useEffect(() => {

        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.subjects) {
            setSubjects(reg.subjects)
        }

    }, [])
 
    const persist = () => {
        const reg = JSON.parse(window.localStorage.getItem("registration"))

        reg.subjects = subjects

        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const save = event => {
        event.preventDefault()
        persist()

        const to = {
            pathname: "/register-tutor-qualifications",
            state: {
                progress: {
                    ...location.state.progress,
                    current: 'qualifications',
                    complete: 4
                }
            }
        }

        const reg = JSON.parse(window.localStorage.getItem("registration"))
        if (reg.userType == 'agency') {
            to.pathname = "/register-tutor-profile"
            to.state.progress.current = "profile"
        }

        if (subjects.length > 0) {
            to.state.progress.steps = [...location.state.progress.steps, 'subjects']
        }

        history.push(to)
        window.scrollTo(0, 0)
    }

    return (<>
        <Helmet>
            <title>Subjects &amp; prices - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
                <Card>
                    <CircleSVG colour={Colours.b050}>4</CircleSVG>
                    <Split className='mainsplit'>
                        <Column className="copy-column" style={{maxWidth: '300px'}}>
                            <h2>Subjects &amp; Prices</h2>
                            <p>Choose a subject from the dropdown list or type your own.</p>
                        </Column>

                        <Column className="subject-column" style={{marginTop: '112px', marginLeft: '24px'}}>
                            <SubjectTable mobile={windowSize.width > 720 ? false : true} subjects={subjects} setSubjects={setSubjects} />
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                            <Link black to={{
                                pathname: "/register-tutor-address",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'address',
                                        complete: 2
                                    }
                                }
                            }} onClick={e => {persist(); window.scrollTo(0, 0);}} style={{display: 'flex'}}><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back</Link>
                        </div>
                        <div>
                            <Link style={{marginRight: '24px'}} black onClick={save}>Save as draft</Link>
                            <Link className='acceptBtn' primary btn onClick={save}>SAVE AND CONTINUE</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>)    
}

export default Subjects