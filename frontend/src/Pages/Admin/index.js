import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { Accordion, Card, FixedWidth } from '../../Components'
import UserContext from '../../UserContext'
import ManageUsers from './ManageUsers'
import Overview from './Overview'
import PendingSubjects from './PendingSubjects'
import ReviewDisputes from './ReviewDisputes'
import PendingTutors from './PendingTutors'
import TutorReview from './TutorReview'
import ManageSubjects from './ManageSubjects'
import PendingStudents from './PendingStudents'
import NewUser from './NewUser'
import PendingTutorVerifications from './PendingTutorVerifications'
import ManageFAQs from './FAQs'

const Container = styled.div`
    display: flex;
    padding: 40px 16px;
    
    & h1 {
        margin-top: 0;
    }
    
    & .navigation {
        max-width: 300px;
        padding: 0;
        margin-right: 36px;
        position: sticky;
        top: 96px;
        flex: 1;
    }

    & .content {
        flex: 1;
    }
`

const Row = styled.div`
    display: flex;
    flex: 1;
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

    &.content {
        flex: 1;
        
    }
`

/**
 * Administrative pages
 * 
 * Allows admins to access a number of admin specific site functions
 */
function Admin(props) {

    return <UserContext.Consumer>
    {context => (
        <FixedWidth>
            <Container>
                <Row>
                    <Column className="navigation">
                        <Card >
                            <Accordion>
                                <li><div>General</div>
                                    <ul>
                                        <li data-to="/admin/overview"><div>Overview</div></li>
                                        <li data-to="/admin/manage-users"><div>Manage Users</div></li>
                                        <li data-to="/admin/manage-subjects"><div>Manage Subjects</div></li>
                                        <li data-to="/admin/manage-faqs"><div>Manage FAQs</div></li>
                                    </ul>
                                </li> 
                                <li><div>Tutor Admin.</div>
                                    <ul>
                                        <li data-to="/admin/pending-tutor-registrations"><div>Pending Registrations</div></li>
                                        <li data-to="/admin/pending-tutor-verifications"><div>Pending Background Check</div></li>
                                        <li data-to="/admin/pending-subjects"><div>Pending Subjects</div></li>
                                    </ul>
                                </li>
                                <li><div>Student Admin.</div>
                                    <ul>
                                        <li data-to="/admin/pending-student-registrations"><div>Pending Registrations</div></li>
                                        <li data-to="/admin/review-disputes"><div>Review Disputes</div></li>
                                    </ul>
                                </li>
                            </Accordion>
                        </Card>
                    </Column>

                    <Column className="content">
                        <Card >
                            <Route path="/admin/overview">
                                <Overview user={context.user} />
                            </Route>

                            <Route path="/admin/manage-users">
                                <ManageUsers user={context.user} setUser={context.setUser} />
                            </Route>

                            <Route path="/admin/manage-subjects">
                                <ManageSubjects user={context.user} setUser={context.setUser} />
                            </Route>

                            <Route path="/admin/new-user">
                                <NewUser user={context.user} />
                            </Route>

                            <Route exact path="/admin/pending-tutor-registrations">
                                <PendingTutors user={context.user} />
                            </Route>

                            <Route exact path="/admin/pending-tutor-verifications">
                                <PendingTutorVerifications user={context.user} />
                            </Route>

                            <Route path="/admin/pending-tutor-registrations/:uuid">
                                <TutorReview setUser={context.setUser} />
                            </Route>

                            <Route exact path="/admin/pending-student-registrations">
                                <PendingStudents user={context.user} />
                            </Route>

                            <Route path="/admin/review-disputes">
                                <ReviewDisputes user={context.user} setUser={context.setUser} />
                            </Route>

                            <Route path="/admin/pending-subjects">
                                <PendingSubjects user={context.user} />
                            </Route>

                            <Route path="/admin/manage-faqs">
                                <ManageFAQs user={context.user} />
                            </Route>
                        </Card>
                    </Column>
                </Row>
            </Container>
        </FixedWidth>
    )}    
    </UserContext.Consumer>
}

export default Admin