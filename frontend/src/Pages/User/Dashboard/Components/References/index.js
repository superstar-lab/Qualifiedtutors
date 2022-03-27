import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { Button, Input, RingLoader, Toast, API, Dropdown } from '../../../../../Components'
import * as Table from '../../../../../Components/Table'
import Colours from '../../../../../Config/Colours'
import { EmailRegex, MobileNumberRegex } from '../../../../../Config/Validation'
import { v4 as uuid } from 'uuid'
import useWindowSize from '../../../../../Hooks/UseWindowSize'

const Container = styled.div`
    & p {
        color: #616161;
        line-height: 24px;
        font-size: 16px;
    }

    & thead > *:nth-of-type(4) {
        width: 96px;
    }

    & thead > *:nth-of-type(5) {
        width: 64px;
    }
`

const Row = styled.div`
    display: flex;

    @media screen and (max-width: 720px) {
        flex-wrap: wrap;
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


const Label = styled.label`
    color: ${Colours.b500};
    font-weight: bold;
    display: block;
`

function References({user, setUser}) {

    const [references, setReferences] = useState([])

    const [currentName, setCurrentName] = useState("")
    const [currentEmail, setCurrentEmail] = useState("")
    const [currentMobile, setCurrentMobile] = useState("")
    const [currentRelationship, setCurrentRelationship] = useState("")

    const [currentNameError, setCurrentNameError] = useState("")
    const [currentEmailError, setCurrentEmailError] = useState("")
    const [currentMobileError, setCurrentMobileError] = useState("")
    const [currentRelationshipError, setCurrentRelationshipError] = useState("")

    const [editingName, setEditingName] = useState("")
    const [editingEmail, setEditingEmail] = useState("")
    const [editingMobile, setEditingMobile] = useState("")
    const [editingRelationship, setEditingRelationship] = useState("")
    const [editingNameError, setEditingNameError] = useState("")
    const [editingEmailError, setEditingEmailError] = useState("")
    const [editingMobileError, setEditingMobileError] = useState("")
    const [editingRelationshipError, setEditingRelationshipError] = useState("")

    const [editingIndex, setEditingIndex] = useState(null)
    const [saving, setSaving] = useState(false)

    const windowSize = useWindowSize()

    useEffect(() => {
        if (user && user.references && user.references != "") {
            setReferences(JSON.parse(user.references))
        }
    }, [user])

    const addReference = () => {
        let hasErrors = false 

        if  (!currentName) { setCurrentNameError("Name is required"); hasErrors = true; }
        else { setCurrentNameError("") }

        if  (!currentEmail) { setCurrentEmailError("Email is required"); hasErrors = true; }
        else { setCurrentEmailError("") }
        if  (!currentEmail.match(EmailRegex)) { setCurrentEmailError("Must be a valid email"); hasErrors = true; }
        else { setCurrentEmailError("") }

        if  (!currentMobile) { setCurrentMobileError("Mobile number is required"); hasErrors = true; }
        else { setCurrentMobileError("") }
        if  (!currentMobile.replaceAll(' ', '').replaceAll('+', '').match(MobileNumberRegex)) { setCurrentMobileError("Must be a valid mobile number"); hasErrors = true; }
        else { setCurrentMobileError("") }

        if  (!currentRelationship) { setCurrentRelationshipError("Relationship is required"); hasErrors = true; }
        else { setCurrentRelationshipError("") }

        if (!hasErrors) {
            setReferences([
                ...references,
                {
                    name: currentName,
                    email: currentEmail,
                    mobile: currentMobile,
                    relationship: currentRelationship,
                    status: 'pending',
                    contacted: false,
                    response: {},
                    uuid: uuid()
                }
            ])
            setCurrentName("")
            setCurrentEmail("")
            setCurrentMobile("")
            setCurrentRelationship("")
        }
    }

    const editReference = index => {

        const ref = references[index]

        setEditingName(ref.name)
        setEditingEmail(ref.email)
        setEditingMobile(ref.mobile)
        setEditingRelationship(ref.relationship)

        setEditingNameError("")
        setEditingEmailError("")
        setEditingMobileError("")
        setEditingRelationshipError("")

        setEditingIndex(index)
    }

    const deleteReference = index => {
        const refs = references.map(r => ({...r}))
        refs.splice(index, 1)
        setReferences(refs)
    }

    const saveEdits = index => {

        const refs = references.map(r => ({...r}))
        const ref = refs[index]

        refs[index] = {
            ...refs[index],
            name: editingName,
            email: editingEmail,
            mobile: editingMobile,
            relationship: editingRelationship
        }

        setReferences(refs)
        cancelEdits()
    }

    const cancelEdits = index => {
        setEditingName("")
        setEditingEmail("")
        setEditingMobile("")
        setEditingRelationship("")

        setEditingNameError("")
        setEditingEmailError("")
        setEditingMobileError("")
        setEditingRelationshipError("")

        setEditingIndex(null)
    }

    const save = async event => {
        setSaving(true)

        try {
            const response = await API.post('tutor/profile/references', {
                references
            })

            if (response && response.data && response.data.success) {
                setUser({
                    ...user,
                    references: response.data.user.references
                })
                if (response.data.sentEmail) {
                    Toast.success("Successfully emailed your new reference(s).")
                } else {
                    Toast.success("Successfully updated your references.")
                }
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error saving your references, please try again.")
        }

        setSaving(false)
    }

    useEffect(() => setCurrentNameError(""), [currentName])
    useEffect(() => setCurrentEmailError(""), [currentEmail])
    useEffect(() => setCurrentMobileError(""), [currentMobile])
    useEffect(() => setCurrentRelationshipError(""), [currentRelationship])

    return <>
        <Helmet>
            <title>References - Qualified Tutors</title>
        </Helmet>

        <Container>
            <h1>References</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <Table.Table stacked={windowSize.width < 720}>
                <Table.Head>
                    <Table.Heading>Name</Table.Heading>
                    <Table.Heading>Email Address</Table.Heading>
                    <Table.Heading>Mobile Number</Table.Heading>
                    <Table.Heading>Relationship</Table.Heading>
                    <Table.Heading>Status</Table.Heading>
                    <Table.Heading style={{width: '50px'}}></Table.Heading>
                </Table.Head>

                <Table.Body>
                    {references.map((ref, index) => <Table.Row>
                        <Table.Col>
                            {windowSize.width < 720 ? <Label>Name</Label> : null}
                            {editingIndex !== index ? ref.name :
                                <Input error={editingNameError} value={editingName} onChange={e => setEditingName(e.target.value)} />
                            }
                        </Table.Col>
                        <Table.Col>
                            {windowSize.width < 720 ? <Label>Email address</Label> : null}
                            {editingIndex !== index ? ref.email : 
                                <Input error={editingEmailError} value={editingEmail} valid={editingEmail.match(EmailRegex)} onChange={e => setEditingEmail(e.target.value)} />
                            }
                        </Table.Col>
                        <Table.Col>
                            {windowSize.width < 720 ? <Label>Mobile number</Label> : null}
                            {editingIndex !== index ? ref.mobile : 
                                <Input error={editingMobileError} value={editingMobile} valid={editingMobile.match(MobileNumberRegex)} onChange={e => setEditingMobile(e.target.value)} />
                            }
                        </Table.Col>
                        <Table.Col>
                            {windowSize.width < 720 ? <Label>Relationship</Label> : null}
                            {editingIndex !== index ? ref.relationship : 
                                <Input error={editingRelationshipError} value={editingRelationship} onChange={e => setEditingRelationship(e.target.value)} />
                            }
                        </Table.Col>
                        <Table.Col className="control-column">
                            {windowSize.width < 720 ? <Label>Status</Label> : null}
                            {ref.status == 'no_contact' ? 'no response' : ref.status}
                        </Table.Col>
                        <Table.Col>
                            {editingIndex !== index ? <>
                                {ref.status == 'pending' || ref.status == 'no_contact' ? 
                                    <>
                                        <img alt="edit" style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/edit_green.webp" onClick={e => editReference(index)} />
                                        <img alt="remove" style={{width: '16px', height: '16px', cursor: 'pointer'}} src="/img/delete_red.webp" onClick={e => deleteReference(index)} />  
                                    </>
                                : null}
                            </> : <>
                                <img alt="save" onClick={e => saveEdits(index)} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/checkmark_green.svg" />
                                <img alt="cancel" onClick={e => cancelEdits(index)} style={{width: '14px', height: '14px', cursor: 'pointer'}} src="/img/close_red.webp" />
                            </>}
                        </Table.Col>
                    </Table.Row>)}
                </Table.Body>
            </Table.Table>

            <Row style={{marginTop: '24px', gap: '16px'}} className='control-row'>
                <Input label="Name" error={currentNameError} value={currentName} onChange={e => setCurrentName(e.target.value)} />
                <Input label="Email" error={currentEmailError} value={currentEmail} valid={currentEmail.match(EmailRegex)} onChange={e => setCurrentEmail(e.target.value)} />
                <Input label="Mobile number" error={currentMobileError} value={currentMobile} valid={!!currentMobile && currentMobile.match(MobileNumberRegex)} onChange={e => setCurrentMobile(e.target.value)} />
                
                <Dropdown editable clearable nosearch label="Relationship" error={currentRelationshipError} selected={currentRelationship} onChange={(value, node) => setCurrentRelationship(node && node.key ? node.key : value)} style={{minWidth: '164px'}}>
                    <div key="Colleague">Colleague</div>
                    <div key="Student/student parent">Student/<br />student parent</div>
                    <div key="Manager">Manager</div>
                    <div key="Solicitor">Solicitor</div>
                    <div key="Doctor">Doctor</div>
                    <div key="Other">Other</div>
                </Dropdown>
            </Row>

            <Row style={{justifyContent: 'space-between'}}>
                <div></div>
                <div style={{display: 'flex', justifyContent: 'flex-end', lineHeight: '32px'}}>
                    <Button danger onClick={addReference}>Send reference</Button>
                </div>
            </Row>

            <Row style={{justifyContent: 'space-between', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300}}>
                <div></div>
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default References