import styled from 'styled-components'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import {
    Toast,
    Card,
    FixedWidth,
    Accordion
} from '../../../Components'
import {
    PersonalDetails,
    Notifications,
    Subjects,
    Availability,
    Qualifications,
    DeactivateAccount,
    CloseAccount,
    Profile,
    Photos,
    Documents,
    References
} from './Components'
import UserContext from '../../../UserContext.js'
import StudentDashboard from './Components/StudentDashboard'
import TutorDashboard from './Components/TutorDashboard'
import FavouriteTutors from './Components/FavouriteTutors'
import UnreadMessageCountContext from '../../../UnreadMessageCountContext'
import Messages from '../../Messages'

const Container = styled.div`
    padding: 40px 16px;

    & h1 {
        margin-top: 0;
    }

    @media screen and (max-width: 640px) {
        & .content-card {
            padding: 32px;
        }
    }

    @media screen and (max-width: 980px) {
        & .mainrow {
            flex-direction: column;
        }

        & .navigation {
            margin-bottom: 32px;
            min-width: unset !important;
            margin-right: unset !important;
        }

        & .contentColumn {
            & .content {
                padding: 32px;

                & .profilepic {
                    position: relative;
                    left: -16px;
                }
            }
        }
    }
`

const Row = styled.div`
    display: flex;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;

    &.navigation {
        min-width: 300px;
        margin-right: 36px;

        & .card {
            padding: 0;
            position: sticky;
            top: 96px;
        }
    }

    &.contentColumn {
        flex: 1;
        
    }
`

function Dashboard(props) {
    
    return <UserContext.Consumer>
        {context => 
            <UnreadMessageCountContext.Consumer>{msgContext => 
                <FixedWidth> 
                    <Container>
                        <Row className='mainrow'>
                            <Column className="navigation">
                                <Card>
                                    <Accordion>
                                        {context.user.role == 'client' || context.user.role == 'tutor' ? <li data-to="/dashboard"><div>Dashboard</div></li> : null}
                                        <li data-to="/dashboard/messages"><div>Messages ({msgContext.unreadMessageCount})</div></li>
                                        <li><div>Account settings</div>
                                            <ul>
                                                <li data-to="/dashboard/personal-details"><div>Personal details</div></li>
                                                <li data-to="/dashboard/notifications"><div>Notifications</div></li>
                                                {context.user.role == 'client' ? <li data-to="/dashboard/favourites"><div>Favourites</div></li> : null}
                                                <li data-to="/dashboard/deactivate-account"><div>Deactivate account</div></li>
                                                <li data-to="/dashboard/close-account"><div>Close account</div></li>
                                            </ul>
                                        </li> 
                                        {context.user.role == 'tutor' ? <li><div>Tutor profile</div>
                                            <ul>
                                                <li data-to="/dashboard/subjects"><div>Subjects &amp; prices</div></li>
                                                <li data-to="/dashboard/availability"><div>Availability</div></li>
                                                <li data-to="/dashboard/qualifications"><div>Qualifications</div></li>
                                                <li data-to="/dashboard/profile"><div>Profile</div></li>
                                                <li data-to="/dashboard/photos"><div>Photos &amp; video</div></li>
                                                <li data-to="/dashboard/documents"><div>Verification documents</div></li>
                                                <li data-to="/dashboard/references"><div>References</div></li>
                                            </ul>
                                        </li> : null}
                                    </Accordion>
                                </Card>
                            </Column>

                            <Column className="contentColumn">
                                
                                    <Route path="/dashboard/personal-details">
                                        <Card className="content-card">
                                            <PersonalDetails user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/notifications">
                                        <Card className="content-card">
                                            <Notifications user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/deactivate-account">
                                        <Card className="content-card">
                                            <DeactivateAccount user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/close-account">
                                        <Card className="content-card">
                                            <CloseAccount user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/favourites">
                                        <FavouriteTutors />
                                    </Route>

                                    <Route path="/dashboard/messages">
                                        <Messages user={context.user} setUser={context.setUser} style={{marginTop: '0px'}} />
                                    </Route>

                                    <Route path="/dashboard/subjects">
                                        <Card className="content-card">
                                            <Subjects user={context.user} setUser={context.setUser} />    
                                        </Card>
                                    </Route>
                                    
                                    <Route path="/dashboard/availability">
                                        <Card className="content-card">
                                            <Availability user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/qualifications">
                                        <Card className="content-card">
                                            <Qualifications user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/profile">
                                        <Card className="content-card">
                                            <Profile user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/photos">
                                        <Card className="content-card">
                                            <Photos user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/documents">
                                        <Card className="content-card">
                                            <Documents user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route path="/dashboard/references">
                                        <Card className="content-card">  
                                            <References user={context.user} setUser={context.setUser} />
                                        </Card>
                                    </Route>

                                    <Route exact path="/dashboard">
                                        {context.user && context.user.role == 'client' ? <StudentDashboard user={context.user} /> : null}
                                        {context.user && context.user.role == 'tutor' ? <TutorDashboard user={context.user} setUser={context.setUser} /> : null}
                                    </Route>
                                
                            </Column>
                        </Row>
                    </Container>
                </FixedWidth>
            }
            </UnreadMessageCountContext.Consumer>
        }
    </UserContext.Consumer>
}

export default Dashboard
