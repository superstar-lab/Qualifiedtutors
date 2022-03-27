import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import { useState, useEffect } from 'react'
import { API } from '../../../../../Components'
import UserContext from '../../../../../UserContext.js'
import Colours from '../../../../../Config/Colours'
import {
    Card,
    Toast,
    Input,
    Button,
    RingLoader,
    Checkbox,
    Link
} from '../../../../../Components'
import { useHistory } from 'react-router-dom'

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

function CloseAccount({user, setUser}) {
    
    const [confirm, setConfirm] = useState("")
    const history = useHistory()

    const closeAccount = async () => {

        try {
            const response = await API.post('user/close_account')
            if (response && response.data && response.data.success) {
                history.push('/')
                setUser(null)
                Toast.success("Your account has been closed successfully.")
            }
        } catch (error) {
            Toast.error("Unexpected error closing account, please try again.")
        }
    }

    return <>
        <Helmet>
            <title>Availability - Qualified Tutors</title>
        </Helmet>
        
        <Container>
            <h1>Close account</h1>

            <p>By closing your account your login will no longer function, no users will be able to find or contact you through the platform and we will no longer send you notifications of any kind. <b>This process is permanant and irreversible.</b></p>
            <p>If you instead wish to suspend your account temporarily see <Link primary to="/dashboard/deactivate-account"><img style={{width: '14px', height: '14px', position: 'relative', top: '1px'}} src="/img/back-icon.svg" /> Deactivate Account</Link>.</p>
            <p>To close your account type <b>confirm account closure</b> in the text box below and press CLOSE ACCOUNT.</p>
            <Input value={confirm} onChange={e => setConfirm(e.target.value)} />

            <Row style={{marginTop: '36px', display: 'flex', justifyContent: 'space-between'}}>
                <div />
                <Button danger large disabled={confirm.trim().toLowerCase() != "confirm account closure"} onClick={closeAccount}>CLOSE ACCOUNT</Button>
            </Row>
        </Container>
    </>
}

export default CloseAccount
