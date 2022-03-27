import { useState } from 'react'
import {Helmet} from "react-helmet"
import styled from 'styled-components'
import { API, Button, Card, FixedWidth, Input, RingLoader, Toast, Underline } from '../../Components'
import Colours from '../../Config/Colours'

const Container = styled.div`
    margin-top: 64px;
    margin-bottom: 64px;

    h1 {
        font-size: 48px;
        margin-bottom: 64px;
    }

    & .fixedWidth {
        padding: 0 32px;
    }

    & p {
        color: ${Colours.n500};
        font-size: 16px;
        line-height: calc(16px * 1.5);
    }

    @media screen and (max-width: 640px) {
        & .fixedWidth {
            padding: 0 16px;
        }

        & .card {
            padding: 32px;
        }

        h1 {
            margin: 0 0 24px 0;
        }

        margin-top: 32px;
        margin-bottom: 32px;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

/**
 * Forgot password page
 * 
 * API will always return success, even if the email is recognized to avoid scraping
 */
function ForgotPassword(props) {

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [loading, setLoading] = useState(false)

    const submit = async () => {

        setLoading(true)
        try {
            const response = await API.post('user/forgot_password', {
                email
            })

            if (response && response.data && response.data.success) {
                Toast.success("Check your email for a link to reset your password.")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error occured, please try again.")
        }

        setLoading(false)
    }

    return <>
        <Helmet>
            <title>Forgot password - Qualified Tutors</title>
        </Helmet>
        
        <Container>
            <FixedWidth width="720px">
                <h1>Forgot your pass<Underline>word.</Underline></h1>

                <Card>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    
                    <Row>
                        <div></div>
                        <Button primary large onClick={submit} style={{marginTop: '24px'}}>{loading ? <RingLoader small /> : 'Submit'}</Button>                
                    </Row>
                </Card>
            </FixedWidth>
        </Container>
    </>
}

export default ForgotPassword