import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
import Dropdown from '../../../../Components/Dropdown'
import Checkbox from '../../../../Components/Checkbox'
import Input from '../../../../Components/Input'
import { API } from '../../../../Components/API'
import FileMultiUpload from '../../../../Components/FileMultiUpload'
import RingLoader from '../../../../Components/Loader/Ring'
import Colours from '../../../../Config/Colours.js'
import CircleSVG from '../../../../Components/Circle'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import zIndex from '../../../../Config/zIndex'
import { Button, Underline } from '../../../../Components'
import toast from '../../../../Components/Toast'

const Container = styled.div`
    margin: 64px;
    color: ${Colours.n500};

    & > h1 {
        color: ${Colours.n200};
        font-size: 48px;
        margin-bottom: 80px;
        white-space: nowrap;
        display: flex;
    }

    & h2, & p {
        position: relative;
    }

    & p, & ul li {
        font-size: 18px;
        line-height: 32px;
        color: ${Colours.n500};
    }

    & ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        & li {
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

    & .circleSVG {
        position: absolute;
        top: 32px;
        right: 32px;
    }

    #qtsPopoverContainer {
        position: relative;

        & #qtsPopover {
            display: none;
            position: absolute;
            top: -112px;
            z-index: ${zIndex.top};
            padding: 24px;
            transform: translateX(-30px);
            background: white;
            border: 1px solid ${Colours.n300};
            border-radius: 4px;
            box-shadow: 0 0 1px rgba(48, 48, 51, 0.05), 0 4px 8px rgba(48, 48, 51, 0.1);
            transition: background .25s;

            & > p {
                margin: 0 0 8px 0;
                font-size: 16px;
                color: ${Colours.n500};
                font-weight: normal;
            }

            &:after {
                content: "";
                display: block;
                position: absolute;
                bottom: -10px;
                right: 50%;
                transform: translateX(-50%);

                width: 16px; 
                height: 16px;
                background: white;
                border-bottom: 1px solid #e0e0e0;
                transform: rotate(45deg);
                border-right: 1px solid #e0e0e0;
            }

            @media screen and (max-width: 605px) {
                top: -110px;
                left: -55px;
            }

            @media screen and (max-width: 550px) {
                top: -128px;
            }
        }

        & #qtsPopover:hover {
            display: block;
        }

        & #qtsPopover[data-visible="true"] {
            display: block;
        }
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

        #qts-link {
            font-size: 14px;
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
    margin-top: -24px;

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
    line-height: 2rem;
    white-space: nowrap;
`

function Documents(props) {
  
    const [verificationDocs, setVerificationDocs] = useState([])
    const [verificationDocsRef, setVerificationDocsRef] = useState(null)
    const [verificationDocsPreviews, setVerificationDocsPreviews] = useState([])
    const [existingVerificationDocs, setExistingVerificationDocs] = useState([])

    const [qualificationDocs, setQualificationDocs] = useState([])
    const [qualificationDocsRef, setQualificationsDocsRef] = useState(null)
    const [qualificationDocsPreviews, setQualificationsDocsPreviews] = useState([])
    const [existingQualificationDocs, setExistingQualificationDocs] = useState([])

    const [qualificationProofDocsRef, setQualificationsProofDocsRef] = useState(null)
    const [qualificationProofDocsPreviews, setQualificationsProofDocsPreviews] = useState([])
    const [existingQualificationProofDocs, setExistingQualificationProofDocs] = useState([])

    const [otherDocs, setOtherDocs] = useState([])
    const [otherDocsRef, setOtherDocsRef] = useState(null)
    const [otherDocsPreviews, setOtherDocsPreviews] = useState([])
    const [existingOtherDocs, setExistingOtherDocs] = useState([])

    const [uploading, setUploading] = useState(false)
    const [degree, setDegree] = useState(false)
    const [dbs, setDbs] = useState(false) 
    const [enhancedDbs, setEnhancedDbs] = useState(false)
    const [examiner, setExaminer] = useState(false)
    const [aqa, setAqa] = useState(false)
    const [ccfa, setCcfa] = useState(false)
    const [ocr, setOcr] = useState(false)
    const [edexcel, setEdexcel] = useState(false)
    const [wjec, setWjec] = useState(false)

    const [verificationDocsError, setVerificationDocsError] = useState("")
    const [qualificationDocsError, setQualificationDocsError] = useState("")
    const [qualificationDocsProofError, setQualificationDocsProofError] = useState("")
    const [otherDocsError, setOtherDocsError] = useState("")

    const [userType, setUserType] = useState(null)
    const [yearsExp, setYearsExp] = useState(null)

    const [areYouTeacher, setAreYouTeacher] = useState(null)

    const qtsPopoverRef = useRef()
    const qtsPopoverTriggerRef = useRef()

    const location = useLocation()
    const history = useHistory()

    const findFileInFileList = (filename, list) => {
        let f = null 
        for (let x = 0; x < list.length; x++) {
            if (list[x].name == filename) {
                f = list[x]
            }
        }

        return f
    }
        
    const persist = async () => {
        const verificationPreviews = [...verificationDocsPreviews]
        const qualificationPreviews = [...qualificationDocsPreviews]
        const qualificationProofPreviews = [...qualificationProofDocsPreviews]
        const otherPreviews = [...otherDocsPreviews]

        setUploading(true)

        try {
            for(let i = 0; i < verificationPreviews.length; i++) {
                const file = verificationPreviews[i]
                if (!file.uploaded) {
                    const formdata = new FormData()

                    const f = findFileInFileList(file.name, verificationDocsRef.files)
                    if (f) {
                        formdata.append("file", f)
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        verificationPreviews[i] = file
                    }
                }
            }

            for(let i = 0; i < qualificationPreviews.length; i++) {
                const file = qualificationPreviews[i]
                if (!file.uploaded) {
                    const formdata = new FormData()

                    const f = findFileInFileList(file.name, qualificationDocsRef.files)
                    if (f) {
                        formdata.append("file", f)
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        qualificationPreviews[i] = file
                    }
                }
            }

            for(let i = 0; i < otherPreviews.length; i++) {
                const file = otherPreviews[i]
                if (!file.uploaded) {
                    const formdata = new FormData()

                    const f = findFileInFileList(file.name, otherDocsRef.files)
                    if (f) {
                        formdata.append("file", f)
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        otherPreviews[i] = file
                    }
                }
            }

            for(let i = 0; i < qualificationProofPreviews.length; i++) {
                const file = qualificationPreviews[i]
                if (!file.uploaded) {
                    const formdata = new FormData()

                    const f = findFileInFileList(file.name, qualificationProofDocsRef.files)
                    if (f) {
                        formdata.append("file", f)
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        qualificationProofPreviews[i] = file
                    }
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("Unexpected error uploading files, please try again.")
        }

        setUploading(false)

        setVerificationDocsPreviews(verificationPreviews)
        setQualificationsDocsPreviews(qualificationPreviews)
        setQualificationsProofDocsPreviews(qualificationProofPreviews)
        setOtherDocsPreviews(otherPreviews)

        const reg = JSON.parse(window.localStorage.getItem('registration'))
        reg.verificationDocs = verificationPreviews 
        reg.qualificationDocs = qualificationPreviews 
        reg.otherDocs = otherPreviews 
        reg.qualificationProofDocs = qualificationProofPreviews
        reg.degree = degree 
        //reg.dbs = dbs 
        reg.enhancedDbs = enhancedDbs 
        reg.examiner = examiner 
        reg.aqa = aqa 
        reg.ccfa = ccfa 
        reg.ocr = ocr 
        reg.edexcel = edexcel 
        reg.wjec = wjec 
        reg.yearsOfExp = yearsExp
        reg.areYouTeacher = areYouTeacher

        window.localStorage.setItem('registration', JSON.stringify(reg))
    }

    const back = async event => {
        event.preventDefault()
        await persist()
        history.push({
            pathname: "/register-tutor-photos",
            state: {
                progress: {
                    ...location.state.progress,
                    current: 'photos',
                    complete: 6
                }
            }

        })
        window.scrollTo(0, 0)
    }

    const saveAndContinue = async event => {
        event.preventDefault()
        await persist()

        const steps = [...location.state.progress.steps]
        
        if (
            verificationDocsPreviews.length > 0 &&
            qualificationDocsPreviews.length > 0
        ) {
            if (userType == 'tutor') {
                if (qualificationProofDocsPreviews.length > 0 && yearsExp && yearsExp > 0) {
                    steps.push('verification')
                }
            } else {
                steps.push('verification')
            }
        }

        history.push({
            pathname: userType == 'agency' ? "/register-tutor-finalize" : "/register-tutor-availability",
            state: {
                progress: {
                    ...location.state.progress,
                    steps,
                    current: 'availability',
                    complete: 8
                }
            }
        })
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        let reg = window.localStorage.getItem('registration')
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push('/register')
            return
        }

        if (reg.verificationDocs) {
            setExistingVerificationDocs(reg.verificationDocs)
            
        }

        if (reg.qualificationDocs) {
            setExistingQualificationDocs(reg.qualificationDocs)
        }

        if (reg.qualificationProofDocs) {
            setExistingQualificationProofDocs(reg.qualificationProofDocs)
        }

        if (reg.otherDocs) {
            setExistingOtherDocs(reg.otherDocs)
        }

        reg.degree && setDegree(reg.degree)
        reg.dbs && setDbs(reg.dbs) 
        reg.enhancedDbs && setEnhancedDbs(reg.enhancedDbs)
        reg.examiner && setExaminer(reg.examiner)
        reg.aqa && setAqa(reg.aqa) 
        reg.ccfa && setCcfa(reg.ccfa) 
        reg.ocr && setOcr(reg.ocr) 
        reg.edexcel && setEdexcel(reg.edexcel)
        reg.wjec && setWjec(reg.wjec)
        reg.yearsOfExp && setYearsExp(reg.yearsOfExp)
        reg.areYouTeacher && setAreYouTeacher(reg.areYouTeacher)

        setUserType(reg.userType)
    }, [])

    useEffect(() => {
        
        const onMouseEnter = event => {
            qtsPopoverRef.current.dataset.visible = "true"
        }

        const onMouseLeave = event => {
            qtsPopoverRef.current.dataset.visible = "false"
        }

        if (qtsPopoverTriggerRef.current && qtsPopoverRef.current) {
            qtsPopoverTriggerRef.current.addEventListener("mouseenter", onMouseEnter)
            qtsPopoverTriggerRef.current.addEventListener("mouseleave", onMouseLeave)
        }

        return () => {
            qtsPopoverTriggerRef.current && qtsPopoverTriggerRef.current.removeEventListener("mouseenter", onMouseEnter)
            qtsPopoverTriggerRef.current && qtsPopoverTriggerRef.current.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [qtsPopoverTriggerRef.current, qtsPopoverRef.current])

    return (<>
        <Helmet>
            <title>Teaching documents - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container onClick={e => {
                const node = document.getElementById('qtsPopover')
                node.dataset.visible = "false"
            }}>
                <h1><span>Si<Underline offset="-16px">gn up.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    <CircleSVG colour={Colours.t050}>8</CircleSVG>
                    <Split className='mainsplit'>
                         <Column style={{flex: '8px', marginRight: '64px'}}>
                            <h2>Verification Documents</h2>
                            <p style={{maxWidth: '375px'}}>Please upload documents that verify your identity and your teaching qualification. Your profile won’t go live on the platform until we have reviewed the documents.</p>
                        </Column>
                        
                        <Column></Column>
                    </Split>

                    <Split  className='mainsplit'>
                        <Column style={{flex: '8px', marginRight: '64px', marginBottom: '16px'}}>
                            <p style={{fontWeight: 'bold'}}>Identity</p>
                            <p>We will need either:</p>
                            <ul>
                                <li>&nbsp;- Birth certificate</li>
                                <li>&nbsp;- Passport</li>
                                <li>&nbsp;- UK Driving License</li>
                            </ul>
                        </Column>

                        <Column>
                           <FileMultiUpload 
                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                tagline="PNG, JPG, PDF, or DOC up to 10 MB each"
                                maxSize={10}
                                maxFiles={3}
                                onFileRefChange={ref => setVerificationDocsRef(ref)}
                                onPreviewChange={previews => setVerificationDocsPreviews(previews)}
                                existingFiles={existingVerificationDocs}
                                private
                            />
                            {verificationDocsError ? <Error><img alt="error" src="/img/danger.webp" />&nbsp; {verificationDocsError}</Error> : null}
                        </Column>
                    </Split>

                    <Split  className='mainsplit' style={{borderTop: '1px solid #e0e0e0', marginTop: '16px', paddingTop: '32px'}} >
                        <Column>
                            <div id="qtsPopoverContainer" style={{fontWeight: 'bold', marginTop: 0}} onClick={e => {
                                    e.stopPropagation()
                                    const node = document.getElementById('qtsPopover')
                                    node.dataset.visible = node.dataset.visible == "true" ? "false" : "true"
                                }}>
                                <span style={{fontSize: '18px'}}>Teaching qualification </span>
                                <img alt="alert" id="qtsPopoverTrigger" src="/img/alert_18.webp" style={{position: 'relative', left: '8px', top: '3px', width: '18px', height: '18px'}} ref={qtsPopoverTriggerRef}  />
                                <div id="qtsPopover" data-visible="false" ref={qtsPopoverRef}>
                                    <p>To get hold of your QTS certificate, visit</p>
                                    <Link primary to={{pathname: 'https://www.gov.uk/guidance/teacher-self-service-portal'}} target="_blank">https://www.gov.uk/guidance/teacher-self-service-portal</Link>
                                </div>
                            </div>

                            <p style={{marginBottom: '8px'}}>Do you have a teaching qualification (e.g. QTS)?</p>
                            <Split style={{gap: '16px', marginBottom: '16px'}}>
                                <Button outline={areYouTeacher !== true} primary={areYouTeacher === true} onClick={e => setAreYouTeacher(true)}>Yes</Button>
                                <Button outline={areYouTeacher !== false} primary={areYouTeacher === false} style={{minWidth: '61px'}} onClick={e => setAreYouTeacher(false)}>No</Button>
                            </Split>

                            {areYouTeacher === true ? <>
                                <p style={{margin: 0}}>Please upload your teaching certificate</p>
                                {/* 
                                    <p style={{maxWidth: '375px', marginBottom: '4px'}}>Qualified Teacher Status allows you to teach in UK education system. To get hold of your QTS certificate, visit</p>
                                    <Link primary target="_blank" id="qts-link" href="https://www.gov.uk/guidance/teacher-self-service-portal">https://www.gov.uk/guidance/teacher-self-service-portal</Link>
                                */}
                                 <p style={{maxWidth: '540px'}}><b>Note:</b> If you can't hold of your teaching certificate, upload two of the following documents instead:</p>
                                <ul>
                                    <li>&nbsp;- Payslip</li>
                                    <li>&nbsp;- Document/Email showing your school/educational email address</li>
                                    <li>&nbsp;- Document showing employers reference</li>
                                </ul>

                            </> : areYouTeacher === false ? <>
                                <p style={{fontWeight: 'bold', marginBottom: '0'}}>University Degree</p>
                                <p style={{maxWidth: '375px', marginBottom: '4px'}}>You must at least have a university degree to be able to have a profile displayed with Qualified Teachers.</p>
                            </> : null}
                        </Column>

                        <Column style={{marginTop: '16px'}}>
                            {areYouTeacher === true || areYouTeacher === false ? 
                                <>
                                    <FileMultiUpload 
                                        accept=".png,.jpeg,.jpg,.pdf,.doc,.docx"
                                        tagline="PNG, JPG, PDF, or DOC up to 10 MB each"
                                        maxFiles={3}
                                        onFileRefChange={ref => setQualificationsDocsRef(ref)}
                                        onPreviewChange={previews => setQualificationsDocsPreviews(previews)}
                                        existingFiles={existingQualificationDocs}
                                        private
                                    />
                                    {qualificationDocsError ? <Error><img alt="error" src="/img/danger.webp" />&nbsp; {qualificationDocsError}</Error> : null}
                                </>
                            : null}
                            
                        </Column>
                    </Split>
                   
                    {userType == 'tutor' ? <>
                        <Split  className='mainsplit' style={{borderTop: '1px solid #e0e0e0', marginTop: '64px', paddingTop: '64px'}}>
                            <Column>
                                <p style={{fontWeight: 'bold', marginBottom: '0'}}>Proof of qualification</p> 
                                <p style={{marginTop: '0', maxWidth: '375px'}}>Lorem ipsum dolar sit amet.</p>

                                <p style={{marginBottom: '0'}}>Lorem ipsum dolar:</p>
                                <ul>
                                    <li><img alt="checkmark" src="/img/check.webp" /> Sit</li>
                                    <li><img alt="checkmark" src="/img/check.webp" /> Amet</li>
                                </ul>
                            </Column>

                            <Column style={{marginTop: '24px'}}>
                                <FileMultiUpload 
                                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                    tagline="PNG, JPG, PDF, or DOC up to 10 MB each"
                                    onFileRefChange={ref => setQualificationsProofDocsRef(ref)}
                                    onPreviewChange={previews => setQualificationsProofDocsPreviews(previews)}
                                    existingFiles={existingQualificationProofDocs}
                                    maxFiles={10}
                                    private
                                />
                            </Column>
                        </Split>

                        <Split  className='mainsplit' style={{borderTop: '1px solid #e0e0e0', marginTop: '64px', paddingTop: '64px'}}>
                            <Column>
                                <p style={{fontWeight: 'bold', marginBottom: '0'}}>Teaching Experience</p> 
                                <p style={{marginTop: '0', maxWidth: '375px'}}>How many years have you been teaching?</p>
                            </Column>

                            <Column style={{marginTop: '38px'}}>
                                <Dropdown 
                                    editable 
                                    placeholder="Enter or select years of experience"
                                    selected={yearsExp}
                                    onChange={(value, node) => setYearsExp(node ? node.key : value)}
                                >
                                    <div key="1">1</div>
                                    <div key="2">2</div>
                                    <div key="3">3</div>
                                    <div key="4">4</div>
                                    <div key="5">5</div>
                                    <div key="6">6</div>
                                    <div key="7">7</div>
                                    <div key="8">8</div>
                                    <div key="9">9</div>
                                    <div key="10+">10+</div>
                                </Dropdown>
                            </Column>
                        </Split>
                    </> : null}

                    <Split  className='mainsplit' style={{borderTop: '1px solid #e0e0e0', marginTop: '64px', paddingTop: '64px'}}>
                        <Column>
                           <p style={{fontWeight: 'bold', marginBottom: '0'}}>Improving your profile (optional)</p> 
                           <p style={{marginTop: '0', maxWidth: '375px'}}>Tick the following options that apply to you and upload any documents you have that we can use to verify your tags, which will increase trust and liklihood of bookings.</p>

                            <p style={{marginBottom: '0'}}>Examples include:</p>
                            <ul>
                                <li>&nbsp;- University degree certificates</li>
                                <li>&nbsp;- DBS certificates</li>
                                <li>&nbsp;- Examiner information</li>
                            </ul>
                        </Column>

                        <Column style={{marginTop: '24px'}}>
                            <FileMultiUpload 
                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                tagline="PNG, JPG, PDF, or DOC up to 10 MB each"
                                onFileRefChange={ref => setOtherDocsRef(ref)}
                                onPreviewChange={previews => setOtherDocsPreviews(previews)}
                                existingFiles={existingOtherDocs}
                                maxFiles={10}
                                private
                            />

                            <div style={{display: 'flex', marginBottom: '8px', flexWrap: 'wrap', gap: '16px'}}>
                                <Checkbox value={degree} setter={setDegree} label="Degree" />
                                {/*<Checkbox value={dbs} setter={setDbs} label="DBS" />*/}
                                <Checkbox value={enhancedDbs} setter={setEnhancedDbs} label="Enhanced DBS" /> 
                                <Checkbox value={examiner} setter={setExaminer} label="Examiner" />
                            </div>

                            {examiner ? <>
                                <div style={{display: 'flex', flexDirection: 'column', marginBottom: '12px'}}> 
                                    <div style={{marginTop: '10.56px', color: Colours.b500}}>If you are an examiner, please add which exam boards you are familiar with</div>
                                </div>

                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                                    <Checkbox value={aqa} setter={setAqa}  label="AQA" />
                                    <Checkbox value={ccfa} setter={setCcfa}  label="CCFA" />
                                    <Checkbox value={ocr} setter={setOcr} label="OCR" />
                                    <Checkbox value={edexcel} setter={setEdexcel}  label="Edexcel" />
                                    <Checkbox value={wjec} setter={setWjec} label="WJEC" />
                                </div>
                            </> : null}
                        </Column>
                    </Split>

                    <Split style={{marginTop: '80px', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>  
                            <Link black to={{
                                pathname: "/register-tutor-photos",
                                state: {
                                    progress: {
                                        ...location.state.progress,
                                        current: 'photos',
                                        complete: 6
                                    }
                                }
                            }}
                            onClick={back} style={{display: 'flex'}}>
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

export default Documents
