import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { useEffect, useRef, useState } from 'react'
import { Checkbox, FileMultiUpload, RingLoader, Button, Toast, Link } from '../../../../../Components'
import Colours from '../../../../../Config/Colours'
import { API } from '../../../../../Components'
import zIndex from '../../../../../Config/zIndex'


const Container = styled.div`
    color: #616161;
    line-height: 24px;

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

    & .notes {
        list-style-type: none;

        & li {
            line-height: 24px;
        }

        & li img {
            position: relative;
            top: 4px;
            height: 18px;
            margin-right: 4px;
        }
    }

    

    #qtsPopoverContainer {
        position: relative;

        & #qtsPopover {
            display: none;
            position: absolute;
            top: -128px;
            z-index: ${zIndex.top};
            padding: 24px;
            transform: translateX(-38px);
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
        }

        & #qtsPopover:hover {
            display: block;
        }

        & #qtsPopover[data-visible="true"] {
            display: block;
        }
    }

    @media screen and (max-width: 480px) {
        & .qts-link {
            font-size: 12px;
        }
    }
`

const Split = styled.div`
    display: flex;

    @media screen and (max-width: 860px) {
        flex-direction: column;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Error = styled.div`
    color: ${Colours.r400};
    margin-top: -24px;

    & img {
        position: relative;
        width: 12.8px;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
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
    const [otherDocsError, setOtherDocsError] = useState("")

    const qtsPopoverTriggerRef = useRef()
    const qtsPopoverRef = useRef()

    const [saving, setSaving] = useState(false)

    const findFileInFileList = (filename, list) => {
        let f = null 
        for (let x = 0; x < list.length; x++) {
            if (list[x].name == filename) {
                f = list[x]
            }
        }

        return f
    }

    const save = async event  => {

        const verificationPreviews = verificationDocsPreviews.map(p => ({...p}))
        const qualificationPreviews = qualificationDocsPreviews.map(p => ({...p}))
        const otherPreviews = otherDocsPreviews.map(p => ({...p}))

        setSaving(true)

        for(let i = 0; i < verificationPreviews.length; i++) {
            const file = verificationPreviews[i]
            if (!file.uploaded) {
                const formdata = new FormData()

                //const f = findFileInFileList(file.name, verificationDocsRef.files)
                const blob = await (await fetch(file.base64)).blob()
                const f = new File([blob], file.name, { type: file.mime, lastModified: file.lastModified })
                if (f) {
                    formdata.append("file", f)
                    try {
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        file.type = 'document'
                        verificationPreviews[i] = file
                    } catch(error) {
                        Toast.error("Unexpected error uploading files, please try again.")
                    }
                }
            }
        }
        setVerificationDocsPreviews(verificationPreviews)

        for(let i = 0; i < qualificationPreviews.length; i++) {
            const file = qualificationPreviews[i]
            if (!file.uploaded) {
                const formdata = new FormData()

                //const f = findFileInFileList(file.name, qualificationDocsRef.files)
                const blob = await (await fetch(file.base64)).blob()
                const f = new File([blob], file.name, { type: file.mime, lastModified: file.lastModified })
                if (f) {
                    formdata.append("file", f)
                    try {
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        file.type = 'document'
                        qualificationPreviews[i] = file
                    } catch (error) {
                        Toast.error("Unexpected error uploading files, please try again.")
                    }
                }
            }
        }
        setQualificationsDocsPreviews(qualificationPreviews)

        for(let i = 0; i < otherPreviews.length; i++) {
            const file = otherPreviews[i]
            if (!file.uploaded) {
                const formdata = new FormData()

                //const f = findFileInFileList(file.name, otherDocsRef.files)
                const blob = await (await fetch(file.base64)).blob()
                const f = new File([blob], file.name, { type: file.mime, lastModified: file.lastModified })
                if (f) {
                    formdata.append("file", f)
                    try {
                        const response = await API.post('upload/private', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        file.type = 'document'
                        otherPreviews[i] = file
                    } catch (error) {
                        Toast.error("Unexpected error uploading files, please try again.")
                    }
                }
            }
        }
        setOtherDocsPreviews(otherPreviews)
        
        try {
            const response = await API.post("tutor/profile/documents", {
                verification_documents: verificationPreviews.map(doc => doc.url),
                qualification_documents: qualificationPreviews.map(doc => doc.url),
                optional_documents: otherPreviews.map(doc => doc.url),
                opt_degree: !!degree,
                opt_dbs: !!dbs,
                opt_enhanced_dbs: !!enhancedDbs,
                opt_examiner: !!examiner,
                opt_aqa: !!aqa,
                opt_ccea: !!ccfa,
                opt_ocr: !!ocr,
                opt_edexel: !!edexcel,
                opt_wjec: !!wjec
            })

            if (response && response.data && response.data.success) {
                props.setUser({
                    ...props.user,
                    verification_documents: response.data.user.verification_documents,
                    qualification_documents: response.data.user.qualification_documents,
                    optional_documents: response.data.user.optional_documents,
                    opt_degree: response.data.user.opt_degree,
                    opt_dbs: response.data.user.opt_dbs,
                    opt_enhanced_dbs: response.data.user.opt_enhanced_dbs,
                    opt_examiner: response.data.user.opt_examiner,
                    opt_aqa: response.data.user.opt_aqa,
                    opt_ccea: response.data.user.opt_ccea,
                    opt_ocr: response.data.user.opt_ocr,
                    opt_edexel: response.data.user.opt_edexel,
                    opt_wjec: response.data.user.opt_wjec
                })
                Toast.success("Successfully updated your documents.")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error saving your documents, please try again.")
        }

        setSaving(false)
    }

    useEffect(() => {
        if (props.user) {

            const docUrlToObj = d => ({
                name: d.split('\\').pop().split('/').pop(),
                url: d,
                type: 'document',
                uploaded: true
            })

            if (props.user.verification_documents) {
                const docs = JSON.parse(props.user.verification_documents)
                setExistingVerificationDocs(docs.map(docUrlToObj))
            }

            if (props.user.qualification_documents) {
                const docs = JSON.parse(props.user.qualification_documents)
                setExistingQualificationDocs(docs.map(docUrlToObj))
            }

            if (props.user.optional_documents) {
                const docs = JSON.parse(props.user.optional_documents)
                setExistingOtherDocs(docs.map(docUrlToObj))
            }

            setDegree(props.user.opt_degree)
            setDbs(props.user.opt_dbs)
            setEnhancedDbs(props.user.opt_enhanced_dbs)
            setExaminer(props.user.opt_examiner)
            setAqa(props.user.opt_aqa)
            setCcfa(props.user.opt_ccea)
            setOcr(props.user.opt_ocr)
            setEdexcel(props.user.opt_edexel)
            setWjec(props.user.opt_wjec)
        }
    }, [props.user])

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

    return <>
        <Helmet>
            <title>Teaching documents - Qualified Tutors</title>
        </Helmet>

        <Container>
            <Split className='mainsplit'>
                <Column style={{flex: '8px', marginRight: '64px', marginBottom: '16px'}}>
                    <p style={{fontWeight: 'bold'}}>Identity</p>
                    <p>We will need either:</p>
                    <ul> 
                        <li>- Birth certificate</li>
                        <li>- Passport</li>
                        <li>- UK Driving License</li>
                    </ul>
                </Column>

                <Column>
                    <FileMultiUpload 
                        accept=".png,.jpg,.jpeg,.pdf"
                        tagline="PNG, JPG, or PDF, up to 10 MB each"
                        maxSize={10}
                        maxFiles={1}
                        onFileRefChange={ref => setVerificationDocsRef(ref)}
                        onPreviewChange={previews => setVerificationDocsPreviews(previews)}
                        existingFiles={existingVerificationDocs}
                        private
                    />
                    {verificationDocsError ? <Error><img alt="error" src="/img/danger.webp" />&nbsp; {verificationDocsError}</Error> : null}
                </Column>
            </Split>

            <Split style={{borderTop: '1px solid #e0e0e0', marginTop: '16px', paddingTop: '32px'}}>
                <Column>
                    <div id="qtsPopoverContainer" style={{fontWeight: 'bold', marginTop: 0}}>
                        Teaching qualification 
                        <img alt="alert" id="qtsPopoverTrigger" src="/img/alert_18.webp" style={{position: 'relative', left: '8px', top: '3px', width: '18px', height: '18px'}} ref={qtsPopoverTriggerRef} />
                        <div id="qtsPopover" data-visible="false" ref={qtsPopoverRef}>
                            <p>To get hold of your QTS certificate, visit</p>
                            <Link className="qts-link" primary to={{pathname: 'https://www.gov.uk/guidance/teacher-self-service-portal'}} target="_blank">https://www.gov.uk/guidance/teacher-self-service-portal</Link>
                        </div>
                    </div>

                    {props.user.tutor_type == "teacher" ? <>
                        <p style={{marginTop: 0}}>Please upload your teaching certificate</p>
                        <p style={{maxWidth: '375px', marginBottom: '4px'}}>Qualified Teacher Status allows you to teach in UK education system. To get hold of your QTS certificate, visit</p>
                        <Link className="qts-link" primary target="_blank" href="https://www.gov.uk/guidance/teacher-self-service-portal">https://www.gov.uk/guidance/teacher-self-service-portal</Link>
                    </> : <>
                        <p style={{fontWeight: 'bold', marginBottom: '0'}}>University Degree</p>
                        <p style={{maxWidth: '375px', marginBottom: '4px'}}>You must at least have a university degree to be able to have a profile displayed with Qualified Teachers.</p>
                    </>}
                    
                </Column>

                <Column style={{marginTop: '16px'}}>
                    <FileMultiUpload 
                        accept=".png,.jpeg,.jpg,.pdf"
                        tagline="PNG, JPG, or PDF, up to 10 MB each"
                        maxFiles={2}
                        onFileRefChange={ref => setQualificationsDocsRef(ref)}
                        onPreviewChange={previews => setQualificationsDocsPreviews(previews)}
                        existingFiles={existingQualificationDocs}
                        private
                    />
                    {qualificationDocsError ? <Error><img alt="error" src="/img/danger.webp" />&nbsp; {qualificationDocsError}</Error> : null}
                </Column>
            </Split>

            <div>
                <p style={{maxWidth: '540px'}}><b>Note:</b> If you can't hold of your QTS certificate, you can upload 2 of the following documents instead:</p>
                <ul className='notes'>
                    <li>&nbsp;- Payslip</li>
                    <li>&nbsp;- Document/Email showing your school/educational email address</li>
                    <li>&nbsp;- Document showing employers reference</li>
                    <li>&nbsp;- Teaching qualification certificate</li>
                </ul>
            </div>
            
            <Split style={{borderTop: '1px solid #e0e0e0', marginTop: '64px', paddingTop: '64px'}}>
                <Column>
                    <p style={{fontWeight: 'bold', marginBottom: '0'}}>Optional</p> 
                    <p style={{marginTop: '0', maxWidth: '375px'}}>Tick the following options that apply to you and upload any documents you have that we can use to verify your tags, which will increase trust and liklihood of bookings.</p>

                    <p style={{marginBottom: '0'}}>Examples include:</p>
                    <p style={{marginTop: '0', maxWidth: '375px'}}>University degree certificates, DBS certificates, Examiner information.</p>
                </Column>

                <Column style={{marginTop: '24px'}}>
                    <FileMultiUpload 
                        accept=".png,.jpg,.jpeg,.pdf"
                        tagline="PNG, JPG, or PDF, up to 10 MB each"
                        onFileRefChange={ref => setOtherDocsRef(ref)}
                        onPreviewChange={previews => setOtherDocsPreviews(previews)}
                        existingFiles={existingOtherDocs}
                        maxFiles={10}
                        private
                    />

                    <div style={{display: 'flex', marginBottom: '24px', gap: '16px', flexWrap: 'wrap'}}>
                        <Checkbox value={degree} setter={setDegree} label="Degree" />
                        {/*<Checkbox value={dbs} setter={setDbs} label="DBS" />*/}
                        <Checkbox value={enhancedDbs} setter={setEnhancedDbs} label="Enhanced DBS" /> 
                        <Checkbox value={examiner} setter={setExaminer} label="Examiner" />
                    </div>

                    {examiner ? <>
                        <div style={{display: 'flex', flexDirection: 'column', marginBottom: '12px'}}> 
                            <div style={{marginTop: '10.56px', color: Colours.b500}}>If you are an examiner, please add which exam boards you are familiar with</div>
                        </div>

                        <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                            <Checkbox value={aqa} setter={setAqa} label="AQA" />
                            <Checkbox value={ccfa} setter={setCcfa} label="CCFA" />
                            <Checkbox value={ocr} setter={setOcr} label="OCR" />
                            <Checkbox value={edexcel} setter={setEdexcel} label="Edexcel" />
                            <Checkbox value={wjec} setter={setWjec} label="WJEC" />
                        </div>
                    </> : null}
                </Column>
            </Split>

            <Row style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300}}>
                <div></div>
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default Documents