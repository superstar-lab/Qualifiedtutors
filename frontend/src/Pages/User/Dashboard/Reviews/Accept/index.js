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

function AcceptReview() {

    const params = useParams()
    const [message, setMessage] = useState("")
    const history = useHistory()

    const approveReview = async id => {
        try {
            const response = await API.post('tutor/review/approve/' + id, {
                message
            })
            if (response && response.data && response.data.success) {
                Toast.success("Successfully accepted review")
                history.push('/')
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error updating review. Please try again.")
        }
    }

    useEffect(() => {
        if (params && params.id) {
            approveReview(params.id)
        }
    }, [params])

    return <Container>
       
    </Container>
}

export default AcceptReview