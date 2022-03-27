import styled from 'styled-components'
import {Helmet} from "react-helmet"
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {v4 as uuid} from 'uuid'

import {
    FixedWidth,
    Card,
    Link,
    Input,
    FileMultiUpload,
    RingLoader,
    Circle as CircleSVG,
    API,
    Underline,
    AgencyBios
} from '../../../../Components'
import Progress from '../Components/Progress'
import Colours from '../../../../Config/Colours.js'
import { YoutubeEmbedFormatRegex } from '../../../../Config/Validation'

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

    @media screen and (max-width: 1150px) {
        & .mainsplit {
            flex-direction: column;
        
            & .textcol {
                max-width: unset !important;
                margin-right: unset !important;

                & > p {
                    max-width: unset !important;
                }
            }

            & .contentcol {
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
    }

    @media screen and (max-width: 480px) {
        .acceptBtn {
            font-size: 16px;
            padding: 16px 18px;
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

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`


function Photos(props) {
    const [photos, setPhotos] = useState([])
    const [videoUrl, setVideoUrl] = useState("")
    const [videoUrlError, setVideoUrlError] = useState("")
    const [uploading, setUploading] = useState(false)
    const [fileRef, setFileRef] = useState(null)
    const [filePreviews, setFilePreviews] = useState([])
    const [profilePics, setProfilePics] = useState([])

    const [userType, setUserType] = useState()
    const [bios, setBios] = useState([{
        name: "",
        blurb: "",
        imageUrl: ""
    }])

    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        let reg = window.localStorage.getItem('registration')
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push('/register')
            return
        }
       
        if (reg.profilePics) {
            setProfilePics(reg.profilePics)
        }

        if (reg.agencyBios) {
            setBios(reg.agencyBios)
        }

        setUserType(reg.userType)
    }, [])

    useEffect(() => {
        const match = videoUrl.match(YoutubeEmbedFormatRegex)
        if (match && match.length > 0) {
            setVideoUrlError("")
            if (videoUrl != match[0]) {
                setVideoUrl(match[0])
            }
        } else {
            if (videoUrl != "") {
                setVideoUrlError("Video link must be in Youtube embed format")
            } else {
                setVideoUrlError("")
            }
        }
    }, [videoUrl])

    const persist = async () => {
        const files = [...filePreviews]
        const b = bios.map(bio => ({...bio}))

        setUploading(true)

        for(let i = 0; i < files.length; i++) {
            const file = files[i]
            if (!file.uploaded) {
                const formdata = new FormData()
                
                let f = new File([ await fetch(file.url).then(r => r.blob()) ], file.name)

                if (f) {
                    formdata.append("file", f)
                    const response = await API.post("upload/public", formdata, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    file.url = response.data.url
                    file.uploaded = true
                    files[i] = file
                }
            }
        }

        for (let i = 0; i < b.length; i++) {
            const bio = b[i]
            if (bio && bio.imageUrl && bio.imageUrl.startsWith('blob:')) {
                const formdata = new FormData()
                formdata.append("file", new File([ await fetch(bio.imageUrl).then(r => r.blob()) ], uuid()))
                const response = await API.post("upload/public", formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                bio.imageUrl = response.data.url
                b[i] = bio
            }
        }

        setUploading(false)
        setFilePreviews(files)
        setBios(b)

        const reg = JSON.parse(window.localStorage.getItem('registration'))
        reg.profilePics = files
        reg.videoUrl = videoUrl
        reg.agencyBios = b

        window.localStorage.setItem('registration', JSON.stringify(reg))
    }

    const back = async event => {
        event.preventDefault()
        await persist()
        history.push({
            pathname: "/register-tutor-profile",
            state: {
                progress: {
                    ...location.state.progress,
                    current: 'profile',
                    complete: 5
                }
            }
        })
        window.scrollTo(0, 0)
    }

    const saveAndContinue = async event => {
        event.preventDefault()
        await persist()

        const steps = [...location.state.progress.steps]
        if (userType == 'agency') {
            if (bios.length > 0) {
                steps.push('photos')
            }
        } else {
            steps.push('photos')
        }

        history.push({
            pathname: userType == 'agency' ? "/register-tutor-finalize" : "/register-tutor-documents",
            state: {
                progress: {
                    ...location.state.progress,
                    steps: [...location.state.progress.steps],
                    current: 'verification',
                    complete: 7
                }
            }
        })
        window.scrollTo(0, 0)
    }

    return (<>
        <Helmet>
            <title>Photos &amp; video - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    <CircleSVG colour={Colours.b050}>7</CircleSVG>
                    
                    {userType == 'agency' ? 
                        <Split className='mainsplit' style={{marginBottom: '32px', borderBottom: '1px solid #e0e0e0', paddingBottom: '86px'}}>
                            <Column className='textcol' style={{flex: '8px', marginRight: '64px'}}>
                                <h2>Agency Bios</h2>
                                <p style={{maxWidth: '375px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </Column>

                            <Column className='contentcol' style={{marginTop: '80px'}}>
                                <AgencyBios bios={bios} setBios={setBios} />
                            </Column>
                        </Split>
                    : null}

                    <Split className='mainsplit'>
                        <Column className='textcol' style={{flex: '8px', marginRight: '64px'}}>
                            <h2>Photos &amp; Video (optional)</h2>
                            <p style={{maxWidth: '375px'}}>Upload a few photos that show you tutoring and/or paste in a link to a video platform of you introducing yourself.</p>
                        </Column>

                        <Column className='contentcol' style={{marginTop: '80px'}}>
                            <Label style={{marginTop: '24px', marginBottom: '16px'}}>Upload photos</Label>
                            <FileMultiUpload 
                                preview
                                accept=".jpg,.jpeg,.png"
                                tagline="Up to 3 PNG or JPG images, up to 10 MB each"
                                maxSize={10}
                                maxFiles={3}
                                onFileRefChange={ref => setFileRef(ref)}
                                onPreviewChange={previews => setFilePreviews(previews)}
                                existingFiles={profilePics}
                            />

                            <Input label="Paste in video link" onChange={e => setVideoUrl(e.target.value)} error={videoUrlError} /> 
                            <p style={{marginTop: '-8px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </Column>
                    </Split>

                    <Split style={{marginTop: '64px', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>  
                            <Link black to={{
                                pathname: "/register-tutor-profile",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'profile',
                                        complete: 5
                                    }
                                }
                            }}
                            onClick={back} style={{display: 'flex'}}>
                                {uploading ? <RingLoader small colour={Colours.b500} /> : <><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '2px'}} src="/img/back-icon.svg" />&nbsp; Back</>}
                            </Link>
                        </div>

                        <div>
                            <Link black style={{marginRight: '24px'}} to={{
                                pathname: "/register-tutor-documents",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'verification',
                                        complete: 7
                                    }
                                }
                            }} onClick={saveAndContinue}>{uploading ? <RingLoader small /> : 'Save as draft'}</Link>

                            <Link className='acceptBtn' primary btn to={{
                                pathname: "/register-tutor-documents",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'verification',
                                        complete: 7
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

export default Photos
