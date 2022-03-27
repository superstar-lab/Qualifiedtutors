import styled from 'styled-components'
import { useEffect, useState } from 'react'
import {
    Card,
    Input,
    Button,
    RingLoader,
    Toast,
    API,
    Dropdown
} from '../../../../../Components'
import Colours from '../../../../../Config/Colours'

const Container = styled.div`
 & ._card {
     padding-left: 24px; 
     padding-right: 24px;
 }

& .msgbox {
    height: 191px;
    border: 2px solid ${Colours.n300};
}
`

const Row = styled.div`
    display: flex;
`

const Label = styled.div`
    color: #1e90ff;
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`

const Stars = styled.div`
    margin-left: 8px;

    & img {
        margin-right: 10px;
        width: 24px;
    }

    & img:last-of-type {
        margin-right: 0;
    }

    margin-bottom: 16px;
`   

function ReviewUser({user, authedUser}) {

    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState("")
    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedLevel, setSelectedLevel] = useState(null)

    const submitReview = async () => {
        try {
            setLoading(true)
            const response = await API.post('tutor/review/' + user.message_uuid, {
                review: message,
                rating,
                subject_id: selectedSubject,
                level: selectedLevel
            })

            if (response && response.data && response.data.success) {
                Toast.success("Your review has been submitted")
                setMessage("")
                setSelectedSubject(null)
                setSelectedLevel(null)
                setRating(0)
            } else {
                Toast.error("An unexpected error occured submitting your review, please try again.")    
            }
            setLoading(false)
        } catch(error) {
            Toast.error(
                error && error.response && error.response.data && error.response.data.error ? 
                    error.response.data.error 
                  : "An unexpected error occured submitting your review, please try again."
            )
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) { return }

        const subs = []
        const lvls = []

        for(const s of user.subjects) {
            if (!subs.find(sub => sub.subject == s.subject)) {
                subs.push(s)
            }
            
            if (!lvls.includes(s.pivot.level)) {
                lvls.push(s.pivot.level)
            }

            setSubjects(subs)
            setLevels(lvls)
        }
    }, [user])

    return <Container className='review-card'>
        <Card className="_card">
            <h1>Review {user.name}</h1>

            <Label>Rating</Label>
            <Row>
                <Stars>
                    {Array.from({length: 5}).map((v, i) => i + 1 <= rating ? <img alt="full star" src="/img/star_fill.svg" style={{cursor: 'pointer'}} onClick={e => setRating(i + 1)} /> : <img alt="empty star" src="/img/star_outline.svg" style={{cursor: 'pointer'}} onClick={e => setRating(i + 1)} />)}
                </Stars>
            </Row>

            
                <Dropdown
                    label="Subject"
                    style={{flex: 1, marginBottom: '8px'}}
                    selected={selectedSubject !== null ? subjects.find(s => s.id == selectedSubject).subject : ""}
                    onChange={(v, n) => setSelectedSubject(n.key)}

                >
                    {subjects.map(s => <div key={s.id}>{s.subject}</div>)}
                </Dropdown>
            
                <Dropdown
                    label="Level"
                    style={{flex: 1, marginBottom: '16px'}}
                    selected={selectedLevel}
                    onChange={v => setSelectedLevel(v)}
                >
                    {levels.map(l => <div key={l}>{l}</div>)}
                </Dropdown>    

            

            <Input className="msgbox" text placeholder="" value={message} onChange={e => setMessage(e.target.value)} />
            
            <Row style={{justifyContent: 'space-between'}}>
                <div></div>
                <Button primary onClick={submitReview} disabled={!rating || !message || !selectedSubject || !selectedLevel}>{loading ? <RingLoader small /> : 'Submit'}</Button>
            </Row>
        </Card>
    </Container>
}

export default ReviewUser