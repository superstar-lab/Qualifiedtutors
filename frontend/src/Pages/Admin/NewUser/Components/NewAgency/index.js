import { useEffect, useState } from "react"
import styled from "styled-components"
import { API, Button, Checkbox, Dropdown, FileMultiUpload, FileUpload, Input, QualificationsTable, RadioButton, SubjectTable, Toast, TutorAvailability } from "../../../../../Components"
import Colours from "../../../../../Config/Colours"
import Universities from "../../../../../Config/Universities"
import Grades from "../../../../../Config/Grades"
import ReferencesTable from "../../../../../Components/ReferencesTable"
import { EmailRegex, MobileNumberRegex, PostcodeRegex } from "../../../../../Config/Validation"
import { useLocation, useHistory } from 'react-router-dom'
import AgencyBios from "../../../../../Components/AgencyBios"

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
    margin-bottom: 16px;

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
    height: 16px;
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

/**
 * Form for creating new Agency type users
 */
function NewAgency({...props}) {

    const history = useHistory()

    const [sections, setSections] = useState({
        account: false,
        address: true,
        profile: true,
        subjects: true,
        qualifications: true,
        photos: true,
        availability: true,
        references: true
    })

    // account
    const [companyName, setCompanyName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [tutorType, setTutorType] = useState("agency")
    const [verificationStatus, setVerificationStatus] = useState("pending")

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    // address
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [town, setTown] = useState("")
    const [county, setCounty] = useState("")
    const [postcode, setPostcode] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [textMe, setTextMe] = useState(false)

    const [addressLine1Error, setAddressLine1Error] = useState(null)
    const [townError, setTownError] = useState(null)
    const [postcodeError, setPostcodeError] = useState(null)
    const [mobileNumberError, setMobileNumberError] = useState(null)

    // profile
    const [profilePicUrl, setProfilePicUrl] = useState(null)
    const [summary, setSummary] = useState("")
    const [aboutYou, setAboutYou] = useState("")
    const [uploading, setUploading] = useState(false)
    const [profilePicFileRef, setProfilePicFileRef] = useState(null)
    const [profilePicCanonUrl, setProfilePicCanonUrl] = useState(null)
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)

    const [bannerPicUrl, setBannerPicUrl] = useState(null)
    const [bannerPicFileRef, setBannerPicFileRef] = useState(null)
    const [bannerPicCanonUrl, setBannerPicCanonUrl] = useState(null)

    const [tagline, setTagline] = useState("")
    const [websiteUrl, setWebsiteUrl] = useState("")

    const [profilePicError, setProfilePicError] = useState(null) 
    const [bannerPicError, setBannerPicError] = useState(null) 
    const [summaryError, setSummaryError] = useState(null)
    const [aboutYouError, setAboutYouError] = useState(null)
    const [genderError, setGenderError] = useState(null)
    const [websiteUrlError, setWebsiteUrlError] = useState(null)

    // subjects
    const [subjects, setSubjects] = useState([]) 

    // qualifications
    const [uniQualifications, setUniQualifications] = useState([])
    const [otherQualifications, setOtherQualifications] = useState([])

    // photos & videos
    const [videoUrl, setVideoUrl] = useState("")
    const [videoUrlError, setVideoUrlError] = useState("")
    const [fileRef, setFileRef] = useState(null)
    const [filePreviews, setFilePreviews] = useState([])
    const [profilePics, setProfilePics] = useState([])
    const [bios, setBios] = useState([{
        name: "",
        blurb: "",
        imageUrl: ""
    }])

    // documents
    const [verificationDocsPreviews, setVerificationDocsPreviews] = useState([])
    const [existingVerificationDocs, setExistingVerificationDocs] = useState([])
    const [verificationDocsRef, setVerificationDocsRef] = useState(null)

    const [qualificationDocsPreviews, setQualificationsDocsPreviews] = useState([])
    const [existingQualificationDocs, setExistingQualificationDocs] = useState([])
    const [existingQualificationProofDocs, setExistingQualificationProofDocs] = useState([])
    const [otherDocsPreviews, setOtherDocsPreviews] = useState([])
    const [existingOtherDocs, setExistingOtherDocs] = useState([])
    const [otherDocsRef, setOtherDocsRef] = useState(null)

    const [qualificationProofDocsPreviews, setQualificationsProofDocsPreviews] = useState([])
    const [qualificationDocsRef, setQualificationsDocsRef] = useState(null)
    const [qualificationProofDocsRef, setQualificationsProofDocsRef] = useState(null)

    const [yearsExp, setYearsExp] = useState(null)

    const [degree, setDegree] = useState(false)
    const [dbs, setDbs] = useState(false) 
    const [enhancedDbs, setEnhancedDbs] = useState(false)
    const [examiner, setExaminer] = useState(false)
    const [aqa, setAqa] = useState(false)
    const [ccfa, setCcfa] = useState(false)
    const [ocr, setOcr] = useState(false)
    const [edexcel, setEdexcel] = useState(false)
    const [wjec, setWjec] = useState(false)

    // availabiltiy
    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false]
    })

    // references
    const [references, setReferences] = useState([])

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

    const findFileInFileList = (filename, list) => {
        let f = null 
        for (let x = 0; x < list.length; x++) {
            if (list[x].name == filename) {
                f = list[x]
            }
        }

        return f
    }

    const submit = async event => {

        setUploading(true)
        let hasErrors = false

        const params = {
            email,
            password,
            tutor_type: tutorType,
            verification_status: verificationStatus,
            accept_tos: true,
            no_login: true
        }

        if (companyName) { params.company_name = companyName }
        if (addressLine1) { params.address_line_1 = addressLine1 }
        if (addressLine2) { params.address_line_2 = addressLine2 }
        if (town) { params.city = town }
        if (county) { params.county = county }

        if (postcode) {
            if (!postcode.match(PostcodeRegex)) {
                setPostcodeError("Must be a valid UK postcode")
                hasErrors = true
            } else {
                params.postcode = postcode
            }
        }

        if (mobileNumber) {
            if (!mobileNumber.match(MobileNumberRegex)) {
                setMobileNumberError("Must be a valid phone number")
                hasErrors = true
            } else {
                params.mobile_number = mobileNumber
            }
        }

        if (profilePicUrl) {
            if (profilePicUrl.startsWith('blob:')) {
                const formdata = new FormData()
                formdata.append("file", new File([ await fetch(profilePicUrl).then(r => r.blob()) ], profilePicFileRef.files[0].name))
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

        if (male || female) {
            params.gender = male ? 'male' : 'female'
        }

        if (summary) {
            params.profile_summary = summary
        }

        if (aboutYou) {
            if (aboutYou.length < 50) {
                setAboutYouError("Min. 50 characters")
                hasErrors = true
            } else {
                params.profile_about_you = aboutYou
            }
        }

        if (subjects.length > 0) {
            params.subjects = subjects
        }

        if (uniQualifications.length > 0 || otherQualifications.length > 0) {
            params.qualifications = [
                ...uniQualifications,
                ...otherQualifications
            ]
        }

        const files = [...filePreviews]
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
        setFilePreviews(files)
        if (files.length > 0) {
            params.profile_additional_images = files.map(file => file.url)
        }

        const verificationPreviews = [...verificationDocsPreviews]
        const qualificationPreviews = [...qualificationDocsPreviews]
        const qualificationProofPreviews = [...qualificationProofDocsPreviews]
        const otherPreviews = [...otherDocsPreviews]

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

        setVerificationDocsPreviews(verificationPreviews)
        setQualificationsDocsPreviews(qualificationPreviews)
        setQualificationsProofDocsPreviews(qualificationProofPreviews)
        setOtherDocsPreviews(otherPreviews)

        if (verificationPreviews.length > 0) {
            params.verification_documents = verificationPreviews.map(d => d.url)
        }
        if (qualificationPreviews.length > 0) {
            params.qualification_documents = qualificationPreviews.map(d => d.url)
        }
        if (otherDocsPreviews.length > 0) {
            params.optional_documents = otherDocsPreviews.map(d => d.url)
        }
        if (qualificationProofPreviews.length > 0) {
            params.qualification_proof_documents = qualificationProofDocsPreviews.map(d => d.url)
        }

        if (yearsExp) {
            params.years_of_experience = yearsExp
        }

        if (degree) { params.opt_degree = degree }
        if (dbs) { params.opt_dbs = dbs }
        if (enhancedDbs) { params.opt_enhanced_dbs = enhancedDbs }
        if (examiner) { 
            params.opt_examiner = examiner 

            if (aqa) { params.opt_aqa = aqa }
            if (ccfa) { params.opt_ccea = ccfa }
            if (ocr) { params.opt_ocr = ocr }
            if (edexcel) { params.opt_edexcel = edexcel }
            if (wjec) { params.opt_wjec = wjec }
        }

        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            params.availability = availability
        }

        if (references.length > 0) {
            params.references = references
        }

        if (!hasErrors) {
            try {
                const response = await API.post("register/tutor", params)
                
                if (response && response.data && response.data.success) {
                    Toast.success("Successfully created new tutor")
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

    useEffect(() => {
        const match = videoUrl.match(/https:\/\/www.youtube.com\/embed\/[^"]*/gm)
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

    return <Container>
        <Section className="section" data-label="Account" collapsed={sections.account} onClick={e => toggleSection(e, 'account')}>
            <Spacer />
            <Input label="Agency name" valid={companyName.length > 0}  onChange={e => setCompanyName(e.target.value)} value={companyName} />

            <Row>
                <Input label="Email*" valid={email.toLowerCase().match(EmailRegex)} onChange={e => setEmail(e.target.value)} value={email} error={emailError} />
                <Input label="Password*" error={passwordError ? true : false} valid={password.length >= 8}  autocomplete="off" type={'password'} onChange={e => setPassword(e.target.value)} value={password} style={{borderColor: emailError ? Colours.r400 : Colours.n300}} />
            </Row>
            
            <Spacer />
            <Label>Verification status*</Label>
            <Row>
                <RadioButton name="verificationStatus" value="pending" current={verificationStatus} value="pending" setter={setVerificationStatus} small>Pending</RadioButton>
                <RadioButton name="verificationStatus" value="approved" current={verificationStatus} value="approved" setter={setVerificationStatus} small>Approved</RadioButton>
            </Row>
        </Section>
        
        <Section className="section" data-label="Address" collapsed={sections.address} onClick={e => toggleSection(e, 'address')}>
            <Spacer />
            <Input label="Street name" valid={addressLine1.length > 0}  onChange={e => setAddressLine1(e.target.value)} value={addressLine1} error={addressLine1Error}  />
            <Input onChange={e => setAddressLine2(e.target.value)} value={addressLine2} valid={addressLine2.length > 0} />
            <Input label="Town/area" onChange={e => setTown(e.target.value)} value={town} error={townError} valid={town.length > 0} />
            <Input label="City" onChange={e => setCounty(e.target.value)} value={county} valid={county.length > 0} />

            <Row>
                <Input label="Postcode" onChange={e => setPostcode(e.target.value)} value={postcode} error={postcodeError} valid={postcode.toLowerCase().match(PostcodeRegex)}  />
                <Input label="Mobile number" onChange={e => setMobileNumber(e.target.value)} value={mobileNumber} error={mobileNumberError} valid={!!mobileNumber && mobileNumber.match(MobileNumberRegex)}  />
            </Row>
        </Section>
        
        <Section className="section" data-label="Profile" collapsed={sections.profile} onClick={e => toggleSection(e, 'profile')}>
            <Spacer />
            <Label>Upload a profile picture</Label>
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
                />
                {bannerPicError ? <Error style={{margin: '-16px 0 16px 0'}}><img alt="error" src="/img/danger.webp" /> {bannerPicError}</Error> : null}
            </div>

            <Input label="Agency tagline" value={tagline} onChange={e => setTagline(e.target.value)} />
            <Input label="Website URL" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />

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
            <Counter style={{marginBottom: '16px'}}><img alt="alert" src="/img/alert_18.webp" style={{width: '20px'}} />&nbsp; {200 - summary.length} characters left</Counter>

            <Input 
                text
                noresize
                label={"Further information"}
                placeholder={"Write a description about your agency, your background, and what you offer."}
                value={aboutYou}
                style={{height: '430px'}}
                onChange={e => { e.target.value.length <= 1200 && setAboutYou(e.target.value) }}
                error={!!aboutYouError}
            />
            {aboutYouError ? <Error><img alt="error" src="/img/danger.webp" /> {aboutYouError}</Error> : null}
            <Counter><img alt="alert" src="/img/alert_18.webp" style={{width: '20px'}} />&nbsp; {1200 - aboutYou.length} characters left</Counter>
        </Section>

        <Section className="section" data-label="Subjects" collapsed={sections.subjects} onClick={e => toggleSection(e, 'subjects')}>
            <Spacer />
            <SubjectTable subjects={subjects} setSubjects={setSubjects} />
        </Section>

        <Section className="section" data-label="Qualifications" collapsed={sections.qualifications} onClick={e => toggleSection(e, 'qualifications')}>
            <Spacer />
            <QualificationsTable 
                className="uniqualifications"
                qualifications={uniQualifications} 
                setQualifications={setUniQualifications} 
                institutions={Universities}
                instituionLabel="University"
                titleLabel="Course"
                grades={Grades}
                degree
            />

            <br />
            <h3>Other achievements</h3>

            <QualificationsTable 
                qualifications={otherQualifications}
                setQualifications={setOtherQualifications}
                instituionLabel="Title"
                titleLabel="Description"
                addTitle="achievement"
                gradeOptional={true}
            />
        </Section>

        <Section className="section" data-label="Photos & Video" collapsed={sections.photos} onClick={e => toggleSection(e, 'photos')}>
            <Spacer />

            <h3>Bios</h3>
            <AgencyBios bios={bios} setBios={setBios} />

            <h3>Photos &amp; Video</h3>
            <Label>Upload photos</Label>
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
        </Section>

        <Section className="section" data-label="Availability" collapsed={sections.availability} onClick={e => toggleSection(e, 'availability')}>
            <Spacer />
            <TutorAvailability availability={availability} setAvailability={setAvailability} />
        </Section>

        <Section className="section" data-label="References" collapsed={sections.references} onClick={e => toggleSection(e, 'references')}>
            <Spacer />
            <ReferencesTable references={references} setReferences={setReferences} />
        </Section>

        <Row style={{justifyContent: 'space-between', marginTop: '32px'}}>
            <div></div>
            <Button primary onClick={submit}>Create tutor</Button>
        </Row>
    </Container>
}

export default NewAgency