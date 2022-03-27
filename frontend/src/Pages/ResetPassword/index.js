import { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import styled from "styled-components"
import {Helmet} from "react-helmet"
import { API, Button, Card, FixedWidth, Input, RingLoader, Toast, Underline } from "../../Components"

const Container = styled.div`
margin-top: 64px;
    margin-bottom: 64px;

    h1 {
        font-size: 48px;
        margin-bottom: 64px;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

/**
 * Reset password form
 */
function ResetPassword() {

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const history = useHistory()
    const params = useParams()

    const submit = async () => {

        setLoading(true)

        try {
            const response = await API.post('user/reset_password', {
                new_password: newPassword,
                token: params.uuid
            })

            if (response && response.data && response.data.success) {
                history.push('/sign-in')
                Toast.success("Your password has been reset. Please sign in.")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error resetting your password. Please try again.")
        }

        setLoading(false)
    }

    return <>
        <Helmet>
            <title>Reset password - Qualified Tutors</title>
        </Helmet>

        <Container>
            <FixedWidth width="720px">
                <h1>Reset your pass<Underline>word.</Underline></h1>

                <Card>
                    <Input type="password" label="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <Input type="password" label="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                    <Row>
                        <div></div>
                        <Button primary large onClick={submit} style={{marginTop: '24px'}}>{loading ? <RingLoader small /> : 'Submit'}</Button>                
                    </Row>
                </Card>
            </FixedWidth>
        </Container>
    </>
}

export default ResetPassword