import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../Components/FixedWidth'
import Card from '../../../Components/Card'
import Link from '../../../Components/Link'
import UserContext from '../../../UserContext.js'
import TutorProfile from './Tutor'
import ClientProfile from './Client'
import AdminProfile from './Admin'
import { API, RingLoader } from '../../../Components'
import { Toast } from '../../../Components'
import { useEffect, useState } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import Colours from '../../../Config/Colours'

const Container = styled.div`
    margin: 48px 0;

    & .tutorPager {
        & img {
            height: 18px;
            position: relative;
            top: 3.5px;
        }
    }

    & .pagination-link, & .breadcrumb-link {
        &:hover {
            font-weight: bold;
        }
    }
`

const Row = styled.div`
    display: flex;
`

function Profile(props) {
    
    const history = useHistory()
    const location = useLocation()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { uuid } = useParams()
    const [tutors, setTutors] = useState([])
    const [breadcrumb, setBreadcrumb] = useState(null)

    useEffect(() => {
        if (location && location.state) {
            if (location.state.tutors) {
                setTutors(location.state.tutors)
            }
            console.log(location.state)
            if (location.state.breadcrumb) {
                setBreadcrumb(location.state.breadcrumb)
            }
        }


    }, [location])

    useEffect(() => {
        if (!uuid || (user && user.message_uuid == uuid)) { return }
        
        setLoading(true)

        API.get('tutor/' + uuid).then(response => {
            setUser(response.data)
            setLoading(false)
        }).catch(error => {
            Toast.error("Unexpected error occured trying to retrieve tutor profile. Refresh to try again.")
            setLoading(false)
        })
    }, [uuid])

    const tutorIndex = tutors.findIndex(t => t == uuid)

    return (<>
        <UserContext.Consumer>
            {context => {
                if (user || (location && location.state && location.state.tutors)) { return }

                if (uuid) {
                    API.get('tutor/' + uuid).then(response => {
                        setUser(response.data)
                        setLoading(false)
                    }).catch(error => {
                        Toast.error("Unexpected error occured trying to retrieve tutor profile. Refresh to try again.")
                        setLoading(false)
                    })
                } else {
                    if (!context.user) {
                        history.push('/')
                    } 
                    
                    setUser(context.user)
                    setLoading(false)
                }
            }}
        </UserContext.Consumer>

        <Container>
            {loading ? <RingLoader style={{position: 'fixed', top: '196px', left: '50%', transform: 'translateX(-50%)'}} colour={Colours.b500} /> : <>
                {breadcrumb ? <FixedWidth width="1300px"><Link className="breadcrumb-link" primary to={breadcrumb.to}><img alt="back" style={{position: 'relative', left: '-6px', top: '3px', width: '18px', height: '18px'}} src="/img/back-icon.svg" ></img>{breadcrumb.breadcrumb}</Link></FixedWidth> : null}
                
                {tutors.length > 0 ? <FixedWidth width="1300px"><Row className="tutorPager" style={{margin: '16px 0', justifyContent: 'space-between'}}>
                    <Link className="pagination-link" primary disabled={tutorIndex == 0} to={'/profile/' + (tutorIndex > 0 ? tutors[tutorIndex - 1] : '')}><img alt="previous" style={{marginRight: '4px'}} src="/img/left_arrow.svg" /> Previous tutor</Link>
                    <Link className="pagination-link" primary disabled={tutorIndex + 1 >= tutors.length} to={'/profile/' + (tutorIndex + 1 < tutors.length ? tutors[tutorIndex + 1] : '')}>Next tutor<img alt="next" style={{transform: 'rotate(180deg)', marginLeft: '4px'}} src="/img/left_arrow.svg" /> </Link>
                </Row></FixedWidth> : null}
                <FixedWidth width="1300px">
                    {user && user.role == "tutor"  ? <TutorProfile user={user} authedUser={user} /> : null}
                    {user && user.role == "admin"  ? <AdminProfile user={user} /> : null}
                    {user && user.role == "client" ? <ClientProfile user={user} /> : null}
                </FixedWidth>
            </>}
        </Container>
    </>)
}

export default Profile
