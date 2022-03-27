import styled from 'styled-components'
import UserContext from './UserContext.js'
import Colours from './Config/Colours.js'
import Navigation from './Components/Navigation'
import Footer from './Components/Footer'
import Circle from './Components/Circle'
import { API, History, RingLoader, Toast } from './Components'
import { useEffect, useState, Suspense, lazy } from 'react'
import {
    Router,
    Switch,
    Route,
    useLocation
} from 'react-router-dom'
import UnreadMessageCountContext from './UnreadMessageCountContext.js'
import SubjectContext from './SubjectContext.js'
import zIndex from './Config/zIndex.js'

import 'react-toastify/dist/ReactToastify.css'
import './index.css'

// Lazy load pages to enable code splitting
// @see https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting
const Home = lazy(() => import('./Pages/Home'))
const Registration = lazy(() => import('./Pages/Registration'))
const ClientRegistration = lazy(() => import('./Pages/Registration/Client'))
const TutorRegistration = lazy(() => import('./Pages/Registration/Tutor'))
const TutorAddressRegistration = lazy(() => import('./Pages/Registration/Tutor/Address'))
const TutorSubjectsRegistration = lazy(() => import('./Pages/Registration/Tutor/Subjects'))
const TutorQualificationsRegistration = lazy(() => import('./Pages/Registration/Tutor/Qualifications'))
const TutorProfileRegistration = lazy(() => import('./Pages/Registration/Tutor/Profile'))
const TutorPhotosRegistration = lazy(() => import('./Pages/Registration/Tutor/Photos'))
const TutorDocumentsRegistration = lazy(() => import('./Pages/Registration/Tutor/Documents'))
const TutorAvailability = lazy(() => import('./Pages/Registration/Tutor/Availability'))
const TutorFinalizeRegistration = lazy(() => import('./Pages/Registration/Tutor/Finalize'))
const Login = lazy(() => import('./Pages/Login'))
const Profile = lazy(() => import('./Pages/User/Profile'))
const FindATutor = lazy(() => import('./Pages/FinaATutor'))
const Dashboard = lazy(() => import('./Pages/User/Dashboard'))
const ContactUs = lazy(() => import('./Pages/ContactUs'))
const Messages = lazy(() => import('./Pages/Messages'))
const AcceptReview = lazy(() => import('./Pages/User/Dashboard/Reviews/Accept'))
const RejectReview = lazy(() => import('./Pages/User/Dashboard/Reviews/Reject'))
const FAQs = lazy(() => import('./Pages/FAQs/index.js'))
const AboutUs = lazy(() => import('./Pages/AboutUs/index.js'))
const Admin = lazy(() => import('./Pages/Admin/index.js'))
const EscalateReview = lazy(() => import('./Pages/User/Dashboard/Reviews/Escalate/index.js'))
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword/index.js'))
const ResetPassword = lazy(() => import('./Pages/ResetPassword/index.js'))
const TermsAndConditions = lazy(() => import('./Pages/Terms/index.js'))
const Privacy = lazy(() => import('./Pages/Privacy/index.js'))
const TutorReferences = lazy(() => import('./Pages/Registration/Tutor/References/index.js'))
const StudentAddress = lazy(() => import('./Pages/Registration/Client/Address/index.js'))
const StudentProfile = lazy(() => import('./Pages/Registration/Client/Profile/index.js'))
const StudentFinalize = lazy(() => import('./Pages/Registration/Client/Finalize/index.js'))
const Help = lazy(() => import('./Pages/Help/index.js'))
const References = lazy(() => import('./Pages/Reference/index.js'))
const HowItworks = lazy(() => import('./Pages/HowItWorks/index.js'))

const Main = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    
`

const Content = styled.main`
    flex: 1;
    
    
    & #bgCircle1 {
        position: fixed;
        bottom: 336px;
        left: 0;
        transform: translateX(-80%);
        z-index: ${zIndex.behindBG};
    }

    & #bgCircle2 {
        position: fixed;
        bottom: 512px;
        right: 0;
        transform: translateX(80%);
        z-index: ${zIndex.behindBG};
    }
`

/** Used to set the colour of the two fixed background circles based on route */
const pageCircleColours = {
    "/": {colour: Colours.t300, opacity: .2},
    "/register": {colour: Colours.t300, opacity: .2},
    "/register-tutor": {colour: Colours.t050, opacity: 1},
    "/register-tutor-address": {colour: Colours.r050, opacity: 1},
    "/register-tutor-subjects": {colour: Colours.b050, opacity: 1},
    "/register-tutor-qualifications": {colour: Colours.t050, opacity: 1},
    "/register-tutor-profile": {colour: Colours.r050, opacity: 1},
    "/register-tutor-photos": {colour: Colours.b050, opacity: 1},
    "/register-tutor-documents": {colour: Colours.t050, opacity: 1},
    "default": {colour: Colours.r050, opacity: 1}
}

/**
 * Main application entrypoint
 */
function AppContent() {
    
    const [circleColour, setCircleColour] = useState(pageCircleColours.default)
    const location = useLocation()
    const [loading, setLoading] = useState(true)

    const [user, setUser] = useState(null)
    const userContext = {user, setUser}
    
    const [unreadMessageCount, setUnreadMessageCount] = useState(0)
    const messageContext = {unreadMessageCount, setUnreadMessageCount}

    const [subjects, setSubjects] = useState([])
    const [levels, setLevels] = useState([])
    const subjectContext = {
        subjects,
        levels,
        setSubjects,
        setLevels
    }

    const getSubjects = async () => {
        const response = await API.get('subjects')
        if (response && response.data) {
            setSubjects(response.data)
        }
    }

    const getLevels = async () => {
        const response = await API.get('subjects/levels')
        if (response && response.data) {
            setLevels(response.data)
        }
    }

    useEffect(() => {
        /** 
         * Get & set a CSRF token 
         * Required for safe communication with the API
         * @see https://owasp.org/www-community/attacks/csrf
         * */
        API.get('csrf-cookie').then(() => {

            // Get the users profile, if they're logged in
            API.get('me').then(response => {
                setUser(response.data)
                setLoading(false)
            }).catch(error => {
                setLoading(false)
            })
        })

        // Public routes can be fetched before setting the csrf
        getSubjects()
        getLevels()
    }, [])

    useEffect(() => {
        setCircleColour( pageCircleColours.hasOwnProperty(location.pathname) ? pageCircleColours[location.pathname] : pageCircleColours.default) 
    }, [location])

   return <UserContext.Provider value={userContext}>
       <UnreadMessageCountContext.Provider value={messageContext}>
           <SubjectContext.Provider value={subjectContext}>
                <UserContext.Consumer>
                    {context => <UnreadMessageCountContext.Consumer>{msgContext => <Navigation user={context.user} setUnreadMessageCount={msgContext.setUnreadMessageCount} />}</UnreadMessageCountContext.Consumer>}
                </UserContext.Consumer>
                    

                <Content>
                    <Circle width="276.16px" colour={circleColour.colour} id="bgCircle1" opacity={circleColour.opacity} />
                    <Circle width="276.16px" colour={circleColour.colour} id="bgCircle2" opacity={circleColour.opacity} />
                    
                    <Suspense fallback={<div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 79px)'}}><RingLoader colour={Colours.b500} /></div>}>
                        <Switch>
                            <Route path="/tutor/review/:id/approve">
                                <AcceptReview user={userContext.user} />
                            </Route>

                            <Route path="/tutor/review/:id/reject">
                                <RejectReview user={userContext.user} />
                            </Route>

                            <Route path="/tutor/review/:id/escalate">
                                <EscalateReview user={userContext.user} />
                            </Route>

                            <Route path="/admin">
                                <Admin />
                            </Route>

                            <Route path="/messages">
                                <Messages user={userContext.user} setUser={userContext.setUser} />
                            </Route>

                            <Route path="/reference/:uuid">
                                <References />
                            </Route>

                            <Route path="/privacy-policy">
                                <Privacy />
                            </Route>

                            <Route path="/terms-and-conditions">
                                <TermsAndConditions />
                            </Route>

                            <Route path="/how-it-works">
                                <HowItworks />
                            </Route>

                            <Route path="/about-us">
                                <AboutUs />
                            </Route>

                            <Route path="/faqs">
                                <FAQs />
                            </Route>

                            <Route path="/contact-us">
                                <ContactUs />
                            </Route>

                            <Route path="/dashboard">
                                <Dashboard />
                            </Route>

                            <Route path="/find-a-tutor">
                                <FindATutor />
                            </Route>

                            <Route path="/profile/:uuid?">
                                <Profile />
                            </Route>

                            <Route exact path="/sign-in">
                                <Login />
                            </Route>

                            <Route exact path="/forgot-password">
                                <ForgotPassword />
                            </Route>

                            <Route exact path="/reset-password/:uuid">
                                <ResetPassword />
                            </Route>

                            <Route exact path="/register-tutor-finalize">
                                <TutorFinalizeRegistration setUser={userContext.setUser} />
                            </Route>

                            <Route exact path="/register-tutor-references">
                                <TutorReferences />
                            </Route>

                            <Route exact path="/register-tutor-availability">
                                <TutorAvailability />
                            </Route>

                            <Route exact path="/register-tutor-documents">
                                <TutorDocumentsRegistration />
                            </Route>

                            <Route exact path="/register-tutor-photos">
                                <TutorPhotosRegistration />
                            </Route>

                            <Route exact path="/register-tutor-profile">
                                <TutorProfileRegistration />
                            </Route>

                            <Route exact path="/register-tutor-qualifications">
                                <TutorQualificationsRegistration />
                            </Route>

                            <Route exact path="/register-tutor-subjects">
                                <TutorSubjectsRegistration />
                            </Route>

                            <Route exact path="/register-tutor-address">
                                <TutorAddressRegistration />
                            </Route>

                            <Route exact path="/register-tutor">
                                <TutorRegistration />
                            </Route>

                            <Route exact path="/register-student">
                                <ClientRegistration />
                            </Route>

                            <Route exact path="/register-student-address">
                                <StudentAddress />
                            </Route>

                            <Route exact path="/register-student-profile">
                                <StudentProfile />
                            </Route>

                            <Route exact path="/register-student-finalize">
                                <StudentFinalize setUser={userContext.setUser} />
                            </Route>

                            <Route exact path="/register">
                                <Registration />
                            </Route>

                            <Route exact path="/become-a-tutor">
                                <Registration />
                            </Route>
                            
                            <Route path="/help">
                                <Help />
                            </Route>

                            <Route exact path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </Suspense>
                </Content>
                
                <Footer />
            </SubjectContext.Provider>
        </UnreadMessageCountContext.Provider>
   </UserContext.Provider>
}

function App() {

  return (
      <Main>
         <Router history={History}>
            <AppContent />
          </Router>
      </Main>
  )
}

export default App
