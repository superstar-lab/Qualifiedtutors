import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { useState, useEffect } from 'react'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    QualificationsTable,
    API
} from '../../../../../Components'
import Universities from '../../../../../Config/Universities.js'
import Grades from '../../../../../Config/Grades.js'
import Colours from '../../../../../Config/Colours'
import useWindowSize from '../../../../../Hooks/UseWindowSize'

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

function Qualifications({ user, setUser }) {
    
    const [uniQualifications, setUniQualifications] = useState([])
    const [otherQualifications, setOtherQualifications] = useState([])
    const [saving, setSaving] = useState(false)

    const windowSize = useWindowSize()

    useEffect(() => {
        if (!user || !user.qualifications) { return }

        const qualifications = JSON.parse(user.qualifications)
        const uniQs = []
        const otherQs = []
        for(const q of qualifications) {
            if (q.degree) {
                uniQs.push(q)
            }
            if (q.other) {
                otherQs.push(q)
            }
        }

        setUniQualifications(uniQs)
        setOtherQualifications(otherQs)
    }, [user])

    const save = async event => {
        setSaving(true)

        try {
            const response = await API.post('tutor/profile/qualifications', {
                qualifications: [
                    ...uniQualifications,
                    ...otherQualifications
                ]
            })

            if (response && response.data && response.data.success) {
                setUser({
                    ...user,
                    qualifications: response.data.user.qualifications
                })
                Toast.success("Successfully updated your qualifications.")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error saving your qualifications, please try again.")
        }

        setSaving(false)
    }

    return <>
        <Helmet>
            <title>Qualifications - Qualified Tutors</title>
        </Helmet>

        <Container>
            <h1>Qualifications</h1>
            <p style={{marginBottom: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <h2>University</h2>
            <QualificationsTable 
                qualifications={uniQualifications} 
                setQualifications={setUniQualifications} 
                institutions={Universities}
                instituionLabel="University"
                titleLabel="Course"
                grades={Grades}
                degree
                mobile={windowSize.width < 720}
            />

            <h2>Other</h2>
            <QualificationsTable 
                qualifications={otherQualifications}
                setQualifications={setOtherQualifications}
                instituionLabel="School"
                mobile={windowSize.width < 720}
            />

            <Row style={{paddingTop: '32px', marginTop: '32px', borderTop: '1px solid ' + Colours.n300, display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default Qualifications
