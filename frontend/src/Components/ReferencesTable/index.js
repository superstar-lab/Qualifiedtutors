import { useState } from "react"
import styled from "styled-components"
import { Button, Dropdown, Input } from ".."
import { EmailRegex, MobileNumberRegex } from "../../Config/Validation"
import * as Table from "../Table"

const Container = styled.div`

`

const Row = styled.div`
display: flex;
justify-content: space-between;
margin-top: 16px;
gap: 16px;
align-items: center;
`

/**
 * Table to display/edit a tutors references
 * 
 * @param references    Array[Object] Set of reference objects: {name, email, mobile, relationship}
 * @param setReferences Function      Setter for the references array
 * @example 
 *  const [references, setReferences] = useState([])
 *  
 *  ...
 * 
 *  <ReferencesTable references={references} setReferences={setReferences} />
 */
function ReferencesTable({references, setReferences, ...props}) {

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

    return <Container>
        
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
                        <img alt="delete" style={{width: '16px', height: '16px', cursor: 'pointer'}} src="/img/delete_red.webp" onClick={e => deleteReference(index)} />
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
            
            <Button style={{whiteSpace: 'nowrap', marginTop: '12px', height: '44px'}} danger onClick={addReference}>Add reference</Button>
        </Row>
    </Container>
}

export default ReferencesTable