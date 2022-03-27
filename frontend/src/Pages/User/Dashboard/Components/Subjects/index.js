import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { API_URL } from '../../../../../Config/Network.js'
import { useState, useEffect } from 'react'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    SubjectTable,
    API
} from '../../../../../Components'
import Colours from '../../../../../Config/Colours.js'
import useWindowSize from '../../../../../Hooks/UseWindowSize/index.js'

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

function Subjects({user, setUser}) {
    
    const [subjects, setSubjects] = useState([])
    const [pendingSubjects, setPendingSubjects] = useState([])
    const [saving, setSaving] = useState(false)

    const windowSize = useWindowSize()

    useEffect(() => {
        if (!user || !user.subjects) { return }

        setSubjects(user.subjects.map(subject => ({
            subject: subject.id,
            level: subject.pivot.level,
            perHour: '£' + (
                (subject.pivot.in_person && subject.pivot.online) || subject.pivot.online ? subject.pivot.price_per_hour_online : subject.pivot.price_per_hour_in_person
            ) / 100,
            inPerson: subject.pivot.in_person,
            online: subject.pivot.online
        })))

        if (user.new_subjects) {
            const newSubjects = JSON.parse(user.new_subjects)
            setPendingSubjects(newSubjects.map(subject => ({
                subject: subject.subject_name,
                level: subject.level,
                perHour: '£' + (
                    (subject.in_person && subject.online) || subject.online ? subject.price_per_hour_online : subject.price_per_hour_in_person
                ) / 100,
                inPerson: subject.in_person,
                online: subject.online
            })))
        }
    }, [user.subjects])

    const save = async event => {

        setSaving(true)

        const subs = subjects.map(s => ({...s}))
        const newSubs = pendingSubjects.map(s => ({...s}))
        
        let postSubjects = subs.map(s => {
            if(parseInt(s.subject)) {
                s.subject_id = parseInt(s.subject)
            } else {
                s.subject_name = s.subject
            }
            delete s.subject

            if (s.online) {
                s.price_per_hour_online = parseInt(s.perHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')) * 100
            } 
            if (s.inPerson) {
                s.price_per_hour_in_person = parseInt(s.perHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')) * 100
            }
            
            delete s.perHour

            s.online = !!s.online 
            s.in_person = !!s.inPerson 
            delete s.inPerson 

            return s
        })

        postSubjects = [
            ...subs,
            ...newSubs.map(s => {
                s.subject_name = s.subject
                delete s.subject
    
                if (s.online) {
                    s.price_per_hour_online = parseInt(s.perHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')) * 100
                } 
                if (s.inPerson) {
                    s.price_per_hour_in_person = parseInt(s.perHour.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.')) * 100
                }
                
                delete s.perHour
    
                s.online = !!s.online 
                s.in_person = !!s.inPerson 
                delete s.inPerson 
    
                return s
            })
        ]

        try {
            const response = await API.post('tutor/profile/subjects', {
                subjects: postSubjects
            })

            if (response && response.data && response.data.success) {
                Toast.success("Successfully updated subjects")
                setUser({
                    ...user,
                    new_subjects: response.data.user.new_subjects,
                    subjects: response.data.user.subjects
                })
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error updating subjects, please try again.")
        }
        
        setSaving(false)
    }
    
    return <>
        <Helmet>
            <title>Subjects &amp; prices - Qualified Tutors</title>
        </Helmet>
        
        <Container>
            <h1>Subjects &amp; prices</h1>
            <p style={{marginBottom: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <SubjectTable subjects={subjects} setSubjects={setSubjects} mobile={windowSize.width < 720} />

            {pendingSubjects && pendingSubjects.length > 0 ? <>
                <h1 style={{marginTop: '36px'}}>Subjects pending approval</h1>
                <SubjectTable subjects={pendingSubjects} setSubjects={setPendingSubjects} readonly />
            </> : null}
            
            <Row style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300, display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button primary large disabled={saving} onClick={save}>SAVE</Button>
            </Row>
        </Container>
    </>
}

export default Subjects
