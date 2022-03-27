import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
import Dropdown from '../../../../Components/Dropdown'
import Checkbox from '../../../../Components/Checkbox'
import RadioButton from '../../../../Components/RadioButton'
import Input from '../../../../Components/Input'
import FileUpload from '../../../../Components/FileUpload'
import RingLoader from '../../../../Components/Loader/Ring'
import Colours from '../../../../Config/Colours.js'
import CircleSVG from '../../../../Components/Circle'
import { API } from '../../../../Components/API'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Modal, Toast, Underline } from '../../../../Components'
import AvatarEditor from 'react-avatar-editor'
import toast from '../../../../Components/Toast'

const Container = styled.div`
    margin: 64px;

    & > h1 {
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
   
    & ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        & li {
            font-size: 18px;
            color: ${Colours.n500};
            line-height: 32px;
            & img {
                position: relative;
                height: 20px;
                width: 20px;
                top: 4px;
                left: -5.28px;
                margin-right: 8px;
            }
        }        
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

        & .profilepic {
            margin-left: 0 !important;
        }
    }

    @media screen and (max-width: 480px) {
        .acceptBtn {
            font-size: 16px;
            padding: 16px 18px;
        }

        & .profilepic {
            align-items: center;
        }

        & .fileinp {
            width: 220px;
            height: 220px;

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

const Warning = styled.span`
   color: ${Colours.r500};
`

/**
 * Tutor Registration - Profile
 * 
 * Collects profile picture, gender, summary & "about you" blurb.
 * 
 * Reads/writes the following from the localstorage variable "registration":
 *  - profileImgUrl
 *  - gender
 *  - gender
 *  - summary
 *  - aboutYou
 */
function Profile(props) {
    const [profilePicUrl, setProfilePicUrl] = useState(null)
    const [profilePicFilename, setProfilePicFilename] = useState("")
    const [summary, setSummary] = useState("")
    const [aboutYou, setAboutYou] = useState("")
    const [uploading, setUploading] = useState(false)
    const [profilePicFileRef, setProfilePicFileRef] = useState(null)
    const [profilePicCanonUrl, setProfilePicCanonUrl] = useState(null)
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)

    const [bannerPicUrl, setBannerPicUrl] = useState(null)
    const [bannerPicFilename, setBannerPicFilename] = useState("")
    const [bannerPicFileRef, setBannerPicFileRef] = useState(null)
    const [bannerPicCanonUrl, setBannerPicCanonUrl] = useState(null)

    const [agencyName, setAgencyName] = useState("")
    const [tagline, setTagline] = useState("")
    const [websiteUrl, setWebsiteUrl] = useState("")

    const [profilePicError, setProfilePicError] = useState(null) 
    const [bannerPicError, setBannerPicError] = useState(null) 
    const [summaryError, setSummaryError] = useState(null)
    const [aboutYouError, setAboutYouError] = useState(null)
    const [genderError, setGenderError] = useState(null)
    const [websiteUrlError, setWebsiteUrlError] = useState(null)

    const [userType, setUserType] = useState(null)

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        let reg = window.localStorage.getItem("registration")
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push("/register")
            return
        }

        if (reg.profileImgUrl) {
            setProfilePicCanonUrl(reg.profileImgUrl)
        }

        if (reg.gender && reg.gender == "male") {
            setMale(true)
            setFemale(false)
        } else if (reg.gender && reg.gender == "female") {
            setMale(false)
            setFemale(true)
        }

        setUserType(reg.userType)

        if (reg.bannerImgUrl) {
            setBannerPicCanonUrl(reg.bannerImgUrl)
        }
        if (reg.summary) { setSummary(reg.summary) }
        if (reg.aboutYou) { setAboutYou(reg.aboutYou) }
        if (reg.agencyTagline) { setTagline(reg.agencyTagline) }
        if (reg.agencyName) { setAgencyName(reg.agencyName)}
        if (reg.agencyWebsite) { setWebsiteUrl(reg.agencyWebsite) }
    }, [])

    const persist = async () => {
        let picUrl = ''
        if (profilePicUrl && profilePicUrl.startsWith('blob:')) {
            setUploading(true)
            const formdata = new FormData()
            formdata.append("file", new File([ await fetch(profilePicUrl).then(r => r.blob()) ], profilePicFilename))
            const response = await API.post("upload/public", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUploading(false)
            picUrl = response.data.url
        }

        let bannerUrl = ''
        if (bannerPicUrl && bannerPicUrl.startsWith('blob:')) {
            setUploading(true)
            const formdata = new FormData()
            formdata.append("file", new File([ await fetch(bannerPicUrl).then(r => r.blob()) ], bannerPicFilename))
            const response = await API.post("upload/public", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUploading(false)
            bannerUrl = response.data.url
        }


        const reg = JSON.parse(window.localStorage.getItem("registration"))
        if (picUrl) { reg.profileImgUrl = picUrl }
        if (bannerUrl) { reg.bannerImgUrl = bannerUrl }
        reg.summary = summary
        reg.aboutYou = aboutYou
        reg.gender = (male || female ?  (male ? 'male' : 'female') : null)
        reg.agencyName = agencyName
        reg.agencyWebsite = websiteUrl
        reg.agencyTagline = tagline 

        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const saveAndContinue = async event => {

        event.preventDefault()

        let hasErrors = false 
        if (websiteUrl) {
            try {
                const url = new URL(websiteUrl)
                if (url.protocol != "http:" && url.protocol != "https:") {
                    hasErrors = true
                    setWebsiteUrlError("Must be a valid URL")    
                }
            } catch (_) {
                hasErrors = true 
                setWebsiteUrlError("Must be a valid URL")
            }
        }

        if (!hasErrors) {
                  
            try {
                await persist()          
                const reg = JSON.parse(window.localStorage.getItem("registration"))

                const to = {
                    pathname: "/register-tutor-photos",
                    state: {
                        progress: {
                            ...location.state.progress,
                            current: 'photos',
                            complete: 6
                        }
                    }
                }

                if (
                    reg.profileImgUrl && 
                    reg.summary && reg.summary.length < 200 && 
                    reg.aboutYou && reg.aboutYou.length < 1200 && reg.aboutYou.length >= 50
                ) {
                    if (userType != 'agency') {
                        if (reg.gender) {
                            to.state.progress.steps = [...location.state.progress.steps, 'profile']
                        }
                    } else {
                        if (reg.agencyName && reg.agencyWebsite && reg.agencyTagline) {
                            to.state.progress.steps = [...location.state.progress.steps, 'profile']
                        }
                    }
                }

                history.push(to) 
                window.scrollTo(0, 0)
            } catch(e) {
                console.log('err', e)
                if (e && e.response && e.response.status == 413) {
                    Toast.error("Image filesize too large.")
                } else {
                    Toast.error("Failed to upload image. Please try again.")
                }
                
                setUploading(false)
            }
        } else {
            toast.error("Some fields have invalid values. Correct them and try again.")
        }
    }

    useEffect(() => websiteUrlError && setWebsiteUrlError(null), [websiteUrl])

    return (<>
        <Helmet>
            <title>Your profile - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    <CircleSVG colour={Colours.r050}>6</CircleSVG>
                    <Split className='mainsplit'>
                        <Column className='textcol' style={{flex: '8px', marginRight: '64px'}}>
                            <h2>Your Profile</h2>
                            <p style={{maxWidth: '375px'}}>Upload a profile photo that is professional looking.<br />Tell the clients about yourself. Try to cover: </p>
                            <ul>
                                <li>- your teaching experience;</li>
                                <li>- your teaching approach;</li>
                                <li>- your personality and tutoring style;</li>
                                <li>- your working and teaching preferences.</li>
                            </ul>
                        </Column>

                        <Column>
                            <Label style={{marginTop: '24px', marginBottom: '16px'}}>Upload your profile picture</Label>
                            <div className='profilepic' style={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', marginLeft: '128px'}}>
                                <FileUpload 
                                    circle 
                                    preview 
                                    className='fileinp'
                                    accept=".jpg,.jpeg,.png" 
                                    tagline="PNG or JPEG image, up to 10 mb" 
                                    maxSize={10}
                                    onImgSrcUpdate={src => setProfilePicUrl(src)}
                                    filenameChange={name => setProfilePicFilename(name)}
                                    error={!!profilePicError}
                                    onFileRefChange={node => setProfilePicFileRef(node)}
                                    canonImgSrc={profilePicCanonUrl}
                                />
                                {profilePicError ? <Error style={{margin: '-16px 0 16px 0'}}><img alt="error" src="/img/danger.webp" /> {profilePicError}</Error> : null}
                            </div>

                            {userType == 'agency' ? <>
                                <Label style={{marginTop: '24px', marginBottom: '16px'}}>Upload your banner picture</Label>
                                <div>
                                    <FileUpload 
                                        rectangle 
                                        preview 
                                        style={{minHeight: '102px'}}
                                        className='fileinp'
                                        accept=".jpg,.jpeg,.png" 
                                        tagline="PNG or JPEG image, up to 10 mb" 
                                        maxSize={10}
                                        onImgSrcUpdate={src => setBannerPicUrl(src)}
                                        error={!!bannerPicError}
                                        onFileRefChange={node => setBannerPicFileRef(node)}
                                        canonImgSrc={bannerPicCanonUrl}
                                        filenameChange={name => setBannerPicFilename(name)}
                                    />
                                    {bannerPicError ? <Error style={{margin: '-16px 0 16px 0'}}><img alt="error" src="/img/danger.webp" /> {bannerPicError}</Error> : null}
                                </div>

                                <Input 
                                    label="Agency name"
                                    placeholder="Your company name"
                                    value={agencyName}
                                    onChange={e => setAgencyName(e.target.value)}    
                                ></Input>

                                <Input 
                                    label="Agency tagline"
                                    placeholder="A short phrase (optional)"
                                    value={tagline}
                                    onChange={e => setTagline(e.target.value)}
                                ></Input>

                                <Input 
                                    label="Website URL"
                                    placeholder="Website address (optional)"
                                    value={websiteUrl}
                                    onChange={e => setWebsiteUrl(e.target.value)}
                                    error={websiteUrlError}
                                ></Input>

                                
                            </> : null}
                            

                            {userType != "agency" ? 
                                <div style={{display: 'flex', flexDirection: 'column', marginBottom: '16px'}}>
                                    <Label>Gender</Label>
                                    <div style={{display: 'flex'}}>
                                        <Checkbox style={{marginRight: '16px'}} label="Male" value={male} setter={value => { setMale(value); setFemale(false);} } />
                                        <Checkbox label="Female" value={female} setter={value => {setFemale(value); setMale(false); } } />
                                    </div>
                                    {genderError ? <Error style={{margin: '8px 0 0px 0'}}><img alt="error" src="/img/danger.webp" /> {genderError}</Error> : null}
                                </div>
                            : null}

                           <Input 
                                text 
                                noresize
                                label="Summary"
                                placeholder="Write a welcome message or short introduction or summary to greet your clients! Your introduction must contain at least 50 characters."
                                value={summary}
                                style={{height: '176px'}}
                                onChange={e => { e.target.value.length <= 200 && setSummary(e.target.value) }}
                                error={!!summaryError}
                            />
                            {summaryError ? <Error><img alt="error" src="/img/danger.webp" /> {summaryError}</Error> : null}
                            <Counter style={{marginBottom: '16px', color: summary.length == 200 ? Colours.r500 : Colours.b500}}>{200 - summary.length} characters left {summary.length > 0 && summary.length < 50 ? <> / <Warning>50 characters minimum</Warning></> : ''}</Counter>

                            <Input 
                                text
                                noresize
                                label={userType == "agency" ? "Further information" : "About you"}
                                placeholder={userType == "agency" ? "Write a description about your agency, background, and what you offer. Your description must contain at least 50 characters." : "Write a description about you, your background, and what you offer. Your description must contain at least 50 characters."}
                                value={aboutYou}
                                style={{height: '430px'}}
                                onChange={e => { e.target.value.length <= 1200 && setAboutYou(e.target.value) }}
                                error={!!aboutYouError}
                            />
                            {aboutYouError ? <Error><img alt="error" src="/img/danger.webp" /> {aboutYouError}</Error> : null}
                            <Counter style={{color: aboutYou.length == 1200 ? Colours.r500 : Colours.b500}}>{1200 - aboutYou.length} characters left {aboutYou.length > 0 && aboutYou.length < 50 ? <> / <Warning>50 characters minimum</Warning></> : ''}</Counter>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>  
                            <Link black to={{
                                pathname: "/register-tutor-qualifications",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'qualifications',
                                        complete: 4
                                    }
                                }
                            }}
                            onClick={e => {persist(); window.scrollTo(0, 0);}} style={{display: 'flex'}}>
                                {uploading ? <RingLoader small colour={Colours.b500} /> : <><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back</>}
                            </Link>
                        </div>

                        <div>
                            <Link black style={{marginRight: '24px'}} onClick={saveAndContinue}>{uploading ? <RingLoader small /> : 'Save as draft'}</Link>
                            <Link className='acceptBtn' primary btn onClick={saveAndContinue}>{uploading ? <RingLoader small /> : 'SAVE AND CONTINUE'}</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default Profile
