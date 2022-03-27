import { useState } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { API, Button, Checkbox, FileUpload, Input, RadioButton, RingLoader, Toast } from "../../../../../Components"
import Colours from "../../../../../Config/Colours"
import { EmailRegex, MobileNumberRegex, PostcodeRegex } from "../../../../../Config/Validation"

const Container = styled.div`

`

const Row = styled.div`
    display: flex;
    gap: 16px;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const Section = styled.section`

    position: relative;
    overflow: ${props => props.collapsed ? 'hidden' : 'unset'};
    height: ${props => props.collapsed ? '0' : 'auto'};
    padding-top: 30px;
    margin-top: 16px;

    &:before {
        content: attr(data-label);
        display: block;
        position: absolute;
        top: 0;
        font-size: 24px;
        color: ${Colours.n500};
        cursor: pointer;
        width: 100%;
        border-bottom: 1px solid ${Colours.n700};
    }

    &:after {
        content: "";
        display: block;
        width: 18px;
        height: 18px;
        background: url('/img/chevron.webp');
        position: absolute;
        top: 10px;
        right: 6px;
        background-size: 100%;
        background-repeat: no-repeat;

        ${props => !props.collapsed ? `
            transform: rotate(180deg);
            top: 4px;
        ` : ''}
    }
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;

    & > span {
        font-weight: normal;
        color: ${Colours.n500};
        opacity: .6;
    }
`

const Spacer = styled.div`
    height: 8px;
`

/**
 * Form for creating new admin type users
 */
function NewAdmin({...props}) {

    const [sections, setSections] = useState({
        account: false,
        address: true,
        profile: true
    })

    const history = useHistory()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [verificationStatus, setVerificationStatus] = useState(null)
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [county, setCounty] = useState("")
    const [city, setCity] = useState("")
    const [postcode, setPostcode] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [profilePicUrl, setProfilePicUrl] = useState("")
    const [profilePicFilename, setProfilePicFilename] = useState("")
    const [gender, setGender] = useState("")

    const [uploading, setUploading] = useState(false)

    const toggleSection = (event, section) => {

        const rect = event.target.closest('.section').getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
    
        if (y <= 25) {
            setSections({
                ...sections,
                [section]: !sections[section]
            })
        }
    }

    const save = async () => {

        setUploading(true)

        let hasErrors = false 
        const params = {
            email,
            password,
            verification_status: verificationStatus,
            accept_tos: true,
            no_login: true
        }

        if (firstName) { params.name = firstName }
        if (lastName) { params.surname = lastName }
        if (addressLine1) { params.address_line_1 = addressLine1 }
        if (addressLine2) { params.address_line_2 = addressLine2 }
        if (county) { params.county = county }
        if (city) { params.city = city }
        if (postcode) { params.postcode = postcode }
        if (mobileNumber) { params.mobile_number = mobileNumber }
        if (gender) { params.gender = gender }

        if (profilePicUrl) {
            if (profilePicUrl.startsWith('blob:')) {
                const formdata = new FormData()
                formdata.append("file", new File([ await fetch(profilePicUrl).then(r => r.blob()) ], profilePicFilename))
                const response = await API.post("upload/public", formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                params.profile_image = response.data.url
                setProfilePicUrl(response.data.url)
            } else {
                params.profile_image = profilePicUrl
            }
        }

        if (!hasErrors) {
            try {
                const response = await API.post("register/admin", params)
                
                if (response && response.data && response.data.success) {
                    Toast.success("Successfully created new admin")
                    history.push('/admin/manage-users')
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                if (error.response.data.errors && error.response.data.errors.email) {
                    Toast.error(error.response.data.errors.email)
                } else {
                    Toast.error("An unexpected error occured, please try again.")
                }
            }
        } else {
            Toast.error("Some fields have invalid values. Please review/revise and try again.")
        }

        setUploading(false)
    }

    return <Container>
        <Section className="section" data-label="Account" collapsed={sections.account} onClick={e => toggleSection(e, 'account')}>
            <Spacer />
            <Row>
                <Input label="First name" value={firstName} onChange={e => setFirstName(e.target.value)} valid={firstName.length > 0} />
                <Input label="Last name" value={lastName} onChange={e => setLastName(e.target.value)} valid={lastName.length > 0} />
            </Row>

            <Input label="Email*" value={email} onChange={e => setEmail(e.target.value)} valid={email.length > 0 && email.match(EmailRegex)} />
            <Input label="Password*" type="password" value={password} onChange={e => setPassword(e.target.value)} valid={password.length >= 8} />
        </Section>
        
        <Section className="section" data-label="Address" collapsed={sections.address} onClick={e => toggleSection(e, 'address')}>
            <Spacer />
            <Input label="Street name" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} valid={addressLine1.length > 0} />
            <Input value={addressLine2} onChange={e => setAddressLine2(e.target.value)} valid={addressLine2.length > 0} />
            <Input label="Town/area" value={county} onChange={e => setCounty(e.target.value)} valid={county.length > 0} />
            <Input label="City" value={city} onChange={e => setCity(e.target.value)} valid={city.length > 0} />

            <Row>
                <Input label="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} valid={postcode.length > 0 && postcode.match(PostcodeRegex)} />
                <Input label="Mobile number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} valid={mobileNumber.length > 0 && mobileNumber.match(MobileNumberRegex)} />
            </Row>
        </Section>
        
        <Section className="section" data-label="Profile" collapsed={sections.profile} onClick={e => toggleSection(e, 'profile')}>
            <Spacer />
            <Label>Upload a profile picture</Label>
            <FileUpload 
                circle 
                preview 
                accept=".jpg,.jpeg,.png" 
                tagline="PNG or JPEG image, up to 10 mb" 
                maxSize={10}
                onImgSrcUpdate={src => setProfilePicUrl(src)}
                filenameChange={name => setProfilePicFilename(name)}
            />

            <Label>Gender</Label>
            <Row>
                <Checkbox label="Male" value={gender == "male"} setter={value => setGender("male")} />
                <Checkbox label="Female" value={gender == "female"} setter={value => setGender("female")} />
            </Row>
        </Section>

        <Row style={{justifyContent: 'space-between', marginTop: '32px'}}>
            <div></div>
            <Button primary onClick={save}>{uploading ? <RingLoader small /> : 'Create admin'}</Button>
        </Row>
    </Container>
}

export default NewAdmin