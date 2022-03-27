import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { useState, useEffect } from 'react'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    API,
    FileUpload
} from '../../../../../Components'
import {
    EmailRegex,
    PostcodeRegex,
    MobileNumberRegex
} from '../../../../../Config/Validation.js'
import Colours from '../../../../../Config/Colours.js'

const Container = styled.div`

    @media screen and (max-width: 640px) {
        .card {
            padding: 32px;
        }
    }
`

const Row = styled.div`
    display: flex;
    gap: 16px;

    @media screen and (max-width: 640px) {
        flex-wrap: wrap;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`   

const Error = styled.div`
   color: ${Colours.r400}; 
   line-height: 24px;
   margin-bottom: 8px;

   & img {
       position: relative;
       top: 2px;
   }
`

function PersonalDetails({user, setUser, readonly}) {

    const [firstName, setFirstName] = useState(user.name ? user.name : "")
    const [surname, setSurname] = useState(user.surname ? user.surname : "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [email, setEmail] = useState(user.email ? user.email : "")
    const [addressLine1, setAddressLine1] = useState(user.address_line_1 ? user.address_line_1 : "")
    const [addressLine2, setAddressLine2] = useState(user.address_line_2 ? user.address_line_2 : "")
    const [city, setCity] = useState(user.city ? user.city : "")
    const [county, setCounty] = useState(user.county ? user.county : "")
    const [mobileNumber, setMobileNumber] = useState(user.mobile_number ? user.mobile_number : "")
    const [postcode, setPostcode] = useState(user.postcode ? user.postcode : "")
    
    const [profilePicUrl, setProfilePicUrl] = useState(null)
    const [profilePicFileRef, setProfilePicFileRef] = useState(null)
    const [profilePicCanonUrl, setProfilePicCanonUrl] = useState(user.profile_image ? user.profile_image : null)
    const [profilePicError, setProfilePicError] = useState(null)

    const [firstNameError, setFirstNameError] = useState(null)
    const [surnameError, setSurnameError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [addressLine1Error, setAddressLine1Error] = useState(null)
    const [cityError, setCityError] = useState(null)
    const [mobileNumberError, setMobileNumberError] = useState(null)
    const [postcodeError, setPostcodeError] = useState(null)
    const [currentPasswordError, setCurrentPasswordError] = useState(null)
    const [newPasswordError, setNewPasswordError] = useState(null)

    const [saving, setSaving] = useState(false)

    useEffect(() => !firstName ? setFirstNameError("First name is required") : setFirstNameError(null), [firstName])
    useEffect(() => !surname ? setSurnameError("Surname is required") : setSurnameError(null), [surname])
    useEffect(() => !email.toLowerCase().match(EmailRegex) ? setEmailError("A valid email is required") : setEmailError(null), [email])
    useEffect(() => !mobileNumber || !mobileNumber.match(MobileNumberRegex) ? setMobileNumberError("A valid mobile number is required") : setMobileNumberError(null), [mobileNumber])

    const save = async event => {
        const params = {
            name: firstName,
            surname,
            email,
            mobile_number: mobileNumber   
        }

        if (newPassword) {
            let hasErrors = false
            if (newPassword.length < 8) {
                setNewPasswordError("Password must be at least 8 characters")
                hasErrors = true
            }

            if (!currentPassword) {
                setCurrentPasswordError("Current password is required")
                hasErrors = true
            }

            if (currentPassword.length < 8) {
                setCurrentPasswordError("Password must be at least 8 characters")
                hasErrors = true
            }

            if (newPassword == currentPassword) {
                setCurrentPasswordError("Passwords can not match")
                setNewPasswordError("Passwords can not match")
                hasErrors = true
            }

            if (hasErrors) {
                return
            }

            params.password = currentPassword
            params.new_password = newPassword
        }

        // Compare address values to existing to avoid unnecessary calls to the geocoding api
        if (addressLine1 != user.address_line_1) {
            params.address_line_1 = addressLine1
        }
        if (addressLine2 != user.address_line_2) {
            params.address_line_2 = addressLine2
        }
        if (city != user.city) {
            params.city = city
        }
        if (county != user.county) {
            params.county = county
        }
        if (postcode != user.postcode) {
            params.postcode = postcode
        }

        setSaving(true)

        if (user.role == 'client' && profilePicUrl && profilePicUrl.startsWith('blob:')) {
            const formdata = new FormData()
            formdata.append("file", new File([ await fetch(profilePicUrl).then(r => r.blob()) ], profilePicFileRef.files[0].name))
            const response = await API.post("upload/public", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            params.profile_image = response.data.url
            setProfilePicUrl(response.data.url)
        }

        try {
            const response = await API.post('user/profile/personal_details', params)
            if (response && response.data && response.data.success) {
                setUser({
                    ...user,
                    ...response.data.user
                })
                Toast.success("Successfully updated your profile details.")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Unexpected error while trying to update your profile, please try again.")
        }
        setSaving(false)
    }

   return <>
   <Helmet>
        <title>Personal details - Qualified Tutors</title>
    </Helmet>

   <Container>
        <h1>Personal details</h1>

        {user.role == 'client' ? <>
                <h2>Profile picture</h2>

                <FileUpload 
                    readonly={readonly}
                    circle 
                    preview 
                    className='fileinp'
                    accept=".jpg,.jpeg,.png" 
                    tagline="PNG or JPEG image, up to 10 mb" 
                    maxSize={10}
                    onImgSrcUpdate={src => setProfilePicUrl(src)}
                    error={!!profilePicError}
                    onFileRefChange={node => setProfilePicFileRef(node)}
                    canonImgSrc={profilePicCanonUrl}
                />
            </> : null}

        <h2>Name</h2>
        <Row>
            <Input 
                readonly={readonly}
                label="First name" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                error={firstNameError}
            />
            <Input 
                readonly={readonly}
                label="Surname" 
                value={surname} 
                onChange={e => setSurname(e.target.value)} 
                error={surnameError}
            />
        </Row>

        <h2>Contact</h2>
        <Row>
            <Input 
                readonly={readonly}
                label="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                error={emailError}
                valid={email.toLowerCase().match(EmailRegex)}
            />
            <Input 
                readonly={readonly}
                label="Mobile number" 
                value={mobileNumber} 
                onChange={e => setMobileNumber(e.target.value)} 
                valid={mobileNumber && mobileNumber.match(MobileNumberRegex)}
                error={mobileNumberError}
            />
        </Row>

        {!readonly ? <>
            <h2>Password</h2>
            <p>To update your password enter your current password followed by your new password.</p>
            <Row>
                <Input 
                    readonly={readonly}
                    type="password"
                    label="Current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    error={currentPasswordError}
                    valid={currentPassword.length >= 8}
                />
                <Input 
                    readonly={readonly}
                    type="password"
                    label="New password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    error={newPasswordError}
                    valid={newPassword.length >= 8}
                />
            </Row>
        </> : null}

        <h2>Address</h2>
        {user.latitude == -256 || user.longitude == -256 ? <Error>
            <img alt="error" src='/img/danger.webp' style={{width: '18px'}} /> We were unable to locate this address. Users may have trouble finding you when searching based on location. Please correct your address and press save.<br /><br />If you are unable to resolve this please contact support.
        </Error> : null}
        <Column>
            <Input 
                readonly={readonly}
                label="Address line 1" 
                value={addressLine1} 
                onChange={e => setAddressLine1(e.target.value)} 
                error={addressLine1Error}
            />
            <Input 
                readonly={readonly}
                label="Address line 2" 
                value={addressLine2} 
                onChange={e => setAddressLine2(e.target.value)} 
            />
            <Row>
                <Input 
                    readonly={readonly}
                    label="City" 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    error={cityError}
                />
                <Input 
                    readonly={readonly}
                    label="Town/Area" 
                    value={county} 
                    onChange={e => setCounty(e.target.value)} 
                />
                <Input 
                    readonly={readonly}
                    label="Postcode" 
                    value={postcode} 
                    onChange={e => setPostcode(e.target.value)} 
                    error={postcodeError}
                    valid={postcode.match(PostcodeRegex)}
                />
            </Row>
        </Column>

        {!readonly ? 
            <Row style={{marginTop: '36px', display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button 
                    primary 
                    large
                    disabled={
                        saving ||
                        !firstName || 
                        !surname || 
                        !email ||  
                        !email.toLowerCase().match(EmailRegex) ||
                        !mobileNumber || 
                        !mobileNumber.match(MobileNumberRegex)
                    }
                    onClick={save}
                >{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        : null}
        
    </Container>
    </>
}

export default PersonalDetails
