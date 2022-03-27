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
    Circle,
    Table,
    Button,
    Input,
    Underline
} from '../../../../Components'
import { EmailRegex, MobileNumberRegex } from '../../../../Config/Validation'

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

        & > div {
            font-size: 100px;
            top: -10.4px;
        }
    }

    & .contentsplit {
        margin-top: 112px;
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

            & > div:last-of-type {
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

        tbody tr > td:first-of-type {
            max-width: 0 !important;
            padding: 0 0;
        }

        tbody tr > td {
            padding: 0 2px;
            max-width: 0 !important;
        }

        thead th {
            padding: 16px 4px;
            max-width: 0 !important;
        }

        tbody tr > td:last-of-type {
            max-width: unset !important;
            padding: 0 0;
        }

        & .contentsplit {
            & > div:first-of-type {
                
                flex-wrap: wrap;

                & .inputcontainer {
                    margin-bottom: 0;

                }
            }

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
`

const Split = styled.div`
    display: flex;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    gap: 16px;
    align-items: center;
    
`

function TutorReferences() {
   
    const location = useLocation()
    const history = useHistory()

    const [references, setReferences] = useState([])

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [relationship, setRelationship] = useState("")

    const [editingIndex, setEditingIndex] = useState(null)
    const [editingName, setEditingName] = useState("")
    const [editingEmail, setEditingEmail] = useState("")
    const [editingMobile, setEditingMobile] = useState("")
    const [editingRelationship, setEditingRelationship] = useState("")

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [mobileError, setMobileError] = useState("")
    const [relationshipError, setRelationshipError] = useState("")

    const [editingNameError, setEditingNameError] = useState("")
    const [editingEmailError, setEditingEmailError] = useState("")
    const [editingMobileError, setEditingMobileError] = useState("")
    const [editingRelationshipError, setEditingRelationshipError] = useState("")

    useEffect(() => {
        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.references) {
            setReferences(reg.references)
        }
    }, [])

    const persist = () => {
        
        const reg = JSON.parse(window.localStorage.getItem("registration")) 
        
        reg.references = references
        
        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const back = event => {
        event.preventDefault()
        persist()
        history.push('/register-tutor-availability', {
            progress: {
                ...location.state.progress,
                current: 'availability',
                complete: 8
            }
        })
    }

    const saveAndContinue = event => {
        event.preventDefault()
        persist()

        const steps = [...location.state.progress.steps]
        if (references && references.length >= 2) {
            steps.push('references')
        }

        history.push('/register-tutor-finalize', {
            progress: {
                ...location.state.progress,
                steps,
                current: 'finalize',
                complete: 10
            }
        })

    }

    const addReference = () => {
        let hasErrors = false 

        if (!name) {
            hasErrors = true
            setNameError("Name is required")
        } else {
            setNameError("")
        }

        if (!email) {
            hasErrors = true
            setEmailError("Email is required")
        } else if (!email.match(EmailRegex)) {
            hasErrors = true
            setEmailError("Must be a valid email")
        } else {
            setEmailError("")
        }

        if (!mobile) {
            hasErrors = true 
            setMobileError("Required")
        } else if (!mobile.match(MobileNumberRegex)) {
            hasErrors = true 
            setMobileError("Must be a valid mobile number")
        } else {
            setMobileError("")
        }

        if (!relationship) {
            hasErrors = true
            setRelationshipError("Relationship is required")
        } else {
            setRelationshipError("")
        }

        if (!hasErrors) {
            setReferences([
                ...references,
                {
                    name,
                    email,
                    mobile,
                    relationship
                }
            ])
            setName("")
            setEmail("")
            setMobile("")
            setRelationship("")
        }
    }

    const editReference = index => {
        const r = {...references[index]}

        setEditingName(r.name)
        setEditingEmail(r.email)
        setEditingMobile(r.mobile)
        setEditingRelationship(r.relationship)

        setEditingIndex(index)
    }

    const deleteReference = index => {
        const r = [...references]
        r.splice(index, 1)
        setReferences(r)
    }

    const saveEdits = index => {

        let hasErrors = false 

        if (!editingName) {
            hasErrors = true
            setEditingNameError("Required")
        } else {
            setEditingNameError("")
        }

        if (!editingEmail) {
            hasErrors = true
            setEditingEmailError("Required")
        } else if (!editingEmail.match(EmailRegex)) {
            hasErrors = true
            setEditingEmailError("Must be a valid email")
        } else {
            setEditingEmailError("")
        }

        if (!editingMobile) {
            hasErrors = true 
            setEditingMobileError("Required")
        } else if (!editingMobile.match(MobileNumberRegex)) {
            hasErrors = true 
            setEditingMobileError("Must be a valid mobile number")
        } else {
            setEditingMobileError("")
        }

        if (!editingRelationship) {
            hasErrors = true
            setEditingRelationshipError("Required")
        } else {
            setEditingRelationshipError("")
        }

        if (!hasErrors) {
            const refs = references.map(r => ({...r}))
            refs[editingIndex] = {
                name: editingName,
                email: editingEmail,
                mobile: editingMobile,
                relationship: editingRelationship
            }   
            setReferences(refs)
            cancelEdits()
        }
    }

    const cancelEdits = index => {
        setEditingName("")
        setEditingEmail("")
        setEditingMobile("")
        setEditingRelationship("")

        setEditingIndex(null)
    }

    return <FixedWidth>
        <Container>
            <h1>Si<Underline offset="-16px">gn up.</Underline> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>
            <Card>
                 <Circle colour={Colours.r050}>10</Circle>

                <Split className='mainsplit'>
                     <Column style={{flex: '8px', marginRight: '64px', maxWidth: '372px'}}>
                        <h2>References</h2>
                        <p style={{maxWidth: '375px'}}>Please provide us contact information for <b>at least two referees</b>. We will email them to collect a reference. This is a requirement to start tutoring at Qualified Tutors.</p>
                    </Column>
                    
                    <Column className='contentsplit'>
                        <Table.Table>
                                <Table.Head>
                                        <Table.Heading>Name</Table.Heading>
                                        <Table.Heading>Email Address</Table.Heading>
                                        <Table.Heading>Mobile Number</Table.Heading>
                                        <Table.Heading>Relationship</Table.Heading>
                                        <Table.Heading style={{width: '48px'}}></Table.Heading>
                                </Table.Head>

                                <Table.Body>
                                    {references.map((ref, index) => <Table.Row>
                                        <Table.Col>{
                                            editingIndex == index ? <Input error={editingNameError} value={editingName} onChange={e => setEditingName(e.target.value)} /> : ref.name
                                        }</Table.Col>
                                        <Table.Col>{
                                            editingIndex == index ? <Input error={editingEmailError} value={editingEmail} onChange={e => setEditingEmail(e.target.value)} /> : ref.email
                                        }</Table.Col>
                                        <Table.Col>{
                                            editingIndex == index ? <Input error={editingMobileError} value={editingMobile} onChange={e => setEditingMobile(e.target.value)} /> : ref.mobile
                                        }</Table.Col>
                                        <Table.Col>{
                                            editingIndex == index ? <Input error={editingRelationshipError} value={editingRelationship} onChange={e => setEditingRelationship(e.target.value)} /> : ref.relationship
                                        }</Table.Col>
                                        <Table.Col>
                                        {editingIndex != index ? <>
                                            <img alt="edit" style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/edit_green.webp" onClick={e => editReference(index)} />
                                            <img alt="remove" style={{width: '16px', height: '16px', cursor: 'pointer'}} src="/img/delete_red.webp" onClick={e => deleteReference(index)} />
                                        </> : <>
                                            <img alt="save" onClick={e => saveEdits(index)} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/checkmark_green.svg" />
                                            <img alt="cancel" onClick={e => cancelEdits(index)} style={{width: '14px', height: '14px', cursor: 'pointer'}} src="/img/close_red.webp" />
                                        </>}
                                        </Table.Col>
                                    </Table.Row>)}
                                </Table.Body>
                            </Table.Table>

                            <Row>
                                <Input label="Name" value={name} onChange={e => setName(e.target.value)} error={nameError} />
                                <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} error={emailError} />
                                <Input label="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} error={mobileError} />
                                <Dropdown 
                                    label="Relationship"
                                    onChange={value => setRelationship(value)}
                                    selected={relationship}
                                    style={{marginTop: '-20px'}}
                                    error={relationshipError}
                                >
                                    <div key="colleague">Colleague</div>
                                    <div key="doctor">Doctor</div>
                                    <div key="solicitor">Solicitor</div>
                                    <div key="teacher">Teacher</div>
                                    <div key="other">Other</div>
                                </Dropdown>
                                
                                <Button style={{whiteSpace: 'nowrap', marginTop: '12px', height: '44px'}} danger onClick={addReference}>Send reference</Button>
                            </Row>
                    </Column>
                </Split>


                    <Split style={{marginTop: '80px', justifyContent: 'space-between'}}>
                        <div>  
                            <Link black onClick={back} style={{display: 'flex', paddingTop: '16px'}}>
                                <img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back
                            </Link>
                        </div>

                        <div>
                            <Link className='acceptBtn' primary btn onClick={saveAndContinue}>SAVE AND CONTINUE</Link>
                        </div>
                    </Split>

            </Card>
        </Container>
    </FixedWidth>
}

export default TutorReferences
