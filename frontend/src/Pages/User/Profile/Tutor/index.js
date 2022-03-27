import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Card from '../../../../Components/Card'
import Colours from '../../../../Config/Colours.js'
import UserContext from '../../../../UserContext.js'
import TutorSummary from '../Components/TutorSummary'
import MessageUser from '../Components/MessageUser'
import { EmailRegex } from '../../../../Config/Validation.js'
import { useHistory, useLocation } from 'react-router-dom'
import { API, Button, Checkbox, Dropdown, Input, Link, Modal, RingLoader, Tabs, Toast, TutorAvailability } from '../../../../Components'
import * as Table from '../../../../Components/Table'
import { useEffect, useRef, useState } from 'react'
import ReviewUser from '../Components/ReviewUser'
import AgencySummary from '../Components/AgencySummary'
import AgencySubjects from '../Components/AgencySubjects'
import zIndex from '../../../../Config/zIndex'
import AgencyBiosCarousel from '../Components/AgencyBiosCarousel'
import useWindowSize from '../../../../Hooks/UseWindowSize'
import UserIcon from '../../../../Components/UserIcon'

const Container = styled.div`
    & ._card {
        padding: 24px 42px;

        h1 {
            margin: 0 0 16px 0;
            font-size: 26px;
            line-height: 40px;
            color: ${Colours.n200};
        }

        p {
            font-size: 18px;
            line-height: 32px;
            color: ${Colours.n500};
            margin-top: 0;
        }
    }

    & .qualifications {
        h1 {
            margin-bottom: 0;
        }

        h2 {
            font-size: 18px;
            line-height: 32px;
            color: ${Colours.n500};
            margin-bottom: 16px;
        }
    }

    & .sidebar {
        max-width: 412px;
        flex: 1;

        & ._card {
            padding: 24px;
        }
    }

    & .qualifications .showmore {
        margin-top: 24px;
    }

    & .reviewresponse {
        margin-top: -32px;
        margin-left: 8px;

        & .row {
            justify-content: space-between;
        }
    }

    & .showallbtn {

        &.more {
            & .white {
                display: none;
            }
    
            &:hover {
                & .white {
                    display: inline;
                }
    
                & .blue {
                    display: none;
                }
            }
        }

        &.less {
            & .white {
                display: none;
            }
    
            &:hover {
                & .white {
                    display: inline;
                }
    
                & .blue {
                    display: none;
                }
            }
        }
        
    }

    & .pricing-card td {
        text-overflow: unset;
        overflow: unset;
        white-space: unset;
    }

    @media screen and (max-width: 1300px) {
        &.profile {
            padding: 0 16px;
        }

        .mainrow {
            flex-direction: column;
        }   

        .sidebar {
            flex-direction: row;
            flex-wrap: wrap;
            max-width: unset;

            & ._card {
                flex: 1;
            }

            & .message-card {
                order: 20;
                flex: .5;
            }

            & .review-card {
                order: 30;
                flex: .5;
            }

            & .bios-card {
                order: 10;
                flex: unset !important;
            }

            & .availability-card {
                flex-basis: 33%;
            }

            & .pricing-card {
                flex-basis: 45%;
            }
        }
    }

    @media screen and (max-width: 800px) {
        & .bios-card {
            width: calc(100% - 50px);
        }

        & .message-card {
            flex: unset !important;
            width: 100%;
        }

        & .review-card {
            flex: unset !important;
            width: 100%;
        }
    }
    
    @media screen and (max-width: 640px) {
        & .media-list {
            flex-wrap: wrap;
        }

        & ._card {
            padding: 16px;
        }
    }

    @media screen and (max-width: 420px) {
        & ._card h1 {
            font-size: 20px;
        }
    }
`

const Row = styled.div`
    display: flex;
    gap: 32px;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const Preview = styled.div`
    & .fullVideo {
        width: 100%;
        height: 440px;
    }

    & img {
        width: 100%;
        max-height: 440px;
        object-fit: contain;
    }

    margin-bottom: 24px;
`

const MediaList = styled.div`
    display: flex;
    gap: 24px;
`

const Media = styled.div`
    width: 100px;
    height: 100px;

    &.image {
        width: 100px;
        height: 100px;
        cursor: pointer;

        background: url(${props => props.img}) center center;
        background-size: cover;
    }

    &.video {
        position: relative;
        cursor: pointer;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            user-select: none;
        }
    }

    & .videoEmbed {
        width: 100%;
        height: 100%;    
    }
`

const Review = styled.div`
    display: flex;

    & > div:first-of-type img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
    }

    & b {
        margin: 0;
        
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-top: -24px;
        margin-left: 8px;
    }

    & p {
        margin-left: 8px;
    }

    margin-bottom: 24px;
`

const Stars = styled.div`
    margin-left: 8px;

    & img {
        margin-right: 6px;
        width: 18px;
    }

    & img:last-of-type {
        margin-right: 0;
    }

    margin-bottom: 8px;
`   

const ReviewDate = styled.div`
    font-size: 16px;
    font-weight: lighter;
`

const Tab = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    & > img {
        margin-bottom: 14px;
    }

    margin-bottom: 9px;
    margin-top: 14px;
`

/*
const UserIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
    background: ${Colours.b500};
`
*/


const AverageRating = styled.div`
    font-size: 12px;
    font-weight: 400;
    display: flex;
    gap: 8px;
    align-items: center;
`

const FullWidthImg = styled.img`
    width: 100vw;
    height: 326px;
    object-fit: cover;
    position: absolute;
    left: 0;
`

const AgencyInfo = styled.div`
    padding: 0 16px;
    margin-bottom: 36px;

    & h1 {
        font-size: 48px;
        line-height: 60px;
        color: #18191F;
        margin: 0;
    }

    & p {
        font-size: 16px;
        line-height: 28px;
        color: #6E7191;
    }

    & .agency-address, & .agency-website, & .agency-phone {
        font-weight: bold;
        font-size: 14px;
        color: #424242;

        display: flex;
        align-items: center;
        gap: 8px;
    }


    & .agency-website {
        & a {
            font-weight: bold;
            font-size: 14px;
            color: #424242;
            text-decoration: underline;

            &:active, &:visited {
                color: #424242;
            }

            &:hover {
                color: #757575;
            }
        }
    }

    @media screen and (max-width: 720px) {
        & .agency-info-row {
            flex-direction: column;
        }
    }
`

const AgencyHeader = styled.div`
    @media screen and (max-width: 1300px) {
        padding: 0 16px;
    }
`

const MapViewLink = styled.div`
    position: relative;
    
    &:hover {
        & > .map {
            display: block;
        }
    }
`

const MapView = styled.div`
    position: absolute;
    display: none;
    z-index: ${zIndex.top};
    transform: translateX(-50%);
`

const Label = styled.label`
color: ${Colours.b500};
font-weight: bold;
display: block;
`

function TutorProfile({user, setUser, review}) {

    const history = useHistory()
    const location = useLocation()

    const [authedUser, setAuthedUser] = useState(null)
    const [subjects, setSubjects] = useState({inPerson: [], online: []})
    const [subjectTab, setSubjectTab] = useState(0)
    const [references, setReferences] = useState([])
    const [verificationDocuments, setVerificationDocuments] = useState([])
    const [qualificationDocuments, setQualificationDocuments] = useState([])
    const [optionalDocuments, setOptionalDocuments] = useState([])
    const [contactModalVisible, setContactModalVisible] = useState(false)
    const [revisionModalVisible, setRevisionModalVisible] = useState(false)

    const [education, setEducation] = useState([])
    const [qualifications, setQualifications] = useState([])
    const [reviews, setReviews] = useState([])

    const [showAllReviews, setShowAllReviews] = useState(false)
    const [showAllEducation, setShowAllEducation] = useState(false)
    const [showAllQualifications, setShowAllQualifications] = useState(false)

    const [replyTo, setReplyTo] = useState("")
    const [message, setMessage] = useState("")
    const [replyToError, setReplyToError] = useState("")
    const [messageError, setMessageError] = useState("")

    const [revisionReplyTo, setRevisionReplyTo] = useState("")
    const [revisionMessage, setRevisionMessage] = useState("")
    const [revisionSection, setRevisionSection] = useState("")
    const [revisionReplyToError, setRevisionReplyToError] = useState("")
    const [revisionMessageError, setRevisionMessageError] = useState("")

    const [reviewResponses, setReviewResponses] = useState({})
    const [respondingToReview, setRespondingToReview] = useState(false)

    const [photos, setPhotos] = useState([])
    const [currentPhoto, setCurrentPhoto] = useState(null)
    const mediaListRef = useRef()

    const windowSize = useWindowSize()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let images = []

        if(user.profile_video_link && user.profile_video_link.includes('youtube.com/embed/')) {
            images.push(user.profile_video_link)
        } 

        images = [
            ...images,
            ...JSON.parse(user.profile_additional_images)
        ]

        setPhotos(images)
        setCurrentPhoto(0)

        setSubjects(user.subjects.reduce((subjects, subject) => {
            // subjects that are offered both online and in person use the _online price field
            if (subject.pivot.in_person && subject.pivot.online) {
                const sub = {
                    subject: subject.subject,
                    level: subject.pivot.level,
                    perHour: '£' + subject.pivot.price_per_hour_online / 100,
                    inPerson: subject.pivot.in_person,
                    online: subject.pivot.online        
                }

                subjects.inPerson.push(sub)
                subjects.online.push(sub)
            } else if (subject.pivot.inPerson) {
                subjects.inPerson.push({
                    subject: subject.subject,
                    level: subject.pivot.level,
                    perHour: '£' + subject.pivot.price_per_hour_in_person / 100,
                    inPerson: subject.pivot.in_person,
                    online: subject.pivot.online
                })
            } else if (subject.pivot.online) {
                subjects.inPerson.push({
                    subject: subject.subject,
                    level: subject.pivot.level,
                    perHour: '£' + subject.pivot.price_per_hour_online / 100,
                    inPerson: subject.pivot.in_person,
                    online: subject.pivot.online
                })
            }

            return subjects
        }, {inPerson: [], online: []}))

        if (user.references) {
            const references = JSON.parse(user.references)
            if (references) {
                setReferences(references)
            }
        }

        if (user.verification_documents) {
            const docs = JSON.parse(user.verification_documents)
            if (docs) {
                setVerificationDocuments(docs)
            }
        }

        if (user.qualification_documents) {
            const docs = JSON.parse(user.qualification_documents)
            if (docs) {
                setQualificationDocuments(docs)
            }
        }

        if (user.optional_documents) {
            const docs = JSON.parse(user.optional_documents)
            if (docs) {
                setOptionalDocuments(docs)
            }
        }

        if (user.reviews) {
            const r = []
            const resp = {}
            for(const rev of user.reviews) {
                if (rev.reviewee_acceptance == 'approved' || rev.admin_action == 'approved') {
                    r.push(rev)

                    if (!rev.tutor_response) {
                        resp[rev.id] = ""
                    }
                }
            }

            setReviews(r)
            setReviewResponses(resp)
        }

        const quals = JSON.parse(user.qualifications)
        setEducation(quals.filter(qualification => qualification.degree))
        setQualifications(quals.filter(qualification => qualification.other))
    }, [user])

    const download = async doc => {

        try {
            const response = await API.post('admin/download/private', {
                file: doc
            }, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', doc.substring(doc.lastIndexOf('/') + 1))
            link.click()
        } catch (error) {
            Toast.error("Failed to download document. Please try again.")
        }
    }

    const approveReference = async (tutorId, email) => {

        setLoading(true)

        try {
            const response = await API.post('admin/tutor/reference/approve', {
                tutorId,
                email
            })

            if (response && response.data && response.data.success) {
                const refs = references.map(r => ({...r}))
                const index = refs.findIndex(r => r.email == email)
                refs[index].status = 'approved'
                setReferences(refs)

                Toast.success("Successfully updated reference status.")
            } else {
                throw new Error("Unrecognized API response")
            }
        } catch (error) {
            Toast.error("Unexpected error updating reference status, please try again.")
        }

        setLoading(false)
    }

    const rejectReference = async (tutorId, email) => {

        setLoading(true)
        try {
            const response = await API.post('admin/tutor/reference/reject', {
                tutorId,
                email
            })

            if (response && response.data && response.data.success) {
                const refs = references.map(r => ({...r}))
                const index = refs.findIndex(r => r.email == email)
                refs[index].status = 'rejected'
                setReferences(refs)

                Toast.success("Successfully updated reference status.")
            } else {
                throw new Error("Unrecognized API response")
            }
        } catch (error) {
            Toast.error("Unexpected error updating reference status, please try again.")
        }
        setLoading(false)
    }

    const noResponseReference = async (tutorId, email) => {

        setLoading(true)
        try {
            const response = await API.post('admin/tutor/reference/no_contact', {
                tutorId,
                email
            })

            if (response && response.data && response.data.success) {
                const refs = references.map(r => ({...r}))
                const index = refs.findIndex(r => r.email == email)
                refs[index].status = 'no_response'
                setReferences(refs)

                Toast.success("Successfully updated reference status.")
            } else {
                throw new Error("Unrecognized API response")
            }
        } catch (error) {
            Toast.error("Unexpected error updating reference status, please try again.")
        }
        setLoading(false)
    }

    const sendEmail = async () => {

        setLoading(true)
        try {
            const response = await API.post('admin/tutor/contact', {
                tutorId: user.id,
                message,
                replyTo
            })

            if (response && response.data && response.data.success) {
                Toast.success("Successfully sent email to tutor.")
                setContactModalVisible(false)
                setMessage("")
                setReplyTo("")
            }
        } catch (error) {
            Toast.error("Unexpected error sending email to tutor. Please try again.")
        }
        setLoading(false)
    }


    const approve = async () => {

        setLoading(true)
        try {
            const response = await API.post('admin/tutor/approve', {
                tutorId: user.id
            })

            if (response && response.data && response.data.success) {
                history.push('/admin/pending-tutor-registrations')
                Toast.success("Successfully approved tutor.")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error approving tutor, please try again.")
        }
        setLoading(false)
    }

    const reject = async () => {

        setLoading(true)
        try {
            const response = await API.post('admin/tutor/reject', {
                tutorId: user.id
            })

            if (response && response.data && response.data.success) {
                history.push('/admin/pending-tutor-registrations')
                Toast.success("Successfully rejected tutor.")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error approving tutor, please try again.")
        }
        setLoading(false)
    }

    const updateReviewResponse = (id, value) => {
        setReviewResponses({
            ...reviewResponses,
            [id]: value
        })
    }

    const respondToReview = async id => {

        setRespondingToReview(true)

        try {
            const response = await API.post('tutor/review/' + id + '/respond', {
                message: reviewResponses[id]
            })

            if (response && response.data && response.data.success) {
                const resp = {...reviewResponses}
                const r = resp[id]

                const review = reviews.find(rev => rev.id == id)
                review.tutor_response = r 
                const _reviews = [...reviews]
                const index = _reviews.findIndex(rev => rev.id == id)
                _reviews[index] = review
                setReviews(_reviews)

                delete resp[id]
                setReviewResponses(resp)

                Toast.success("Successfully responded to review")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Failed to submit review response. Please try again.")
        }

        setRespondingToReview(false)
    }

    const LoginAndRedirect = async (to) => {
        //try {
            const response = await API.post('admin/users/impersonate', {
                user_id: user.id
            })

            if (response && response.data && response.data.success) {
                history.push(to)
                setUser({
                    ...response.data.user,
                    return_token: response.data.return_token,
                    return_to: location.pathname
                })
            } else {
                throw new Error("Unexpected API response")
            }
        //} catch (error) {
        //    Toast.error("Failed to impersonate user, please try again.")
        //}
    }

    useEffect(() => {

        if (!mediaListRef.current) { return }

        const nodes = mediaListRef.current.querySelectorAll('.onhover')
        for(const node of nodes) {
            node.addEventListener('mouseenter', event => {
                const index = node.dataset.photoIndex
                if (currentPhoto != index) {
                    setCurrentPhoto(index)
                }
            })
        }

    }, [mediaListRef.current])

    const showRevisionModal = section => {
        setRevisionModalVisible(true)
        setRevisionSection(section)
    }

    const sendRevisonEmail = async () => {

        const params = { 
            tutorId: user.id ,
            message: revisionMessage,
            section: revisionSection
        }

        if (revisionReplyTo) { params.replyTo = revisionReplyTo }


        try {
            const response = await API.post('admin/tutor/request_revision', params)
            if (response && response.data && response.data.success) {
                Toast.success("Successfully requested revision")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch(error) {
            Toast.error("Failed to request revision, please try again.")
        }

        setRevisionSection("")
        setRevisionMessage("")
        setRevisionModalVisible(false)
    }

    return <>
        <Helmet>
            <title>{user.tutor_type == 'agency' ? user.company_name : user.name + " " + user.surname.charAt(0)} - Qualified Tutors</title>
            <meta name="description" content={user.profile_summary} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={(user.tutor_type == 'agency' ? user.company_name : user.name + " " + user.surname.charAt(0)) + " - Qualified Tutors"} />
            <meta name="twitter:description" content={user.profile_summary} />
            <meta name="twitter:image" content={user.profile_image} />
            <meta name="og:title" content={(user.tutor_type == 'agency' ? user.company_name : user.name + " " + user.surname.charAt(0)) + " - Qualified Tutors"} />
            <meta name="og:description" content={user.profile_summary} />
            <meta name="og:image" content={user.profile_image} />
        </Helmet>


        <UserContext.Consumer>{context => setAuthedUser(context.user)}</UserContext.Consumer>

        {user.tutor_type == 'agency' ? <AgencyHeader>
            <FullWidthImg src={user.banner_image} />
            <div style={{height: '326px', marginBottom: '36px'}}></div>

            <AgencyInfo>
                <Row style={{justifyContent: 'space-between'}} className="agency-info-row">
                    <Column style={{gap: 0}}>
                        <h1>{user.company_name}</h1>
                        <p style={{margin: 0}}>{user.company_tagline}</p>
                    </Column>

                    <Column style={{gap: '16px'}}>
                        <div className='agency-address'><img alt="location" src='/img/loc-icon.svg' /> {user.address_line_1}, {user.city} {user.postcode}, UK</div>
                        <div className='agency-website'><img alt="url" src='/img/website-link-icon.svg' /><a target="_blank" href={user.company_website}>Click for {user.company_name} website</a></div>
                        <div className='agency-phone'><img alt="phone" src='/img/phone-icon.svg' /> {user.mobile_number}</div>
                        <MapViewLink><div className='agency-website'><img alt="arrow down" src='/img/arrow-down-map.svg' style={{width: '20px', height: '20px'}} /> View on the map</div>
                            <MapView className='map'>
                                <iframe
                                    width="320"
                                    height="240"
                                    style={{border:0}}
                                    loading="lazy"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAvGDitZ1khdQpuvRCho2_EeuTr2fAUyJk
                                        &q=${user.address_line_1},${user.city},${user.postcode},UK`}>
                                    </iframe>
                                </MapView>
                        </MapViewLink>
                    </Column>
                </Row>
            </AgencyInfo>

            <AgencySummary user={user} />
        </AgencyHeader> : null}

        <Container className="profile">
        <Row className="mainrow">
            <Column style={{flex: 1}}>
                {user.tutor_type != 'agency' ? <>
                    <TutorSummary user={user} /> 
                    
                </>: null}
                

                {user.tutor_type != 'agency' ? 
                    <Card className="_card">
                        <h1>About Me</h1>
                        {user.profile_about_you.split("\n").map((p, i) => <p key={i}>{p.trim()}</p>)}
                        
                        {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/profile')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('account')}>Request Revision</Button>
                        </Row> : null}
                    </Card>
                : null}

                {user.tutor_type == 'agency' ?
                    <Card className='_card'>
                        <h1>Subjects we offer</h1>
                        <AgencySubjects subjects={user.subjects} />
                    </Card>
                : null}
                
                <Card className="_card">
                    <h1>Videos and photos</h1>

                    <Preview>
                        {photos && photos.length > 0 ? (photos[currentPhoto].includes('youtube.com/embed/') ? <iframe 
                                    className="fullVideo"
                                    src={user.profile_video_link + '?rel=0&modestbranding&controls=0'} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe> : <img alt="photo" src={photos[currentPhoto]} />) : null}
                    </Preview>

                    <MediaList ref={mediaListRef} className='media-list'>
                        {user.profile_video_link && user.profile_video_link.includes('youtube.com/embed/') ? 
                            <Media className="video onhover" data-photo-index={0}>
                                <iframe 
                                    className="videoEmbed"
                                    src={user.profile_video_link + '?rel=0&modestbranding&controls=0'} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe> 
                            </Media>
                        : ''}

                        {user.profile_additional_images ? JSON.parse(user.profile_additional_images).map((img, index) => <Media 
                            className="image onhover" 
                            data-photo-index={user.profile_video_link && user.profile_video_link.includes('youtube.com/embed/') ? index + 1 : index}
                            onClick={e => setCurrentPhoto(user.profile_video_link && user.profile_video_link.includes('youtube.com/embed/') ? index + 1 : index)} 
                            img={img}
                            key={index}
                        ></Media>) : null}
                    </MediaList>

                    {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                        <Button outline onClick={e => LoginAndRedirect('/dashboard/photos')}>Edit</Button>
                        <Button outline onClick={e => showRevisionModal('photos')}>Request Revision</Button>
                    </Row> : null}
                </Card>

                {user.tutor_type == 'agency' ? 
                    <Card className="_card">
                        <h1>Further information</h1>
                        {user.profile_about_you.split("\n").map((p, i) => <p key={i}>{p.trim()}</p>)}
                        
                        {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/profile')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('account')}>Request Revision</Button>
                        </Row> : null}
                    </Card>
                : null}

                {user.tutor_type != 'agency' ? 
                    <Card className="_card qualifications">
                        <h1>Education/Qualifications</h1>
                        <h2>Degree</h2>
                        <Table.Table grey zebra compact lightBorder stacked={windowSize.width < 640}>
                            {(showAllEducation ? education : education.slice(0, 3)).map((qualification, i) => <Table.Row key={i}>
                                <Table.Col>
                                    {windowSize.width < 640 ? <Label>School</Label> : null}
                                    {qualification.school}
                                </Table.Col>
                                <Table.Col>
                                    {windowSize.width < 640 ? <Label>Title</Label> : null}
                                    {qualification.title}
                                </Table.Col>
                                <Table.Col>
                                    {windowSize.width < 640 ? <Label>Grade</Label> : null}
                                    {qualification.grade}
                                </Table.Col>
                            </Table.Row>)}
                        </Table.Table>
                        {education.length > 3 ? <Row className="showmore" style={{justifyContent: 'space-between'}}>
                            <div></div>
                            {showAllEducation ? <Button className="showallbtn less" outline onClick={e => setShowAllEducation(false)}>Less <img alt="disclosure arrow" className='blue' src="/img/disclosure.svg" style={{transform: 'rotate(180deg)'}} /><img alt="disclosure arrow" className='white' src="/img/disclosure_white.svg" style={{transform: 'rotate(180deg)'}} /> </Button> : <Button className="showallbtn more" onClick={e => setShowAllEducation(true)} outline>{education.length - 3} more <img alt="disclosure arrow" className='blue' src="/img/disclosure.svg" /><img alt="disclosure arrow" className='white' src="/img/disclosure_white.svg" /></Button>}
                        </Row> : null}

                        {qualifications.length > 0 ? <>
                            <h2>Other qualifications</h2>
                            <Table.Table grey zebra compact lightBorder>
                                {(showAllQualifications ? qualifications : qualifications.slice(0, 3)).map((qualification, i) => <Table.Row key={i}>
                                    <Table.Col>{qualification.school}</Table.Col>
                                    <Table.Col>{qualification.title}</Table.Col>
                                    <Table.Col>{qualification.grade}</Table.Col>
                                </Table.Row>)}
                            </Table.Table>
                        </> : null}
                        {qualifications.length > 3 ? <Row className="showmore" style={{justifyContent: 'space-between'}}>
                            <div></div>
                            {showAllQualifications ? <Button className="showallbtn less" outline onClick={e => setShowAllQualifications(false)}>Less <img alt="disclosure arrow" className='blue' src="/img/disclosure.svg" style={{transform: 'rotate(180deg)'}} /><img className='white' alt="disclosure arrow" src="/img/disclosure_white.svg" style={{transform: 'rotate(180deg)'}} /> </Button> : <Button className='showallbtn more' onClick={e => setShowAllQualifications(true)} outline>{qualifications.length - 3} more <img alt="disclosure arrow" className='blue' src="/img/disclosure.svg" /><img alt="disclosure arrow" className='white' src="/img/disclosure_white.svg" /></Button>}
                        </Row> : null}
                        
                        {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/qualifications')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('qualifications')}>Request Revision</Button>
                        </Row> : null}
                    </Card>
                : null}
                

                {!review ?
                    <Card className="_card">
                        <h1 style={{marginBottom: '24px', display: 'flex', flex: 1, justifyContent: 'space-between'}}>
                           {user.tutor_type != 'agency' ? 'My' : ''} Reviews

                            <AverageRating>
                                {user.average_review_score && reviews > 0 ? <>
                                    <Stars style={{marginBottom: 0, height: '32px'}}>
                                        {Array.from({length: user.average_review_score}).map((v, i) => <img alt="full star" src="/img/star_fill.svg" key={i} />)}
                                        {Array.from({length: 5 - user.average_review_score}).map((v, i) => <img alt="empty star" src="/img/star_outline.svg" key={i} />)}
                                    </Stars>

                                    (based on {user.review_score_based_on} reviews)
                                </> : null}
                            </AverageRating>
                        </h1>

                        {reviews.length == 0 ? <p>No reviews yet</p> : null}

                        {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, i) => <Review key={i}>
                            <Column>
                                {review.reviewer.profile_image ? 
                                    <img alt="profile image" src={review.reviewer.profile_image} /> : 
                                    <UserIcon user={review.reviewer} />
                                }
                            </Column>
                            <Column style={{flex: 1}}>
                                <Row style={{gap: '4px'}}>
                                    <Stars>
                                        {Array.from({length: review.rating}).map((v, i) => <img alt="full star" src="/img/star_fill_gold.svg" key={i} />)}
                                        {Array.from({length: 5 - review.rating}).map((v, i) => <img alt="empty star" src="/img/star_outline_gold.svg" key={i} />)}
                                    </Stars>
                                </Row>

                                <b>{review.reviewer.name} <ReviewDate>{(new Date(review.created_at)).toLocaleString('default', {dateStyle: 'short'})}</ReviewDate></b>
                                <p style={{marginTop: '-8px', fontSize: '16px', lineHeight: '24px'}}>{review.review}</p>

                                {!review.tutor_response && authedUser && authedUser.id == user.id ? <div className='reviewresponse'>
                                    <Input 
                                        text 
                                        label="Respond to review" 
                                        value={reviewResponses.hasOwnProperty(review.id) ? reviewResponses[review.id] : ''} 
                                        onChange={e => updateReviewResponse(review.id, e.target.value)}
                                    />

                                    <Row className='row'>
                                        <div></div>
                                        <Button primary onClick={e => respondToReview(review.id)}>{respondingToReview ? <RingLoader small /> : 'Submit'}</Button>
                                    </Row>
                                </div> : null}

                                {review.tutor_response && review.reviewee ? <Review>
                                    <Column>
                                        {review && review.reviewee && review.reviewee.profile_image ? 
                                            <img alt="profile image" src={review.reviewee.profile_image} /> : 
                                            <UserIcon>
                                                {user.tutor_type == 'agency' ? review.reviewee.company_name.charAt(0).toUpperCase() : review.reviewee.name.charAt(0).toUpperCase()}
                                                {user.tutor_type == 'agency' ? review.reviewee.company_name.charAt(1).toUpperCase() : review.reviewee.surname.charAt(0).toUpperCase()}
                                            </UserIcon>
                                        }
                                    </Column>

                                    <Column style={{flex: 1}}>
                                        <b>{user.tutor_type == 'agency' ? review.reviewee.company_name : review.reviewee.name}</b>
                                        <p style={{marginTop: '-8px', fontSize: '16px', lineHeight: '24px'}}>{review.tutor_response}</p>
                                    </Column>
                                </Review> : null}
                            </Column>
                        </Review>)}

                        {reviews.length > 3 ? <Row className="showmore" style={{justifyContent: 'space-between'}}>
                            <div></div>
                            {showAllReviews ? 
                                <Button className="showallbtn less" outline onClick={e => setShowAllReviews(false)}>Less <img alt="disclosure arrow" className="blue" src="/img/disclosure.svg" style={{transform: 'rotate(180deg)'}} /> <img alt="disclosure arrow" className="white" src="/img/disclosure_white.svg" style={{transform: 'rotate(180deg)'}} /> </Button> 
                              : <Button className="showallbtn more" onClick={e => setShowAllReviews(true)} outline>{reviews.length - 3} more <img alt="disclosure arrow" className='blue' src="/img/disclosure.svg" /> <img alt="disclosure arrow" className='white' src="/img/disclosure_white.svg" /> </Button>}
                        </Row> : null}
                    </Card>
                : null}

                {review ? <Card className="_card">
                    <h1 style={{marginBottom: '24px'}}>References</h1>
                    <Table.Table grey zebra compact lightBorder fixed>
                        <Table.Head>
                            <Table.Row>
                                <Table.Heading>Name</Table.Heading>
                                <Table.Heading>Email</Table.Heading>
                                <Table.Heading>Relationship</Table.Heading>
                                <Table.Heading></Table.Heading>
                            </Table.Row>
                        </Table.Head>

                        <Table.Body>
                            {references.map((reference, i) => <Table.Row key={i}>
                                <Table.Col>{reference.name}</Table.Col>
                                <Table.Col>{reference.email}</Table.Col>
                                <Table.Col>{reference.relationship}</Table.Col>
                                <Table.Col>
                                    {reference.status == 'pending' ? <>
                                        <Button primary onClick={e => approveReference(user.id, reference.email)}>{loading ? <RingLoader small /> : 'Approve'}</Button>
                                        <Button danger onClick={e => rejectReference(user.id, reference.email)}>{loading ? <RingLoader small /> : 'Reject'}</Button>
                                        <Button outline onClick={e => noResponseReference(user.id, reference.email)}>{loading ? <RingLoader small /> : 'No Response'}</Button>
                                    </> : <>
                                        {reference.status}
                                    </>}
                                </Table.Col>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Table>

                    <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                        <Button outline onClick={e => LoginAndRedirect('/dashboard/references')}>Edit</Button>
                        <Button outline onClick={e => showRevisionModal('references')}>Request Revision</Button>
                    </Row>
                </Card> : null}
            </Column>

            <Column className="sidebar">
                {!review ? <MessageUser user={user} authedUser={authedUser} /> : null}

                {user.tutor_type == 'agency' ? <Card className="_card bios-card">
                    <AgencyBiosCarousel bios={JSON.parse(user.company_bios)} />
                </Card> : null}

                {user.tutor_type != 'agency' ? 
                    <Card className="_card availability-card">
                        <h1>Availability</h1>
                        <TutorAvailability 
                            availability={JSON.parse(user.weekly_availability)} 
                            setAvailability={e => {}} 
                            compact
                            readonly
                        />

                        {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/availability')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('availability')}>Request Revision</Button>
                        </Row> : null}
                    </Card>
                : null}
                

                {user.tutor_type != 'agency' ? 
                    <Card className="_card pricing-card"> 
                        <h1>Pricing</h1>
                        <Tabs headingStyle={{marginBottom: '26px'}} active={subjectTab} setActive={setSubjectTab} tabs={[{
                            title: <Tab style={{color: subjectTab == 0 ? Colours.b500 : Colours.n200}}><img alt="icon" widht="20px" height="14px" src={subjectTab == 0 ? "/img/online.svg" : "/img/online_disabled.svg"}  /> ONLINE</Tab>,
                            content: <Table.Table grey borderCollapse zebra compact stacked={windowSize.width < 480}>
                                <Table.Head>
                                    <Table.Row>
                                        <Table.Heading>Subject</Table.Heading>
                                        <Table.Heading>Level</Table.Heading>
                                        <Table.Heading>Per hour</Table.Heading>
                                    </Table.Row>
                                </Table.Head>

                                <Table.Body>
                                    {subjects.online.map((subject, i) => <Table.Row key={i}>
                                        <Table.Col>{windowSize.width < 480 ? <Label>Subject</Label> : null} {subject.subject}</Table.Col>
                                        <Table.Col>{windowSize.width < 480 ? <Label>Level</Label> : null} {subject.level}</Table.Col>
                                        <Table.Col style={{textAlign: 'center'}}>{windowSize.width < 480 ? <Label>Per hour</Label> : null} {subject.perHour}</Table.Col>
                                    </Table.Row>)}
                                </Table.Body>
                            </Table.Table>
                        }, {
                            title: <Tab style={{color: subjectTab == 1 ? Colours.b500 : Colours.n200}}><img alt="icon" width="14px" height="18px" src={subjectTab == 1 ? "/img/person.webp" : "/img/person_disabled.webp"} /> IN PERSON</Tab>,
                            content: <Table.Table grey borderCollapse zebra compact stacked={windowSize.width < 480}>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Heading>Subject</Table.Heading>
                                    <Table.Heading>Level</Table.Heading>
                                    <Table.Heading>Per hour</Table.Heading>
                                </Table.Row>
                            </Table.Head>

                            <Table.Body>
                                {subjects.inPerson.map((subject, i) => <Table.Row key={i}>
                                    <Table.Col>{windowSize.width < 480 ? <Label>Subject</Label> : null} {subject.subject}</Table.Col>
                                    <Table.Col>{windowSize.width < 480 ? <Label>Level</Label> : null} {subject.level}</Table.Col>
                                    <Table.Col style={{textAlign: 'center'}}>{windowSize.width < 480 ? <Label>Per hour</Label> : null} {subject.perHour}</Table.Col>
                                </Table.Row>)}
                            </Table.Body>
                        </Table.Table>
                        }]} />

                        {review ? <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/subjects')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('subjects')}>Request Revision</Button>
                        </Row> : null}
                    </Card>
                : null}
                

                {authedUser && !review && authedUser.id != user.id ? <ReviewUser user={user} authedUser={authedUser} /> : null}

                {review ? <>
                    <Card className="_card">
                        <h1>Verification Documents</h1>
                        <Table.Table grey zebra compact lightBorder fixed>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Heading>Name</Table.Heading>
                                    <Table.Heading></Table.Heading>
                                </Table.Row>
                            </Table.Head>

                            <Table.Body>
                                {verificationDocuments.map((doc, i) => <Table.Row key={i}>
                                    <Table.Col>{doc.replaceAll("%2F", '/').substring(doc.replaceAll("%2F", '/').lastIndexOf('/') + 1)}</Table.Col>
                                    <Table.Col><Button outline onClick={e => download(doc)}>Download</Button></Table.Col>
                                </Table.Row>)}
                            </Table.Body>
                        </Table.Table>

                        <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                        <Button outline onClick={e => LoginAndRedirect('/dashboard/documents')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('documents')}>Request Revision</Button>
                        </Row>
                    </Card>

                    <Card className="_card">
                        <h1>Qualification Documents</h1>
                        <Table.Table grey zebra compact lightBorder fixed>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Heading>Name</Table.Heading>
                                    <Table.Heading></Table.Heading>
                                </Table.Row>
                            </Table.Head>

                            <Table.Body>
                                {qualificationDocuments.map((doc, i) => <Table.Row key={i}>
                                    <Table.Col>{doc.replaceAll("%2F", '/').substring(doc.replaceAll("%2F", '/').lastIndexOf('/') + 1)}</Table.Col>
                                    <Table.Col><Button outline onClick={e => download(doc)}>Download</Button></Table.Col>
                                </Table.Row>)}
                            </Table.Body>
                        </Table.Table>

                        <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/documents')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('documents')}>Request Revision</Button>
                        </Row>
                    </Card>

                    <Card className="_card">
                        <h1>Optional Documents</h1>
                        <Table.Table grey zebra compact lightBorder fixed>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Heading>Name</Table.Heading>
                                    <Table.Heading></Table.Heading>
                                </Table.Row>
                            </Table.Head>

                            <Table.Body>
                                {optionalDocuments.map((doc, i) => <Table.Row key={i}>
                                    <Table.Col>{doc.replaceAll("%2F", '/').substring(doc.replaceAll("%2F", '/').lastIndexOf('/') + 1)}</Table.Col>
                                    <Table.Col><Button outline onClick={e => download(doc)}>Download</Button></Table.Col>
                                </Table.Row>)}
                            </Table.Body>
                        </Table.Table>

                        <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                            <Button outline onClick={e => LoginAndRedirect('/dashboard/documents')}>Edit</Button>
                            <Button outline onClick={e => showRevisionModal('documents')}>Request Revision</Button>
                        </Row>
                    </Card>
                </> : null}
                
            </Column>
        </Row>

        {review ? 
            <Row style={{borderTop: '1px solid ' + Colours.n300, padding: '42px 16px 16px 16px', justifyContent: 'space-between'}}>
                <Button danger large onClick={reject}>{loading ? <RingLoader small /> : 'Reject'}</Button>

                <Button outline onClick={e => setContactModalVisible(true)}>Email Tutor</Button>
                
                <Button primary large onClick={approve}>{loading ? <RingLoader small /> : 'Approve'}</Button>
            </Row>
        : null}
    </Container>
    
    {review ? <>
        <Modal visible={contactModalVisible} dismiss={e => setContactModalVisible(false)}>
            <Card>
                <Input label="Reply-to Address" error={replyToError} valid={replyTo.match(EmailRegex)} onChange={e => setReplyTo(e.target.value)} value={replyTo} />
                <Input text style={{height: '340px', width: '480px'}} label="Message to tutor" error={messageError} onChange={e => setMessage(e.target.value)} value={message} />
                
                <Row style={{justifyContent: 'space-between', marginTop: '32px'}}>
                    <Button outline onClick={e => setContactModalVisible(false)}>Cancel</Button>
                    <Button primary onClick={sendEmail} disabled={!message || loading}>{loading ? <RingLoader small /> : 'Send'}</Button>
                </Row>
            </Card>
        </Modal>

        <Modal visible={revisionModalVisible} dismiss={e => setRevisionModalVisible(false)}>
            <Card>
                <Input label="Reply-to Address" error={revisionReplyToError} valid={revisionReplyTo.match(EmailRegex)} onChange={e => setRevisionReplyTo(e.target.value)} value={revisionReplyTo} />
                <Input text style={{height: '340px', width: '480px'}} label="Elaborate on the revision" error={revisionMessageError} onChange={e => setRevisionMessage(e.target.value)} value={revisionMessage} />
                
                <Row style={{justifyContent: 'space-between', marginTop: '32px'}}>
                    <Button outline onClick={e => setRevisionModalVisible(false)}>Cancel</Button>
                    <Button primary onClick={sendRevisonEmail} disabled={loading}>{loading ? <RingLoader small /> : 'Send'}</Button>
                </Row>
            </Card>
        </Modal>
    </> : null}
        

        
    </>
}

export default TutorProfile
