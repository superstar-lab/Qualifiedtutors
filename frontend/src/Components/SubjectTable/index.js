import styled from 'styled-components'
import { Table, Head, Heading, Body, Row, Col } from '../Table'

import { API } from '../../Components'

import Colours from '../../Config/Colours.js'
import Dropdown from '../Dropdown'
import Checkbox from '../Checkbox'
import { useState, useEffect } from 'react'
import zIndex from '../../Config/zIndex'
import Button from '../Button'

const Container = styled.div`

    & thead > *:nth-of-type(2) {
        width: 164+.px;
    }

    & thead > *:nth-of-type(3) {
        width: 96px;
    }

    & thead > *:nth-of-type(4) {
        width: 96px;
    }

    & thead > *:last-of-type {
        width: 64px;
    }

    & tbody td {
        line-height: 22px;
    }

    & .control-col {
        & > img {
            opacity: .8;

            &:hover {
                opacity: 1;
            }
        }
    }

    & .newsubject {
        flex-wrap: wrap;
        gap: 16px;
        justify-content: flex-start;
    }

    ${props => props.mobile ? `
        & table {
            display: flex;
            flex-direction: column;
            border: 0;

            & thead {
                display: none;
            }

            & tbody {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            & tr {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                border: .5px solid #E0E0E0;
                border-radius: 4px;

                margin-bottom: 16px;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }

            & td {
                position: relative;
                display: flex;
                flex: 1;
                flex-direction: column;
                align-items: center;
                max-width: unset;
                overflow: unset;
                white-space: normal;
                height: unset;

                position: relative;
                border: 0;
                align-items: flex-start;

                &:first-of-type {
                    padding-top: 8px;
                }

                &:last-of-type {
                    flex-direction: row;
                    gap: 8px;
                    padding-bottom: 12px;
                    justify-content: space-between;
                    flex: 1;
                    width: calc(100% - 32px);
                    padding-top: 16px;
                    border-top: 1px solid #e0e0e0;
                    
                    & > img {
                        margin-right: 0 !important;

                        &:first-of-type {
                            order: 2;
                        }

                        &:last-of-type {
                            order: 1;
                        }
                    }
                }
            }
        }
    ` : ''}
`

const Split = styled.div`
    display: flex;
    margin-top: 24px;

    & > div:nth-of-type(1) {
        flex: 2;
    }

    & > div:nth-of-type(2) {
        flex: 1.5;
    }

    & > div:nth-of-type(3) {
        flex: 1;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const FlexRow = styled.div`
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
    height: 44px;
`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: 4px;
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

const Label = styled.label`
    color: ${Colours.b500};
    font-weight: bold;
    display: block;
`
/**
 * Table to display/edit a tutors subjects & prices
 * 
 * @param subjects      Array[Object]   Set of subject objects: {subject, level, perHour, online, inPerson}
 * @param setSubjects   Function        Setter for the subjects array
 * @param readonly      Boolean         If set the contents can not be edited
 * @param mobile        Boolean         If set the table is rendered in a mobile friendly fashion
 * @example 
 *  const [subjects, setSubjects] = useState([])
 *  
 *  ...
 * 
 *  <SubjectsTable subjects={subjects} setSubjects={setSubjects} />
 */
function SubjectTable({
    subjects, 
    setSubjects,
    readonly,
    mobile
}) {
    
    const [currentSubject, setCurrentSubject] = useState("")
    const [currentLevel, setCurrentLevel] = useState(null)
    const [currentPerHour, setCurrentPerHour] = useState(null)
    const [currentOnline, setCurrentOnline] = useState(null)
    const [currentInPerson, setCurrentInPerson] = useState(null)

    const [currentSubjectError, setCurrentSubjectError] = useState(null)
    const [currentLevelError, setCurrentLevelError] = useState(null)
    const [currentPerHourError, setCurrentPerHourError] = useState(null)
    const [currentLocationError, setCurrentLocationError] = useState(null)

    const [editingSubject, setEditingSubject] = useState("")
    const [editingLevel, setEditingLevel] = useState(null)
    const [editingPerHour, setEditingPerHour] = useState(null)
    const [editingOnline, setEditingOnline] = useState(null)
    const [editingInPerson, setEditingInPerson] = useState(null)

    const [editingSubjectError, setEditingSubjectError] = useState(null)
    const [editingLevelError, setEditingLevelError] = useState(null)
    const [editingPerHourError, setEditingPerHourError] = useState(null)
    const [editingLocationError, setEditingLocationError] = useState(null)

    const [editingIndex, setEditingIndex] = useState(null)

    const [fixedSubjects, setFixedSubjects] = useState([])
    const [levels, setLevels] = useState([])

    const addSubject = event => {
        let hasErrors = false

        if (!currentSubject) {
            hasErrors = true
            setCurrentSubjectError("Subject is required")
        } else { setCurrentSubjectError(null) }

        if (!currentLevel) {
            hasErrors = true
            setCurrentLevelError("Level is required")
        } else { setCurrentSubjectError(null) }

        if (!currentPerHour) {
            hasErrors = true
            setCurrentPerHourError("Per hour is required")
        } else { setCurrentPerHourError(null) }

        if (!currentInPerson && !currentOnline) {
            hasErrors = true
            setCurrentLocationError("At least one location is required")
        } else { setCurrentLocationError(null) }

        if (!hasErrors) {
            const rate = '£' + currentPerHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')

            setSubjects([...subjects, {
                subject: currentSubject,
                level: currentLevel,
                perHour: rate,
                inPerson: currentInPerson,
                online: currentOnline
            }])

            setCurrentSubject("")
            setCurrentLevel(null)
            setCurrentPerHour("")
            setCurrentInPerson(null)
            setCurrentOnline(null)

            setCurrentSubjectError(null)
            setCurrentLevelError(null)
            setCurrentPerHourError(null)
            setCurrentLocationError(null)
        }
    }

    const deleteSubject = index => {
        const s = [...subjects]
        s.splice(index, 1)
        setSubjects(s)
    }

    const editSubject = index => {
        const subject = subjects[index]
        
        setEditingSubject(subject.subject)
        setEditingLevel(subject.level)
        setEditingPerHour(subject.perHour)
        setEditingInPerson(subject.inPerson)
        setEditingOnline(subject.online)

        setEditingIndex(index)
    }

    const getSubject = id => {
        const subject = fixedSubjects.find(s => s.id == id)
        return subject ? subject : ""
    }

    const updateSubject = index => {

        let hasErrors = false

        if (!editingSubject) {
            hasErrors = true
            setEditingSubjectError("Subject is required")
        } else { setEditingSubjectError(null) }

        if (!editingLevel) {
            hasErrors = true
            setEditingLevelError("Level is required")
        } else { setEditingSubjectError(null) }

        if (!editingPerHour) {
            hasErrors = true
            setEditingPerHourError("Per hour is required")
        } else { setEditingPerHourError(null) }

        if (!editingInPerson && !editingOnline) {
            hasErrors = true
            setEditingLocationError("At least one location is required")
        } else { setEditingLocationError(null) }

        if (!hasErrors) {
            const subject = subjects[index]
            const rate = '£' + editingPerHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')


            subject.subject = editingSubject
            subject.perHour = rate
            subject.level = editingLevel
            subject.inPerson = editingInPerson
            subject.online = editingOnline

            const s = [...subjects]
            s[index] = subject 
            
            setSubjects(s)

            cancelEditing()
        }
    }

    const cancelEditing = () => {
        setEditingSubject("")
        setEditingLevel(null)
        setEditingPerHour("")
        setEditingInPerson(null)
        setEditingOnline(null)

        setEditingSubjectError(null)
        setEditingLevelError(null)
        setEditingPerHourError(null)
        setEditingLocationError(null)

        setEditingIndex(null)
    }

    useEffect(() => {
        const getSubjects = async () => {
            const response = await API.get("subjects")
            setFixedSubjects(response.data)
        }

        const getLevels = async () => {
            const response = await API.get("subjects/levels")
            setLevels(response.data)
        }

        getSubjects()
        getLevels()

    }, [])

    return <Container mobile={mobile}>
            <Table>
                <Head>
                    <Row>
                        <Heading>Subject</Heading>
                        <Heading>Level</Heading>
                        <Heading style={{textAlign: 'center'}}>Price per Hour</Heading>
                        <Heading>Location</Heading>
                        <Heading></Heading>
                    </Row>
                </Head>

                <Body>
                    {subjects.map((subject, index) => <Row>
                        <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top + 3 : 'unset'}}>
                            {mobile ? <Label>Subject</Label> : null}
                            {editingIndex != index ? (parseInt(subject.subject) ? getSubject(subject.subject).subject : subject.subject) :
                                <Dropdown 
                                    editable 
                                    placeholder="Type/choose subject" 
                                    onChange={(value, node) => setEditingSubject(node ? node.key : value)}
                                    selected={parseInt(editingSubject) ? fixedSubjects.find(s => s.id == editingSubject).subject : editingSubject}
                                    error={editingSubjectError}
                                    style={{marginRight: '16px'}}
                                >
                                    {fixedSubjects.map(s => <span key={s.id}>{s.subject}</span>)}
                                </Dropdown> 
                            }
                        </Col>
                        <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top + 2 : 'unset'}}>
                            {mobile ? <Label>Level</Label> : null}
                            {editingIndex != index ? subject.level :
                                <Dropdown 
                                    placeholder="Level"
                                    onChange={value => setEditingLevel(value)}
                                    selected={editingLevel}
                                    error={editingLevelError}
                                    style={{marginRight: '16px'}}
                                >
                                    {levels.map(l => <span>{l}</span>)}
                                </Dropdown>
                            }
                        </Col>
                        <Col style={{textAlign: 'center', position: 'relative', zIndex: editingIndex == index ? zIndex.top + 1 : 'unset'}}>
                            {mobile ? <Label>Per hour</Label> : null}
                            {editingIndex != index ? subject.perHour :
                                <Dropdown 
                                    editable
                                    placeholder="£ per Hour" 
                                    selected={editingPerHour} 
                                    onChange={value => {setEditingPerHour(value)}}
                                    error={editingPerHourError}
                                    style={{marginRight: '16px'}}
                                >
                                    <span>£ 5</span>
                                    <span>£ 10</span>
                                    <span>£ 15</span>
                                    <span>£ 20</span>
                                    <span>£ 25</span>
                                    <span>£ 30</span>
                                    <span>£ 35</span>
                                    <span>£ 40</span>
                                    <span>£ 45</span>
                                    <span>£ 50</span>
                                    <span>£ 55</span>
                                    <span>£ 60</span>
                                    <span>£ 65</span>
                                    <span>£ 70</span>
                                    <span>£ 75</span>
                                    <span>£ 80</span>
                                    <span>£ 85</span>
                                    <span>£ 90</span>
                                    <span>£ 95</span>
                                    <span>£ 100</span>
                                </Dropdown>
                            }
                        </Col>
                        <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top : 'unset'}}>
                            {mobile ? <Label>Location</Label> : null}
                            {editingIndex != index ? <>
                                {subject.inPerson ? <div>In Person</div> : null}
                                {subject.online ? <div>Online</div> : null}
                            </> : <>
                                <Checkbox style={{marginTop: '1.6px'}} label="Online" value={editingOnline} setter={setEditingOnline} />
                                <Checkbox style={{marginTop: '4px'}} label="In Person" value={editingInPerson} setter={setEditingInPerson} />
                                {editingLocationError ? <Error>{editingLocationError}</Error> : null}
                            </>}
                            
                        </Col>
                        <Col style={{textAlign: 'center', position: 'relative', zIndex: zIndex.top}} className="control-col">
                            {editingIndex == index ? <>
                                <img alt="save" onClick={e => updateSubject(index)} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/checkmark_green.svg" />
                                <img alt="cancel" onClick={e => cancelEditing(index)} style={{width: '14px', height: '14px', cursor: 'pointer'}} src="/img/close_red.webp" />
                            </> : <>
                                <img alt="edit" onClick={e => editSubject(index)} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/edit_green.webp" />
                                <img alt="delete" onClick={e => deleteSubject(index)} style={{width: '16px', height: '16px', cursor: 'pointer'}} src="/img/delete_red.webp" />
                            </>}
                            
                        </Col>
                    </Row>)}
                </Body>
            </Table>
    
            {!readonly ? <>
                <Split className='newsubject'>
                    <div>
                        <Dropdown 
                            editable 
                            placeholder="Type/choose subject" 
                            onChange={(value, node) => setCurrentSubject(node ? node.key : value)}
                            selected={parseInt(currentSubject) ? fixedSubjects.find(s => s.id == currentSubject).subject : currentSubject}
                            error={currentSubjectError}
                            style={{minWidth: '215px'}}
                            clearable
                            clearCallback={() => setCurrentLevel("")}
                        >
                            {fixedSubjects.map(s => <span key={s.id}>{s.subject}</span>)}
                        </Dropdown>
                    </div>

                    <div>
                        <Dropdown 
                            placeholder="Level"
                            onChange={value => setCurrentLevel(value)}
                            selected={currentLevel}
                            error={currentLevelError}
                            style={{minWidth: '138px'}}
                        >
                            {(parseInt(currentSubject) ? JSON.parse(fixedSubjects.find(s => s.id == currentSubject).levels) : levels).map(l => <span>{l}</span>)}
                        </Dropdown>
                    </div>

                    <div>
                        <Dropdown 
                            editable
                            placeholder="£ per Hour" 
                            selected={currentPerHour} 
                            onChange={value => {setCurrentPerHour(value)}}
                            error={currentPerHourError}
                            style={{minWidth: '130px'}}
                        >
                            <span>£ 5</span>
                            <span>£ 10</span>
                            <span>£ 15</span>
                            <span>£ 20</span>
                            <span>£ 25</span>
                            <span>£ 30</span>
                            <span>£ 35</span>
                            <span>£ 40</span>
                            <span>£ 45</span>
                            <span>£ 50</span>
                            <span>£ 55</span>
                            <span>£ 60</span>
                            <span>£ 65</span>
                            <span>£ 70</span>
                            <span>£ 75</span>
                            <span>£ 80</span>
                            <span>£ 85</span>
                            <span>£ 90</span>
                            <span>£ 95</span>
                            <span>£ 100</span>
                        </Dropdown>
                    </div>

                    <Column>
                        <FlexRow>
                            <Checkbox style={{marginTop: '1.6px'}} label="Online" value={currentOnline} setter={setCurrentOnline} />
                            <Checkbox style={{marginTop: '4px'}} label="In Person" value={currentInPerson} setter={setCurrentInPerson} />
                        </FlexRow>
                        {currentLocationError ? <Error>{currentLocationError}</Error> : null}
                    </Column>
                </Split>

                <div style={{display: 'flex', justifyContent: 'flex-end', lineHeight: '32px', marginTop: '32px'}}>
                    <Button danger onClick={addSubject}>Add subject</Button>
                </div>
            </> : null}
            
        </Container>
}

export default SubjectTable
