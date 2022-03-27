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

function RejectReview() {

    const params = useParams()
    const [message, setMessage] = useState("")
    const history = useHistory()

    const rejectReview = async id => {
        try {
            const response = await API.post('tutor/review/reject/' + id, {
                message
            })
            if (response && response.data && response.data.success) {
                Toast.success("Successfully declined review")
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
                <Input text label="Reason for refuting review" value={message} onChange={e => setMessage(e.target.value)} />

                <Row>
                    <div></div>
                    <Button primary disabled={!message} onClick={e => rejectReview(params.id)}>Submit</Button>
                </Row>
            </Card>
        </FixedWidth>
    </Container>
}

export default RejectReview