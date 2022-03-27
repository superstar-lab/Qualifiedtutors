import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { API } from '../../../../../Components'
import { useState, useEffect } from 'react'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    TutorAvailability
} from '../../../../../Components'
import Colours from '../../../../../Config/Colours'

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

function Availability({user, setUser}) {
    
    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false],
        night: [false, false, false, false, false, false, false],
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user.weekly_availability) {
            setAvailability(JSON.parse(user.weekly_availability))
        }
    }, user)

    const save = async event => {
        setSaving(true)

        try {
            const response = await API.post('tutor/profile/availability', {
                weekly_availability: availability
            })

            if (response && response.data && response.data.success) {
                setUser({
                    ...user,
                    weekly_availability: response.data.user.weekly_availability
                })
                Toast.success("Successfully updated availability.")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch(error) {
            Toast.error("Unexpected error while saving availability, please try again.")
        }

        setSaving(false)
    }

    return <>
        <Helmet>
            <title>Availability - Qualified Tutors</title>
        </Helmet>

        <Container>
            <h1>Availability</h1>
            <p style={{marginBottom: '16px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

            <TutorAvailability availability={availability} setAvailability={setAvailability} />

            <Row style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300, display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default Availability
