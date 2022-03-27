import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
import Dropdown from '../../../../Components/Dropdown'
import Checkbox from '../../../../Components/Checkbox'
import Input from '../../../../Components/Input'
import Colours from '../../../../Config/Colours.js'
import CircleSVG from '../../../../Components/Circle'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Table, Head, Heading, Body, Row, Col } from '../../../../Components/Table'
import { QualificationsTable, Underline } from '../../../../Components'
import Universities from '../../../../Config/Universities.js'
import Grades from '../../../../Config/Grades.js'
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

    & .uniqualifications .coursecontainer {
        max-width: 260px;
    }

    @media screen and (max-width: 1150px) {
        & .mainsplit {
            flex-direction: column;
        
            & .textcol {
                max-width: unset !important;
                margin-right: unset !important;
            }

            & .tablecol {
                margin-top: 16px !important;
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

const Circle = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${Colours.b500};
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: 4px;
`

/**
 * Tutor Registration - Qualifications
 * 
 * Collects a tutors education/qualifications
 * 
 * Reads/writes the following from the localstorage variable "registration":
 *  - qualifications
 * 
 * registration.qualifications structure:
 *  - school: String
 *  - title: String
 *  - grade: String
 *  - degree: Boolean
 *  - other: Boolean
 */
function Qualifications(props) {

    const [uniQualifications, setUniQualifications] = useState([])
    const [otherQualifications, setOtherQualifications] = useState([])

    const location = useLocation()
    const history = useHistory()
    const windowSize = useWindowSize()

    useEffect(() => {

        let reg = window.localStorage.getItem('registration')
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push('/register')
            return
        }

        if (reg.qualifications) {
            const uniQ = []
            const otherQ = []
            for(const qual of reg.qualifications) {
                if (qual.degree) {
                    uniQ.push(qual)
                }
                if (qual.other) {
                    otherQ.push(qual)
                }
            }

            setUniQualifications(uniQ)
            setOtherQualifications(otherQ)
        }
    }, [])

    const persist = () => {
        const reg = JSON.parse(window.localStorage.getItem("registration"))
        
        reg.qualifications = [
            ...uniQualifications,
            ...otherQualifications
        ]
        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const save = event => {
        event.preventDefault()
        persist()

        const to = {
            pathname: "/register-tutor-profile",
            state: {
                ...location.state,
                progress: {
                    ...location.state.progress,
                    current: "profile",
                    complete: 5
                }
            }
        }

        if (uniQualifications.length > 0 || otherQualifications.length > 0) {
            to.state.progress.steps = [...location.state.progress.steps, 'qualifications']
        }

        history.push(to)
        window.scrollTo(0, 0)
    }

    return (<>
        <Helmet>
            <title>Qualifications - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    <CircleSVG colour={Colours.t050}>5</CircleSVG>
                    <Split className='mainsplit'>
                        <Column className='textcol' style={{flex: '8px', marginRight: '64px', maxWidth: '375px'}}>
                            <h2>Qualifications</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet augue et gravida ultrices. Pellentesque blandit mi eu leo volutpat euismod. Nunc aliquet quis nulla et pellentesque.</p>
                        </Column>

                        <Column className='tablecol' style={{marginTop: '116px'}}>
                            {windowSize.width < 720 ? <h3>University</h3> : null}
                            <QualificationsTable
                                className="uniqualifications"
                                qualifications={uniQualifications} 
                                setQualifications={setUniQualifications} 
                                institutions={Universities}
                                instituionLabel="University"
                                titleLabel="Course"
                                grades={Grades}
                                degree
                                mobile={windowSize.width > 720 ? false : true}
                            />

                            <br />
                            <h3>Other achievements</h3>

                            <QualificationsTable 
                                qualifications={otherQualifications}
                                setQualifications={setOtherQualifications}
                                instituionLabel="Title"
                                titleLabel="Description"
                                addTitle="achievement"
                                gradeOptional={true}
                                mobile={windowSize.width > 720 ? false : true}
                            />


                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>
                            <Link black to={{
                                pathname: "/register-tutor-subjects",
                                state: {
                                    ...location.state,
                                    progress: {
                                        ...location.state.progress,
                                        current: 'subjects',
                                        complete: 3
                                    }
                                }
                            }} onClick={e => {persist(); window.scrollTo(0, 0);}} style={{display: 'flex'}}><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back</Link>
                        </div>

                        <div>
                            <Link black style={{marginRight: '24px'}} onClick={save}>Save as draft</Link>
                            <Link className='acceptBtn' primary btn onClick={save}>SAVE AND CONTINUE</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default Qualifications
