import { useEffect, useState } from "react"
import {Helmet} from "react-helmet"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { API, RingLoader, Toast } from "../../../Components"
import TutorProfile from "../../User/Profile/Tutor"

const Container = styled.div`
    & .profile {
        margin: -64px;
    }

    & .card, & ._card {
        border: 0;
        box-shadow: none;
    }
`

/**
 * Displays the TutorProfile component is its review state
 * 
 * @param uuid  String  Tutor message_uuid
 */
function TutorReview(props) {

    const [loading, setLoading] = useState(true)
    const [tutor, setTutor] = useState(null)
    const params = useParams()

    useEffect(() => {
        const getTutor = async () => {
            try {
                const response = await API.get('admin/tutor/' + params.uuid)
                if (response && response.data) {
                    setTutor(response.data)
                    setLoading(false)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch(error) {
                Toast.error("Unexpected error fetching tutor profile. Refresh to try again.")
            }
        }

        if (!params || !params.uuid) { return }

        getTutor()
    }, [params])

    return <Container>
        {!loading ? <TutorProfile user={tutor} setUser={props.setUser} review /> : <RingLoader />}
    </Container>
}

export default TutorReview