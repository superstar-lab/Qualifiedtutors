import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { API } from '../../../../../Components'
import { useState, useEffect } from 'react'
import UserContext from '../../../../../UserContext.js'
import Colours from '../../../../../Config/Colours'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    Toggle
} from '../../../../../Components'

const Container = styled.div`
    & h2 {
        margin-top: 0;
    }

    & h3 {
        margin: 0;
    }

    & p {
        color: ${Colours.n500};
        line-height: 24px;
    }

    & ul {
        color: ${Colours.n500};
        line-height: 24px;
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

function DeactivateAccount({user}) {
    
    const [enabled, setEnabled] = useState(user.enabled)
    const [saving, setSaving] = useState(false)

    const save = async event => {
        setSaving(true)

        try {
            const response = await API.post('user/profile/enable', {
                enabled
            })

            if (response && response.data && response.data.success) {
                Toast.success("Successfully " + (enabled ? 'activated' : 'deactivated') + ' your account')
            } else {
                throw new Error("Unexpected API error")
            } 
        } catch(error) {
            Toast.error("Unexpected error setting activation status, please try again")
        }

        setSaving(false)
    }

    return <>
        <Helmet>
            <title>Deactivate account - Qualified Tutors</title>
        </Helmet>
        
        <Container>
            <h1>Deactivate account</h1>
            <p>To supress your profile from the tutor search results use the toggle below.</p>

            <Toggle value={enabled} setter={setEnabled} label={enabled ? 'Active' : 'Inactive'} />

            <Row style={{marginTop: '36px', display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
            </Row>
        </Container>
    </>
}

export default DeactivateAccount
