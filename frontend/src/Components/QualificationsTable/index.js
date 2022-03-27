import styled from 'styled-components'
import { Table, Head, Heading, Body, Row, Col } from '../Table'
import Input from '../Input'
import Checkbox from '../Checkbox'
import Colours from '../../Config/Colours.js'
import { useState, useEffect } from 'react'
import { Button, Dropdown } from '..'
import zIndex from '../../Config/zIndex'
import Universities from '../../Config/Universities'

const Container = styled.div`
    
    & thead > *:nth-of-type(3) {
        width: 96px;
    }

    & thead > *:last-of-type {
        width: 64px;
    }

    & .controls {
        flex-wrap: wrap;
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
    gap: 16px;
    margin-top: 16px;

    & div:nth-of-type(1) {
        flex: 1.25;
    }

    & div:nth-of-type(2) {
        flex: 2;
    }

    & div:nth-of-type(3) {
        flex: 1;
    }
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

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Label = styled.label`
    color: ${Colours.b500};
    font-weight: bold;
    display: block;
`

/**
 * Qualifications table
 * 
 * 
 * @param qualifications    Array 
 * @param setQualifications Function
 * @param instituionLabel   String
 * @param titleLabel        String
 * @param gradeLabel        String
 * @param institutions      Array
 * @param titles            Array
 * @param grades            Array
 * @param degree            Boolean
 * @param style             Object
 * @param className         String
 * @param addTitle          
 * @param gradeOptional     Boolean
 * @param mobile            Boolean
 * @returns 
 */
function QualificationsTable({ 
    qualifications, 
    setQualifications,
    instituionLabel,
    titleLabel,
    gradeLabel,
    institutions,
    titles,
    grades,
    degree,
    style,
    className,
    addTitle,
    gradeOptional,
    mobile
}) {
   
    const [currentSchool, setCurrentSchool] = useState("")
    const [currentQualification, setCurrentQualification] = useState("")
    const [currentGrade, setCurrentGrade] = useState("")
    const [currentDegree, setCurrentDegree] = useState(null)
    const [currentOther, setCurrentOther] = useState(null)

    const [currentSchoolError, setCurrentSchoolError] = useState(null)
    const [currentQualificationError, setCurrentQualificationError] = useState(null)
    const [currentGradeError, setCurrentGradeError] = useState(null)
    const [currentTypeError, setCurrentTypeError] = useState(null)


    const [editingSchool, setEditingSchool] = useState("")
    const [editingQualification, setEditingQualification] = useState("")
    const [editingGrade, setEditingGrade] = useState("")
    const [editingDegree, setEditingDegree] = useState(null)
    const [editingOther, setEditingOther] = useState(null)

    const [editingSchoolError, setEditingSchoolError] = useState(null)
    const [editingQualificationError, setEditingQualificationError] = useState(null)
    const [editingGradeError, setEditingGradeError] = useState(null)
    const [editingTypeError, setEditingTypeError] = useState(null)

    const [editingIndex, setEditingIndex] = useState(null)

    const addQualification = () => {
        let hasErrors = false

        if (!currentSchool) {
            hasErrors = true
            setCurrentSchoolError((instituionLabel ? instituionLabel : 'Qualification') + " is required")
        } else { setCurrentSchoolError(null) }

        if (!currentQualification) {
            hasErrors = true 
            setCurrentQualificationError((titleLabel ? titleLabel : 'Title') + " is required")
        } else { setCurrentQualificationError(null) }

        if (!currentGrade && !gradeOptional) {
            hasErrors = true 
            setCurrentGradeError((gradeLabel ? gradeLabel : 'Grade') + " is required")
        } else { setCurrentGradeError(null) }

        if (!hasErrors) {
            setQualifications([
                ...qualifications,
                {
                    school: currentSchool,
                    title: currentQualification,
                    grade: currentGrade,
                    degree: !!degree,
                    other: !degree
                }
            ])

            setCurrentQualification("")
            setCurrentSchool("")
            setCurrentGrade("")
            setCurrentDegree(null)
            setCurrentOther(null)

        }
    }

    const deleteQualification = index => {
        const q = [...qualifications]
        q.splice(index, 1)
        setQualifications(q)
    }

    const editQualification = (index) => {
        const q = {...qualifications[index]}

        setEditingQualification(q.title)
        setEditingSchool(q.school)
        setEditingGrade(q.grade)
        setEditingDegree(q.degree)
        setEditingOther(q.other)

        setEditingIndex(index)
    }

    const saveEdits = (index) => {

        let hasErrors = false

        if (!editingSchool) {
            hasErrors = true
            setEditingSchoolError("Required")
        } else { setEditingSchoolError(null) }

        if (!editingQualification) {
            hasErrors = true 
            setEditingQualificationError("Required")
        } else { setEditingQualificationError(null) }

        if (!editingGrade && !gradeOptional) {
            hasErrors = true 
            setEditingGradeError("Required")
        } else { setEditingGradeError(null) }        

        if (!hasErrors) {
            const quals = qualifications.map(q => ({...q}))
            quals[editingIndex] = {
                school: editingSchool,
                title: editingQualification,
                grade: editingGrade,
                degree: editingDegree,
                other: editingOther
            }

            setQualifications(quals)
            cancelEdits()
        }
    }

    const cancelEdits = (index) => {

        setEditingQualification("")
        setEditingSchool("")
        setEditingGrade("")
        setEditingDegree(null)
        setEditingOther(null)

        setEditingIndex(null)
    }

    return <Container className={className ? className : ''} mobile={mobile}>
        <Table style={style ? style : {}}>
            <Head>
                <Heading>{instituionLabel ? instituionLabel : 'Place/School/Uni'}</Heading>
                <Heading>{titleLabel ? titleLabel : 'Subject'}</Heading>
                <Heading>{gradeLabel ? gradeLabel : 'Grade'}</Heading>
                {/* {!degree ? <Heading>Type</Heading> : null} */}
                <Heading></Heading>
            </Head>

            <Body>
                {qualifications.map((qualification, index) => <Row>
                    <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top + 30 : 'unset'}}>
                        {mobile ? <Label>{instituionLabel ? instituionLabel : 'Place/School/Uni'}</Label> : null}
                        {editingIndex != index ?  qualification.school
                        : (
                            institutions ? 
                                <Dropdown 
                                    editable
                                    placeholder={"Type/choose " + (instituionLabel ? instituionLabel : "Place/School/Uni")}
                                    selected={editingSchool}
                                    onChange={(value, node) => setEditingSchool(node ? node.key : value)}
                                    error={editingSchoolError}
                                >{institutions.map((uni, index) => <span key={uni}>{uni}</span>)}</Dropdown>
                            : <Input value={editingSchool} error={editingSchoolError} onChange={e => setEditingSchool(e.target.value)} style={{marginRight: '16px'}} />
                        )
                    }</Col>
                    <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top + 20 : 'unset'}}>
                        {mobile ? <Label>{titleLabel ? titleLabel : 'Subject'}</Label> : null}
                        {editingIndex != index ? qualification.title 
                        : (
                            titles ? 
                                <Dropdown 
                                    editable
                                    placeholder={"Type/choose " + (titleLabel ? titleLabel : "Subject/Qualification title")}
                                    selected={editingQualification}
                                    onChange={(value, node) => setEditingQualification(node ? node.key : value)}
                                    error={editingQualificationError}
                                >{titles.map((title, index) => <span key={title}>{title}</span>)}</Dropdown>
                            : <Input value={editingQualification} error={editingQualificationError} onChange={e => setEditingQualification(e.target.value)} style={{marginRight: '16px'}}  />
                        )
                    }</Col>
                    <Col style={{position: 'relative', zIndex: editingIndex == index ? zIndex.top + 10 : 'unset'}}>
                        {mobile ? <Label>{gradeLabel ? gradeLabel : 'Grade'}</Label> : null}
                        {editingIndex != index ? qualification.grade : (
                            grades ? 
                                <Dropdown 
                                    editable
                                    placeholder={"Type/choose " + (gradeLabel ? gradeLabel : "Grade")}
                                    selected={editingGrade}
                                    onChange={(value, node) => setEditingGrade(node ? node.key : value)}
                                    error={editingGradeError}
                                >{grades.map((grade, index) => <span key={grade}>{grade}</span>)}</Dropdown>
                            : <Input value={editingGrade} error={editingGradeError} onChange={e => setEditingGrade(e.target.value)} style={{maxWidth: '96px'}} />
                        )
                    }</Col>
                    {/*
                    {!degree ? <Col>
                        <div>{qualification.degree ? 'Degree' : ''}</div>
                        <div>{qualification.other ? 'Other' : ''}</div>
                    </Col> : null}
                    */}
                    <Col className='noclip actions' style={{textAlign: 'center', position: 'relative', zIndex: zIndex.top}}>
                        {editingIndex == index ? <>
                            <img alt="save" onClick={e => saveEdits(index)} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/checkmark_green.svg" />
                            <img alt="cancel" onClick={e => cancelEdits(index)} style={{width: '14px', height: '14px', cursor: 'pointer'}} src="/img/close_red.webp" />
                        </> : <>
                            <img alt="edit" style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/edit_green.webp" onClick={e => editQualification(index)} />
                            <img alt="delete" style={{width: '16px', height: '16px', cursor: 'pointer'}} src="/img/delete_red.webp" onClick={e => deleteQualification(index)} />
                        </>}
                        
                    </Col>
                </Row>)}
            </Body>
        </Table>

        <Split className='controls'>
            <div style={{position: 'relative', zIndex: zIndex.top + 3}}>
            {institutions ? 
                <Dropdown 
                    editable
                    style={{minWidth: '230px'}}
                    label={instituionLabel ? instituionLabel : "Place/School/Uni"}
                    placeholder={"Type/choose " + (instituionLabel ? instituionLabel : "Place/School/Uni")}
                    selected={currentSchool}
                    onChange={(value, node) => setCurrentSchool(node ? node.key : value)}
                    error={currentSchoolError}
                >{institutions.map((uni, index) => <span key={uni}>{uni}</span>)}</Dropdown>
            : <Input style={{minWidth: '230px', marginRight: '16px'}} value={currentSchool} error={currentSchoolError} onChange={e => setCurrentSchool(e.target.value)} label={instituionLabel ? instituionLabel : "Place/School/Uni"} />
            }
            </div>

            <div style={{position: 'relative', zIndex: zIndex.top + 2}} className='coursecontainer'>
            {titles ? 
                <Dropdown 
                    editable
                    label={titleLabel ? titleLabel : "Subject/Qualification title"}
                    placeholder={"Type/choose " + (titleLabel ? titleLabel : "Subject/Qualification title")}
                    selected={currentQualification}
                    onChange={(value, node) => setCurrentQualification(node ? node.key : value)}
                    error={currentQualificationError}
                >{titles.map((title, index) => <span key={title}>{title}</span>)}</Dropdown>
            : <Input style={{minWidth: '230px', marginRight: '16px'}} value={currentQualification} error={currentQualificationError} onChange={e => setCurrentQualification(e.target.value)} label={titleLabel ? titleLabel : "Subject/Qualification title"} />
            }
            </div>

            <div style={{position: 'relative', zIndex: zIndex.top + 1}}>
            {grades ? 
                <Dropdown 
                    editable
                    style={{minWidth: '200px'}}
                    label={gradeLabel ? gradeLabel : "Grade"}
                    placeholder={"Type/choose " + (gradeLabel ? gradeLabel : "Grade")}
                    selected={currentGrade}
                    onChange={(value, node) => setCurrentGrade(node ? node.key : value)}
                    error={currentGradeError}
                >{grades.map((grade, index) => <span key={grade}>{grade}</span>)}</Dropdown>
            : <Input style={{minWidth: '200px'}} placeholder={gradeOptional ? 'Optional' : ''} value={currentGrade} error={currentGradeError} onChange={e => setCurrentGrade(e.target.value)} label={gradeLabel ? gradeLabel : "Grade"} />}
            </div>

            {/*
            {!degree ? 
            <Column style={{marginLeft: '16px'}}>
                <Checkbox value={currentDegree} setter={setCurrentDegree} style={{marginTop: '32px'}} label="Degree" />
                <Checkbox value={currentOther} setter={setCurrentOther} style={{marginTop: '8px'}} label="Other" />
                {currentTypeError ? <Error>{currentTypeError}</Error> : null}
            </Column> : null}
            */}
        </Split>

        <div style={{display: 'flex', justifyContent: 'flex-end', lineHeight: '32px', marginTop: '16px'}}>
            <Button danger onClick={addQualification}>Add {addTitle ? addTitle : (instituionLabel ? instituionLabel.toLowerCase() : 'qualification')}</Button>
        </div>

    </Container>
}

export default QualificationsTable
