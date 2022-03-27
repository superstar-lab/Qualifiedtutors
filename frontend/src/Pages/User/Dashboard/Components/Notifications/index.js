import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import React, { useState, useEffect } from 'react'
import UserContext from '../../../../../UserContext.js'
import Colours from '../../../../../Config/Colours'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    API
} from '../../../../../Components'

const Container = styled.div`
    & h2 {
        margin-top: 32px;
        margin-bottom: 8px;

        &:first-of-type {
            margin-top: 0;
        }
    }

    & h3 {
        margin: 0;
    }

    & .checkbox {
        margin-bottom: 8px;
    }

    & p {
        color: ${Colours.n500};
    }

    & ul {
        color: ${Colours.n500};
        line-height: 24px;
    }

    @media screen and (max-width: 1200px) {
        & .checkbox label {
            white-space: unset;
        }
    }
`

const Row = styled.div`
    display: flex;
    gap: 16px;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`   

function Notifications({user, setUser}) {

    const findPref = type => user.notification_preferences.find(pref => pref.type == type)

    const newMsgPref = findPref('message_received')
    const newTutorRegPref = findPref('new_tutor_registration')
    const tutorApprovedPref = findPref('tutor_approved')
    const tutorRejectedPref = findPref('tutor_rejected')
    const subjectApprovedPref = findPref('subject_approved')
    const subjectRenamedPref = findPref('subject_renamed')
    const subjectRemappedPref = findPref('subject_remapped')
    const subjectRejectedPref = findPref('subject_rejected')
    const failedAddressLookupPref = findPref('failed_address_lookup')
    const newSubjectsPref = findPref('new_subjects')
    const referenceApprovedPref = findPref('reference_approved')
    const referenceRejectedPref = findPref('reference_rejected')
    const referenceNoContactPref = findPref('reference_no_contact')
    const registrationInquiryPref = findPref('registration_inquiry')
    const reviewSubmittedPref = findPref('review_submitted')
    const reviewRejectedPref = findPref('review_rejected')
    const moreRegInfoAccountPref = findPref('more_registration_info_account')
    const moreRegInfoAddressPref = findPref('more_registration_info_address')
    const moreRegInfoSubjectsPref = findPref('more_registration_info_subjects')
    const moreRegInfoQualificationsPref = findPref('more_registration_info_qualifications')
    const moreRegInfoProfilePref = findPref('more_registration_info_profile')
    const moreRegInfoPhotosPref = findPref('more_registration_info_photos')
    const moreRegInfoDocumentsPref = findPref('more_registration_info_documents')
    const moreRegInfoAvailabilityPref = findPref('more_registration_info_availability')
    const moreRegInfoReferencesPref = findPref('more_registration_info_references')

    // EMAIL PREFERENCES (no pref record defaults to ON) -- most emails can't be opted out of
    // all user types
    const [newMessageEmail, setNewMessageEmail] = useState(newMsgPref && !newMsgPref.email ? false : true)
    
    // SMS PREFERENCES (no pref record defaults to OFF)
    // all user types
    const [newMsgSms, setNewMsgSms] = useState(newMsgPref ? newMsgPref.mobile : false)
    const [failedAddressLookupSms, setFailedAddressLookupSms] = useState(failedAddressLookupPref ? failedAddressLookupPref.mobile : false)
    
    // students
    const [reviewRejectedSms, setReviewRejectedSms] = useState(reviewRejectedPref ? reviewRejectedPref.mobile : false)

    // admin
    const [newTutorRegSms, setNewTutorRegSms] = useState(newTutorRegPref ? newTutorRegPref.mobile : false)
    const [newSubjectsSms, setNewSubjectsSms] = useState(newSubjectsPref ? newSubjectsPref.mobile : false)

    // tutor
    const [tutorApprovedSms, setTutorApprovedSms] = useState(tutorApprovedPref ? tutorApprovedPref.mobile : false)
    const [tutorRejectedSms, setTutorRejectedSms] = useState(tutorRejectedPref ? tutorRejectedPref.mobile : false)
    const [subjectApprovedSms, setSubjectApprovedSms] = useState(subjectApprovedPref ? subjectApprovedPref.mobile : false)
    const [subjectRejectedSms, setSubjectRejectedSms] = useState(subjectRenamedPref ? subjectRenamedPref.mobile : false)
    const [referenceApprovedSms, setReferenceApprovedSms] = useState(referenceApprovedPref ? referenceApprovedPref.mobile : false)
    const [referenceRejectedSms, setReferenceRejectedSms] = useState(referenceRejectedPref ? referenceRejectedPref.mobile : false)
    const [referenceNoContactSms, setReferenceNoContactSms] = useState(referenceNoContactPref ? referenceNoContactPref.mobile : false)
    const [registrationInquirySms, setRegistrationInquirySms] = useState(registrationInquiryPref ? registrationInquiryPref.mobile : false)
    const [reviewSubmittedSms, setReviewSubmittedSms] = useState(reviewSubmittedPref ? reviewSubmittedPref.mobile : false)
    const [moreRegInfoAccountSms, setMoreRegInfoAccountSms] = useState(moreRegInfoAccountPref ? moreRegInfoAccountPref.mobile : false)
    const [moreRegInfoAddressSms, setMoreRegInfoAddressSms] = useState(moreRegInfoAddressPref ? moreRegInfoAddressPref.mobile : false)
    const [moreRegInfoSubjectsSms, setMoreRegInfoSubjectsSms] = useState(moreRegInfoSubjectsPref ? moreRegInfoSubjectsPref.mobile : false)
    const [moreRegInfoQualificationsSms, setMoreRegInfoQualificationsSms] = useState(moreRegInfoQualificationsPref ? moreRegInfoQualificationsPref.mobile : false)
    const [moreRegInfoProfileSms, setMoreRegInfoProfileSms] = useState(moreRegInfoProfilePref ? moreRegInfoProfilePref.mobile : false)
    const [moreRegInfoPhotosSms, setMoreRegInfoPhotosSms] = useState(moreRegInfoPhotosPref ? moreRegInfoPhotosPref.mobile : false)
    const [moreRegInfoDocumentsSms, setMoreRegInfoDocumentsSms] = useState(moreRegInfoDocumentsPref ? moreRegInfoDocumentsPref.mobile : false)
    const [moreRegInfoAvailabilitySms, setMoreRegInfoAvailabilitySms] = useState(moreRegInfoAvailabilityPref ? moreRegInfoAvailabilityPref.mobile : false)
    const [moreRegInfoReferencesSms, setMoreRegInfoReferencesSms] = useState(moreRegInfoReferencesPref ? moreRegInfoReferencesPref.mobile : false)

    const [saving, setSaving] = useState(false)

    const save = async event => {
        setSaving(true)

        const params = {
            message_received: {
                email: newMessageEmail,
                mobile: newMsgSms
            },
            failed_address_lookup: { mobile: failedAddressLookupSms },
        }

        if (user.role == 'client') {
            params.review_rejected = { mobile: reviewRejectedSms }
        }

        if (user.role == 'admin') {
            params.new_tutor_registration = { mobile: newTutorRegSms }
            params.new_subjects = { mobile: newSubjectsSms }
        }

        if (user.role == 'tutor') {
            params.tutor_approved = { mobile: tutorApprovedSms }
            params.tutor_rejected = { mobile: tutorRejectedSms }
            params.subject_approved = { mobile: subjectApprovedSms }
            params.subject_rejected = { mobile: subjectRejectedSms }
            params.reference_approved = { mobile: referenceApprovedSms }
            params.reference_rejected = { mobile: referenceRejectedSms }
            params.reference_no_contact = { mobile: referenceNoContactSms }
            params.registration_inquiry = { mobile: registrationInquirySms }
            params.review_submitted = { mobile: reviewSubmittedSms }
            params.more_registration_info_account = { mobile: moreRegInfoAccountSms }
            params.more_registration_info_address = { mobile: moreRegInfoAddressSms }
            params.more_registration_info_subjects = { mobile: moreRegInfoSubjectsSms }
            params.more_registration_info_qualifications = { mobile: moreRegInfoQualificationsSms }
            params.more_registration_info_profile = { mobile: moreRegInfoProfileSms }
            params.more_registration_info_photos = { mobile: moreRegInfoPhotosSms }
            params.more_registration_info_documents = { mobile: moreRegInfoDocumentsSms }
            params.more_registration_info_availability = { mobile: moreRegInfoAvailabilitySms }
            params.more_registration_info_references = { mobile: moreRegInfoReferencesSms }
        }

        try {
            const response = await API.post('user/profile/notification_preferences', params)

            if (response && response.data && response.data.success) {
                setUser({
                    ...user,
                    notification_preferences: response.data.user.notification_preferences
                })
                Toast.success("Successfully updated your notification preferences.")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error occured updating your notification preferences. Please try again.")
        }

        setSaving(false)
    }

    return <>
        <Helmet>
            <title>Notification settings - Qualified Tutors</title>
        </Helmet>
        <Container>
            <h1>Notifications</h1>

            <h2>Email notifications</h2>
            
            <Checkbox label="Receive an email notification when you receive new messages" value={newMessageEmail} setter={setNewMessageEmail} />
            

            <h2>SMS notifications</h2>

            <Checkbox label="Receive a text notification when you receive new messages" value={newMsgSms} setter={setNewMsgSms} />
            {user.role == 'admin' ? <>
                <Checkbox label="Receive a text notification when a new tutor registration needs review" value={newTutorRegSms} setter={setNewTutorRegSms} />
                <Checkbox label="Receive a text notification when a tutor enters an unrecognized subject" value={newSubjectsSms} setter={setNewSubjectsSms} />
            </> : null}

            {user.role == 'client' ? <>
                <Checkbox label="Receive a text notification when a tutor disputes your review" value={reviewRejectedSms} setter={setReviewRejectedSms} />
            </> : null}
            
            {/*
                {user.role == 'tutor' ? <>
                {user.validation_status == 'pending' ? <>
                    <Checkbox label="Receive a text notification when your profile is approved" value={tutorApprovedSms} setter={setTutorApprovedSms} />
                    <Checkbox label="Receive a text notification when your profile is rejected" value={tutorRejectedSms} setter={setTutorRejectedSms} />
                    <Checkbox label="Receive a text notification when an admin has a question about your registration" value={registrationInquirySms} setter={setRegistrationInquirySms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your account information" value={moreRegInfoAccountSms} setter={setMoreRegInfoAccountSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your address" value={moreRegInfoAddressSms} setter={setMoreRegInfoAddressSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your subjects" value={moreRegInfoSubjectsSms} setter={setMoreRegInfoSubjectsSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your qualifications" value={moreRegInfoQualificationsSms} setter={setMoreRegInfoQualificationsSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your profile" value={moreRegInfoProfileSms} setter={setMoreRegInfoProfileSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your photos" value={moreRegInfoPhotosSms} setter={setMoreRegInfoPhotosSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your teaching documents" value={moreRegInfoDocumentsSms} setter={setMoreRegInfoDocumentsSms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your availability" value={moreRegInfoAvailabilitySms} setter={setMoreRegInfoAvailabilitySms} />
                    <Checkbox label="Receive a text notification when an admin requests revisions to your references" value={moreRegInfoReferencesSms} setter={setMoreRegInfoReferencesSms} />
                </> : null}
                
                {user.verified_tutor ? 
                    <>
                        <Checkbox label="Receive a text notification when one of your references is approved" value={referenceApprovedSms} setter={setReferenceApprovedSms} />
                        <Checkbox label="Receive a text notification when one of your references is rejected" value={referenceRejectedSms} setter={setReferenceRejectedSms} />
                        <Checkbox label="Receive a text notification when one of your references can't be contacted" value={referenceNoContactSms} setter={setReferenceNoContactSms} />
                    </>
                : null}

                <Checkbox label="Receive a text notification when one of your pending subjects is approved" value={subjectApprovedSms} setter={setSubjectApprovedSms} />
                <Checkbox label="Receive a text notification when one of your pending subjects is rejected" value={subjectRejectedSms} setter={setSubjectRejectedSms} />
                <Checkbox label="Receive a text notification when you receive a new review" value={reviewSubmittedSms} setter={setReviewSubmittedSms} />
            </> : null}
            */}

            <Row style={{marginTop: '36px', display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default Notifications
