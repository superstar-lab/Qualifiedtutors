import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/StudentProgress'
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
import { Table, Head, Heading, Body, Row, Col } from '../../../../Components/Table'

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

function StudentProfile(props) {
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

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        let reg = JSON.parse(window.localStorage.getItem('registration'))
        if (!reg) { reg = {student: {}}}
        if (!reg.student) { reg.student = {} }

        if (reg.student.profileImgUrl) {
            setProfilePicCanonUrl(reg.student.profileImgUrl)
        }

        if (reg.student.gender && reg.student.gender == "male") {
            setMale(true)
            setFemale(false)
        } else if (reg.student.gender && reg.student.gender == "female") {
            setMale(false)
            setFemale(true)
        }
    }, [])

    const persist = async () => {
        let picUrl = ''
        if (profilePicUrl && profilePicUrl.startsWith('blob:')) {
            setUploading(true)
            const formdata = new FormData()
            formdata.append("file", profilePicFileRef.files[0])
            const response = await API.post("upload/public", formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUploading(false)
            picUrl = response.data.url
        }

        let reg = JSON.parse(window.localStorage.getItem('registration'))
        if (!reg) { reg = {student: {}}}
        if (!reg.student) { reg.student = {} }
        
        if (picUrl) { reg.student.profileImgUrl = picUrl }
        reg.student.gender = male ? 'male' : 'female'

        window.localStorage.setItem("registration", JSON.stringify(reg))
    }

    const saveAndContinue = async event => {

        let hasErrors = false

        /*
        if (!profilePicUrl) {
            hasErrors = true
            setProfilePicError("Profile picture is required")
        } else { setProfilePicError(null) }
    
        if (!male && !female) {
            hasErrors = true 
            setGenderError("Gender is required")
        }
        */

        event.preventDefault()

        if (hasErrors) {
            event.preventDefault()
        } else {
            try {
                await persist()
                history.push({
                    pathname: "/register-student-finalize",
                    state: {
                        progress: {
                            ...location.state.progress,
                            steps: [...location.state.progress.steps, 'profile'],
                            current: 'finalize',
                            complete: 3
                        }
                    }
                }) 
            } catch(e) {
                // deal with network failures
            }

        }
    }

    return (<>
        <Helmet>
            <title>Profile - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                 <h1>Sign up. <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    <CircleSVG colour={Colours.r050}>3</CircleSVG>
                    <Split className='mainsplit'>
                        <Column className='textcol' style={{flex: '8px', marginRight: '64px'}}>
                            <h2>Your Profile (optional)</h2>
                            <p style={{maxWidth: '375px'}}>Upload a profile photo that is professional looking.</p>
    
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
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between'}}>
                        <div>  
                            <Link to={{
                                pathname: "/register-tutor-qualifications",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'qualifications',
                                        complete: 4
                                    }
                                }
                            }}
                            onClick={persist} style={{display: 'flex', paddingTop: '16px'}}>
                                {uploading ? <RingLoader small colour={Colours.b500} /> : <><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '1.6px'}} src="/img/back-icon.svg" />&nbsp; Back</>}
                            </Link>
                        </div>

                        <div>
                            <Link className='acceptBtn' primary btn  to={{
                                pathname: "/register-tutor-photos",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        steps: [...location.state.progress.steps, 'profile'],
                                        current: 'photos',
                                        complete: 6
                                    }
                                }
                            }} onClick={saveAndContinue}>{uploading ? <RingLoader small /> : 'SAVE AND CONTINUE'}</Link>
                        </div>
                    </Split>
                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default StudentProfile
