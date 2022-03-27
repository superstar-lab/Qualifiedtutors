import { useEffect, useState } from "react"
import {Helmet} from 'react-helmet'
import styled from "styled-components"
import { Card, FixedWidth, Link, RingLoader, API, Toast } from "../../../../../Components"
import UserIcon from "../../../../../Components/UserIcon"
import Colours from "../../../../../Config/Colours"

const Container = styled.div`
    & .overview {
        justify-content: space-between;
        margin-bottom: 32px;
        gap: 16px;

        & .card {
            padding: 32px;
            justify-content: center;
            display: flex;
            align-items: center;
            width: 180px;
            height: 180px;

            & img {
                height: 48px;
            }

            & h1 {
                margin: 16px 0;
                padding: 0;
                color: ${Colours.n500};
            }

            & p {
                margin: 0;
                padding: 0;
                color: ${Colours.n500};

                &.subtitle {
                    margin-top: 4px;
                    font-style: italic;
                    color: ${Colours.n600};
                }
            }
        }
    }

    & .profilepic {
        width: 256px;
        height: 256px;
        border-radius: 50%;
        object-fit: cover;
    }

    & .bio {
        gap: 16px;

        & b {
            min-width: 98px;
        }

        & p {
            margin: 0;
            padding-left: 16px;
        }
    }

    & .content {
        & a {
            position: absolute;
            top: 24px;
            right: 32px;
        }
    }

    @media screen and (max-width: 1360px) {
        & .overview {
            justify-content: center;
            gap: 16px;
        }
    }
`

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

function StudentDashboard({user}) {

    const [loadingConvoStats, setLoadingConvoStats] = useState(true)
    const [loadingReviewsSubmitted, setLoadingReviewsSubmitted] = useState(true)
    const [activeConvos, setActiveConvos] = useState(-1)
    const [unreadMessages, setUnreadMessages] = useState(-1)
    const [submittedReviews, setSubmittedReviews] = useState(-1)
    const [tutorsFavourited, setTutorsFavourited] = useState(-1)

    useEffect(() => {

        const getConvoStats = async () => {
            setLoadingConvoStats(true)
            try {
                const response = await API.get('user/messages/stats')
                if (response && response.data && response.data.success) {
                    setActiveConvos(response.data.total)
                    setUnreadMessages(response.data.unread)
  
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching conversation stats. Refresh to try again.")
            }
            setLoadingConvoStats(false)
        }

        const getReviewsSubmitted = async () => {
            setLoadingReviewsSubmitted(true)
            try {
                const response = await API.get('user/reviews/count')
                if (response && response.data && response.data.success) {
                    setSubmittedReviews(response.data.count)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching total reviews. Refresh to try again.")
            }
            setLoadingReviewsSubmitted(false)
        }
        
        getConvoStats()
        getReviewsSubmitted()
    }, [])

    useEffect(() => {
        if (!user) { return }

        const ft = user.favourite_tutors ? JSON.parse(user.favourite_tutors) : []

        setTutorsFavourited(ft.length)
    }, [user])

    return <>
        <Helmet>
            <title>Dashboard - Qualified Tutors</title>
        </Helmet>

        <Container>
                <FixedWidth>
                    <Row className="overview">
                        <Card>
                            <img alt="icon" src="/img/speech_fullsat.webp" />
                            <h1>{loadingConvoStats ? <Row style={{justifyContent: 'center'}}><RingLoader medium colour={Colours.b500} /></Row> : (unreadMessages == -1 ? 'N/A' : unreadMessages)}</h1>
                            <p>Unread Messages</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/person.webp" />
                            <h1>{loadingConvoStats ? <Row style={{justifyContent: 'center'}}><RingLoader medium colour={Colours.b500} /></Row> : (activeConvos == -1 ? 'N/A' : activeConvos)}</h1>
                            <p>Active Conversations</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/star_outline.svg" />
                            <h1>{tutorsFavourited}</h1>
                            <p>Tutors Favourited</p>
                        </Card>

                        <Card>
                            <img alt="icon" src="/img/subject_book.webp" />
                            <h1>{loadingReviewsSubmitted ? <Row style={{justifyContent: 'center'}}><RingLoader medium colour={Colours.b500} /></Row> : (submittedReviews == -1 ? 'N/A' : submittedReviews)}</h1>
                            <p>Reviews Submitted</p>
                        </Card>
                    </Row>

                    <Card className="content">
                        <Link danger to="/dashboard/personal-details">Edit</Link>

                        <Row style={{gap: '32px'}}>
                            <UserIcon user={user} size={256} />
                            <Column className="bio">
                                <Row> <b>Name:</b> <p>{user.name} {user.surname}</p> </Row>
                                <Row> <b>Address:</b> <p>{user.address_line_1}, {user.address_line_2 ? user.address_line_2 + ', ' : null} {user.city}, {user.postcode}</p> </Row>
                                <Row> <b>Mobile:</b> <p>{user.mobile_number}</p> </Row>
                                <Row> <b>Email:</b> <p>{user.email}</p> </Row>
                            </Column>
                        </Row>
                    </Card>
                </FixedWidth>
        </Container>
    </>
}

export default StudentDashboard