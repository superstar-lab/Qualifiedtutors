import { useEffect, useState, useRef } from "react"
import {Helmet} from 'react-helmet'
import styled from "styled-components"
import { API, Button, Card, FixedWidth, Link, RingLoader, Toast } from "../../../../../Components"
import toast from "../../../../../Components/Toast"
import UserIcon from "../../../../../Components/UserIcon"
import Colours from "../../../../../Config/Colours"
import zIndex from "../../../../../Config/zIndex"

const Container = styled.div`
    color: ${Colours.n500};

    & .overview {
        justify-content: space-between;
        margin-bottom: 32px;
        gap: 16px;

        & .card {
            padding: 32px;
            justify-content: center;
            display: flex;
            align-items: center;
            width: 180px;
            height: 180px;

            & img {
                height: 48px;
            }

            & h1 {
                margin: 16px 0;
                padding: 0;
                color: ${Colours.n500};
            }

            & p {
                margin: 0;
                padding: 0;
                color: ${Colours.n500};

                &.subtitle {
                    margin-top: 4px;
                    font-style: italic;
                    color: ${Colours.n600};
                }
            }
        }
    }

    & .profilepic {
        width: 256px;
        height: 256px;
        border-radius: 50%;
        object-fit: cover;
    }

    & .bio {
        gap: 16px;

        & b {
            min-width: 98px;
        }

        & p {
            margin: 0;
            padding-left: 16px;
        }
    }

    & .content {
        & .edit {
            position: absolute;
            top: 24px;
            right: 32px;
        }
    }

    & .back-arrow {
        
    }

    #popoverContainer {
        position: relative;

        & #popover {
            display: none;
            position: absolute;
            top: -96px;
            z-index: ${zIndex.top};
            padding: 24px;
            transform: translateX(-48px);
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

        & #popover:hover {
            display: block;
        }

        & #popover[data-visible="true"] {
            display: block;
        }
    }

    @media screen and (max-width: 1360px) {
        & .overview {
            justify-content: center;
            
        }
    }

    @media screen and (max-width: 720px) {
        & .bio-row {
            flex-direction: column;
        }
    }

    @media screen and (max-width: 360px) {
        & .user-icon {
            margin-left: -16px;
        }
    }
`

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const Tag = styled.div`

    ${props => props.status == 'approved' || props.status == 'complete' ? `
        background: ${Colours.g300};
    ` : ''}

    ${props => props.status == 'pending' || props.status == 'incomplete' || props.status == 'more info' ? `
        background: ${Colours.b500};
    ` : ''}

    ${props => props.status == 'rejected' ? `
        background: ${Colours.r500};
    ` : ''}

    ${props => props.status == 'draft' ? `
        background: ${Colours.n500};
    ` : ''}

    padding: 4px 8px;
    color: white;
    border-radius: 4px;
`

const BackArrow = styled.span`
    width: 18px;
    height: 18px;
    background: url('/img/back-icon.svg');


`

function TutorDashboard({user, setUser}) {

    const [loading, setLoading] = useState(true)
    const [averageResponseTime, setAverageResponseTime] = useState(null)
    const [activeConvos, setActiveConvos] = useState(0)
    const [unreadMessages, setUnreadMessages] = useState()
    const [references, setReferences] = useState([])
    const [validationStatus, setValidationStatus] = useState({
        accountInfo: 'incomplete',
        address: 'incomplete',
        subjects: 'incomplete',
        qualifications: 'incomplete',
        profile: 'incomplete',
        photos: 'incomplete',
        documents: 'incomplete',
        availability: 'incomplete',
        references: 'incomplete'
    })

    const popoverRef = useRef()
    const popoverTriggerRef = useRef()

    useEffect(() => {
        //if (user.validation_status == 'pending') {
            const status = {...validationStatus}

            if (user.admin_account_status) {
                status.accountInfo = user.admin_account_status
            } else {
                if (
                    !user.name ||
                    !user.surname ||
                    !user.email
                ) {
                    status.accountInfo = 'incomplete'
                } else {
                    status.accountInfo = 'complete'
                }
            }

            if (user.admin_address_status) {
                status.address = user.admin_address_status
            } else {
                if (
                    !user.address_line_1 ||
                    !user.city ||
                    !user.postcode ||
                    !user.mobile_number
                ) {
                    status.address = 'incomplete'
                } else {
                    status.address = 'complete'
                }
            }

            if (user.admin_subjects_status) {
                status.subjects = user.admin_subjects_status
            } else {
                const newSubjects = JSON.parse(user.new_subjects)
                if (user.subjects.length == 0 && (!newSubjects || !newSubjects.length)) {
                    status.subjects = 'incomplete'
                } else {
                    status.subjects = 'complete'
                }
            }

            if (user.admin_qualifications_status) {
                status.qualifications = user.admin_qualifications_status
            } else {
                const qualifications = JSON.parse(user.qualifications)
                if (!qualifications || !qualifications.length) {
                    status.qualifications = 'incomplete'
                } else {
                    status.qualifications = 'complete'
                }
            }

            if (user.admin_profile_status) {
                status.profile = user.admin_profile_status
            } else {
                if (
                    !user.profile_image ||
                    !user.gender ||
                    !user.profile_summary ||
                    !user.profile_about_you
                ) {
                    status.profile = 'incomplete'
                } else {
                    status.profile = 'complete'
                }
            }

            if (user.admin_photos_status) {
                status.photos = user.admin_photos_status
            } else {
                const photos = user.profile_additional_images ? JSON.parse(user.profile_additional_images) : []
                if (!photos || !photos.length) {
                    status.photos = 'incomplete'
                } else {
                    status.photos = 'complete'
                }
            }

            if (user.admin_documents_status) {
                status.documents = user.admin_documents_status
            } else {
                const vDocs = user.verification_documents ? JSON.parse(user.verification_documents) : false
                const qDocs = user.qualification_documents ? JSON.parse(user.qualification_documents) : false

                if (
                    (!vDocs || !qDocs) ||
                    vDocs.length == 0 ||
                    qDocs.length == 0
                ) {
                    status.documents = 'incomplete'
                } else {
                    status.documents = 'complete'
                }
            }

            if (user.admin_availability_status) {
                status.availability = user.admin_availability_status
            } else {
                const availability = user.hasOwnProperty('availability') && user.availability ? JSON.parse(user.weekly_availability) : []

                if (
                    !availability.morning ||
                    !availability.afternoon ||
                    !availability.evening ||
                    (
                        !availability.morning.find(slot => slot) &&
                        !availability.afternoon.find(slot => slot) &&
                        !availability.evening.find(slot => slot)
                    )
                ) {
                    status.availability = 'incomplete'
                } else {
                    status.availability = 'complete'
                }
            }

            if (user.admin_enhanced_dbs_status) {
                status.enhancedDbs = user.admin_enhanced_dbs_status
            } else {
                if (user.opt_enhanced_dbs) {
                    status.enhancedDbs = 'complete'
                } else {
                    status.enhancedDbs = 'incomplete'
                }
            }

            if (user.admin_references_status) {
                status.references = user.admin_references_status
            } else {
                if (user.tutor_type == 'tutor') {
                    const references = user.hasOwnProperty('references') && user.references ? JSON.parse(user.references) : []
                    if (references && references.length >= 2) {
                        status.references = 'complete'
                    } else {
                        status.references = 'incomplete'
                    }
                } else {
                    status.references = 'complete'
                }
            }
            

            setValidationStatus(status)
        //}

        if (user && user.average_response_time) {
            const minutes = user.average_response_time / 60
            if (user.average_response_time == -1) {
                setAverageResponseTime('N/A')
            } else if (minutes <= 15) {
                setAverageResponseTime("15 minutes")
            } else if (minutes <= 30) {
                setAverageResponseTime("half an hour")
            } else if (minutes <= 60) {
                setAverageResponseTime("an hour")
            } else if (minutes <= (60 * 24)) {
                setAverageResponseTime(Math.round(minutes / 60) + " hours")
            } else if (minutes <= (60 * 24 * 7)) {
                const days = Math.round(minutes / 60 / 24)
                setAverageResponseTime(days + " day" + (days > 1 ? 's' : ''))
            } else if (minutes <= (60 * 24 * 7 * 4)) {
                const weeks = Math.round(minutes / 60 / 24 / 7)
                setAverageResponseTime(weeks + " week" + (weeks > 1 ? 's' : ''))
            } else {
                const months = Math.round(minutes / 60 / 24 / 7 / 4)
                setAverageResponseTime(months + " month" + (months > 1 ? 's' : ''))
            }
        } else {
            setAverageResponseTime('N/A')
        }

        setReferences((user.hasOwnProperty('references') && user.references ? JSON.parse(user.references) : []))
    }, [user])

    useEffect(() => {
        
        const getConvoStats = async () => {
            setLoading(true)

            try {
                const response = await API.get('user/messages/stats')
                if (response && response.data && response.data.success) {
                    setActiveConvos(response.data.total)
                    setUnreadMessages(response.data.unread)
                    setLoading(false)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                toast.error("Unexpected error fetching conversation stats. Refresh to try again.")
            }
        }
        
        getConvoStats()

    }, [])

    const goLive = async event => {
        event.preventDefault()

        try {
            const response = await API.post('/tutor/go_live')
            if (response && response.data && response.data.success) {
                Toast.success("Successfully applied for review.")
                setUser({
                    ...user,
                    validation_status: 'pending'
                })
            }
        } catch (error) {
            Toast.error("Unexpected error applying for review, please try again.")
        }
    }

    const getVerified = async event => {
        event.preventDefault()

        try {
            const response = await API.post('/tutor/get_verified')
            if (response && response.data && response.data.success) {
                Toast.success("Successfully applied for verification.")
                setUser({
                    ...user,
                    verified_tutor_status: 'pending'
                })
            }
        } catch (error) {
            Toast.error("Unexpected error applying for review, please try again.")
        }
    }

    useEffect(() => {
        
        const onMouseEnter = event => {
            popoverRef.current.dataset.visible = "true"
        }

        const onMouseLeave = event => {
            popoverRef.current.dataset.visible = "false"
        }

        if (popoverTriggerRef.current && popoverRef.current) {
            popoverTriggerRef.current.addEventListener("mouseenter", onMouseEnter)
            popoverTriggerRef.current.addEventListener("mouseleave", onMouseLeave)
        }

        return () => {
            popoverTriggerRef.current && popoverTriggerRef.current.removeEventListener("mouseenter", onMouseEnter)
            popoverTriggerRef.current && popoverTriggerRef.current.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [popoverTriggerRef.current, popoverRef.current])


    return <>
        <Helmet>
            <title>Dashboard - Qualified Tutors</title>
        </Helmet>
        
        <Container>
                <FixedWidth>
                    <Row className="overview">
                        <Card>
                            <img alt="icon" src="/img/speech_fullsat.webp" />
                            <h1>{averageResponseTime}</h1>
                            <p>Avg. Response Time</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/person.webp" />
                            <h1>{loading ? <Row style={{justifyContent: 'center'}}><RingLoader medium colour={Colours.b500} /></Row> : activeConvos}</h1>
                            <p>Active Conversations</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/speech_fullsat.webp" />
                            <h1>{loading ? <Row style={{justifyContent: 'center'}}><RingLoader medium colour={Colours.b500} /></Row> : unreadMessages}</h1>
                            <p>Unread Messages</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/subject_book.webp" />
                            <h1>{user.reviews.length}</h1>
                            <p>Reviews Received</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/eye.webp" />
                            <h1>{user.profile_views_all_time}</h1>
                            <p>Profile Views</p>
                            <p className='subtitle'>All Time</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/eye.webp" />
                            <h1>{user.profile_views_week}</h1>
                            <p>Profile Views</p>
                            <p className='subtitle'>This Week</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/eye.webp" />
                            <h1>{user.profile_views_month}</h1>
                            <p>Profile Views</p>
                            <p className='subtitle'>This Month</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/eye.webp" />
                            <h1>{user.profile_views_last_month}</h1>
                            <p>Profile Views</p>
                            <p className='subtitle'>Last Month</p>
                        </Card>
                    </Row>

                    <Card className="content">
                        <Link danger className='edit' to="/dashboard/personal-details">Edit</Link>

                        <Row style={{gap: '32px', flex: 1}} className="bio-row">
                            {/*<img className="profilepic" style={!user.profile_image ? {objectFit: 'contain'} : {}} src={user && user.profile_image ? user.profile_image : '/img/person_full.webp'} />*/}
                            <UserIcon user={user} size={256} />
                            <Column className="bio" style={{flex: 1}}>

                                {!user.draft ? <div style={{borderBottom: user.validation_status != 'pending' && user.verified_tutor_status ? '1px solid ' + Colours.n800 : ''}}>
                                    <Row style={{marginBottom: '8px', alignItems: 'center', gap: '8px'}}> <b>Validation status: </b> <Tag status={user.validation_status}>{user.validation_status}</Tag></Row>

                                    {user.validation_status == 'approved' ? <Row style={{alignItems: 'center', marginBottom: '8px', gap: '16px'}}> <b>Background check status: </b> <Tag status={user.verified_tutor_status ? user.verified_tutor_status : 'draft'}>{user.verified_tutor_status ? user.verified_tutor_status : 'n/a'}</Tag></Row> : null}
                                </div>: null}

                                {user.validation_status == 'pending' ? <>
                                    {user.draft ? <Row style={{alignItems: 'center'}}>
                                        Your profile is in &nbsp;<Tag status="draft">draft</Tag>. To go live { 
                                            validationStatus.accountInfo != 'complete' ||
                                            validationStatus.address != 'complete' ||
                                            validationStatus.subjects != 'complete' ||
                                            validationStatus.qualifications != 'complete' ||
                                            validationStatus.profile != 'complete' ||
                                            validationStatus.photos != 'complete' ||
                                            validationStatus.documents != 'complete' ||
                                            validationStatus.availability != 'complete' ?
                                            'complete the steps below:'
                                        : <><Link primary onClick={goLive}>click here</Link>&nbsp; to submit your profile for review.</>}
                                    </Row> : null}

                                    {!user.draft ? 
                                        <Row style={{alignItems: 'center', gap: '16px', borderBottom: user.validation_status != 'pending' ? '1px solid ' + Colours.n800 : '', paddingBottom: user.validation_status != 'pending' ?  '16px' : ''}}> <b>Validation status: </b> <Tag status={user.validation_status}>{user.validation_status}</Tag></Row>
                                    : null}

                                    {user.draft || user.validation_status == 'pending' ? <Column style={{borderBottom: '1px solid ' + Colours.n800, paddingBottom: '16px'}}>
                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/personal-details" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Account Information</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.accountInfo}>{validationStatus.accountInfo}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/subjects" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Subjects &amp; Prices</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.subjects}>{validationStatus.subjects}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/qualifications" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Qualifications</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.qualifications}>{validationStatus.qualifications}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/profile" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Tutor Profile</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.profile}>{validationStatus.profile}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/photos" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Photos &amp; Video</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.photos}>{validationStatus.photos}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/documents" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Verification Documents</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.documents}>{validationStatus.documents}</Tag>
                                            </div>
                                        </Row>

                                        <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                            <div style={{minWidth: '230px'}}>
                                                <Link black to="/dashboard/availability" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Availability</Link>
                                            </div>
                                            <div>
                                                <Tag status={validationStatus.availability}>{validationStatus.availability}</Tag>
                                            </div>
                                        </Row>


                                    </Column> : null}
                                    
                                </> : null}

                                {!user.verified_tutor_status ? <>
                                    <h2 style={{fontSize: '18px', margin: '0 0 -16px 0'}}>
                                        <div id="popoverContainer" style={{fontWeight: 'bold', marginTop: 0}} onClick={e => {
                                                e.stopPropagation()
                                                const node = document.getElementById('popover')
                                                node.dataset.visible = node.dataset.visible == "true" ? "false" : "true"
                                            }}>
                                            Background check (optional)
                                            <img alt="alert" id="popoverTrigger" src="/img/alert_18.webp" style={{position: 'relative', left: '8px', top: '3px', width: '18px', height: '18px'}} ref={popoverTriggerRef}  />
                                            <div id="popover" data-visible="false" ref={popoverRef}>
                                                <p style={{lineHeight: 1.25}}>To have on your profile tag, 'Background check', we require enhanced DBS and two references.</p>
                                            </div>
                                        </div>
                                    </h2>

                                    <div style={{borderBottom: '1px solid' + Colours.n800}}>
                                        To apply for background check status you will need:
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px'}}>
                                            <div style={{height: '2px'}}></div>
                                            <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                                <div style={{minWidth: '200px'}}>
                                                    <Link black to="/dashboard/documents" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; Enhanced DBS</Link>
                                                </div>
                                                <div>
                                                    <Tag status={validationStatus.enhancedDbs}>{validationStatus.enhancedDbs}</Tag>
                                                </div>
                                            </Row>

                                            <Row style={{alignItems: 'center', gap: '16px', marginBottom: '4px'}}>
                                                <div style={{minWidth: '200px'}}>
                                                    <Link black to="/dashboard/references" style={{display: 'flex', alignItems: 'center'}}><BackArrow className="back-arrow" />&nbsp; References</Link>
                                                </div>
                                                <div>
                                                    <Tag status={validationStatus.references}>{validationStatus.references}</Tag>
                                                </div>
                                            </Row>
                                        </div>    
                                    
                                    {user.opt_enhanced_dbs && references.length >= 2 ? 
                                        <div style={{marginBottom: '16px'}}><Link primary onClick={getVerified}>Click here</Link>&nbsp; to apply for background check status.</div>
                                    : null}
                                    </div>
                                </> : null}

                                <Row> <b>Name:</b> <p>{user.name} {user.surname}</p> </Row>
                                <Row> <b>Address:</b> <p>{user.address_line_1}, {user.address_line_2 ? user.address_line_2 + ', ' : null} {user.city}, {user.postcode}</p> </Row>
                                <Row> <b>Mobile:</b> <p>{user.mobile_number}</p> </Row>
                                <Row> <b>Email:</b> <p>{user.email}</p> </Row>
                            </Column>
                        </Row>
                    </Card>
                </FixedWidth>
        </Container>
    </>
}

export default TutorDashboard