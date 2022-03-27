import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import styled from "styled-components"
import { API, Button, FixedWidth, Input, Toast, Card } from "../../../../../Components"

const Container = styled.div`
    margin-top: 48px;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

function EscalateReview() {

    const params = useParams()
    const [message, setMessage] = useState("")
    const history = useHistory()

    const escalateReview = async id => {
        try {
            const response = await API.post('tutor/review/escalate/' + id, {
                message
            })
            if (response && response.data && response.data.success) {
                Toast.success("Successfully escalated review")
                history.push('/')
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error updating review. Please try again.")
        }
    }

    return <Container>
        <FixedWidth>
            <Card>
                <Input text label="Reason for escalating review" value={message} onChange={e => setMessage(e.target.value)} />

                <Row>
                    <div></div>
                    <Button primary disabled={!message} onClick={e => escalateReview(params.id)}>Submit</Button>
                </Row>
            </Card>
        </FixedWidth>
    </Container>
}

export default EscalateReview