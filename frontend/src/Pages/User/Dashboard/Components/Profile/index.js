import styled from 'styled-components'
import Colours from '../../../../../Config/Colours'
import { Checkbox, FileUpload, Input, RingLoader, Button, Toast, API } from '../../../../../Components'
import { useState, useEffect } from 'react'
import useWindowSize from '../../../../../Hooks/UseWindowSize'
import {Helmet} from 'react-helmet'

const Container = styled.div`

`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: 24px;
    margin-bottom: -20px;

    & img {
        position: relative;
        width: 12.8px;
    }
`

const Counter = styled.div`
   padding: 24px 0 16px 0;
   color: ${Colours.b500};

   & img {
        position: relative;
        top: 3.2px;
   }
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`

const Row = styled.div`
   display: flex;
   justify-content: space-between;
`

function Profile(props) {

    const [profilePicUrl, setProfilePicUrl] = useState(null)
    const [summary, setSummary] = useState("")
    const [aboutYou, setAboutYou] = useState("")
    const [uploading, setUploading] = useState(false)
    const [profilePicFileRef, setProfilePicFileRef] = useState(null)
    const [profilePicCanonUrl, setProfilePicCanonUrl] = useState(null)
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)

    const [profilePicError, setProfilePicError] = useState(null) // used only for req. error
    const [summaryError, setSummaryError] = useState(null)
    const [aboutYouError, setAboutYouError] = useState(null)
    const [genderError, setGenderError] = useState(null)

    const [saving, setSaving] = useState(false)

    const windowSize = useWindowSize()

    const save = async event => {
        setSaving(true)
        
        let picUrl = profilePicUrl
        if (profilePicUrl.startsWith('blob:')) {
            const formdata = new FormData()
            formdata.append("file", profilePicFileRef.files[0])
            
            try {
                const response = await API.post("upload/public", formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                picUrl = response.data.url
            } catch (error) {
                Toast.error("Unexpected error while uploading profile picture. Please try again.")
                setSaving(false)
                return
            }            
        }

        try {
            const response = await API.post('tutor/profile/profile', {
                profile_image: picUrl,
                profile_summary: summary,
                profile_about_you: aboutYou,
                gender: male ? 'male' : 'female'
            })

            if (response && response.data && response.data.success) {
                props.setUser({
                    ...props.user,
                    profile_image: response.data.user.profile_image,
                    profile_summary: response.data.user.profile_summary,
                    profile_about_you: response.data.user.profile_about_you,
                    gender: response.data.user.gender
                })
                Toast.success("Successfully updated your profile.")
            }
        } catch(error) {
            Toast.error("Unexpected error while updating your profile, please try again.")
        }

        setSaving(false)
    }

    useEffect(() => {
        if (props.user) {
            setMale(false)
            setFemale(false)
            if (props.user.profile_image) { setProfilePicCanonUrl(props.user.profile_image) }
            if (props.user.gender) { props.user.gender == 'male' ? setMale(true) : setFemale(true) }
            if (props.user.profile_summary) { setSummary(props.user.profile_summary) }
            if (props.user.profile_about_you) { setAboutYou(props.user.profile_about_you) }
        }

    }, [props.user])

    return <>
        <Helmet>
            <title>Profile - Qualified Tutors</title>
        </Helmet>

        <Container>
            
            <Label style={{marginTop: '24px', marginBottom: '16px'}}>Upload your profile picture</Label>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: windowSize.width > 640 ? '128px' : (windowSize.width < 360 ? '-32px' : '0')}}>
                    <FileUpload 
                    circle 
                    preview 
                    accept=".jpg,.jpeg,.png" 
                    tagline="PNG or JPEG image, up to 10 mb" 
                    maxSize={10}
                    onImgSrcUpdate={src => setProfilePicUrl(src)}
                    error={!!profilePicError}
                    onFileRefChange={node => setProfilePicFileRef(node)}
                    canonImgSrc={profilePicCanonUrl}
                    />
                {profilePicError ? <Error style={{margin: '-16px 0 16px 0'}}><img alt="error" src="/img/danger.webp" /> {profilePicError}</Error> : null}
                </div>

                <div style={{display: 'flex', flexDirection: 'column', marginBottom: '16px'}}>
                    <Label>Gender</Label>
                    <div style={{display: 'flex'}}>
                        <Checkbox style={{marginRight: '16px'}} label="Male" value={male} setter={value => { setMale(value); setFemale(false);} } />
                        <Checkbox label="Female" value={female} setter={value => {setFemale(value); setMale(false); } } />
                    </div>
                    {genderError ? <Error style={{margin: '8px 0 0px 0'}}><img alt="error" src="/img/danger.webp" /> {genderError}</Error> : null}
                </div>

                <Input 
                    text 
                    noresize
                    label="Summary"
                    placeholder="Write a welcome message or short introduction or summary to greet your clients!"
                    value={summary}
                    style={{height: '176px'}}
                    onChange={e => { e.target.value.length <= 200 && setSummary(e.target.value) }}
                    error={!!summaryError}
                />
                {summaryError ? <Error><img alt="error" src="/img/danger.webp" /> {summaryError}</Error> : null}
                <Counter style={{marginBottom: '16px'}}>{200 - summary.length} characters left</Counter>

                <Input 
                    text
                    noresize
                    label="About you"
                    placeholder="Write a description about you, your background, and what you offer."
                    value={aboutYou}
                    style={{height: '430px'}}
                    onChange={e => { e.target.value.length <= 1200 && setAboutYou(e.target.value) }}
                    error={!!aboutYouError}
                />
                {aboutYouError ? <Error><img alt="error" src="/img/danger.webp" /> {aboutYouError}</Error> : null}
                <Counter>{1200 - aboutYou.length} characters left</Counter>

                <Row style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300}}>
                    <div></div>
                    <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
                </Row>
        </Container>
    </>
} 

export default Profile