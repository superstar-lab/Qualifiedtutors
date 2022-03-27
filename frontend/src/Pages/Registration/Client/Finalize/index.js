import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/StudentProgress'
import Dropdown from '../../../../Components/Dropdown'
import Checkbox from '../../../../Components/Checkbox'
import Input from '../../../../Components/Input'
import FileMultiUpload from '../../../../Components/FileMultiUpload'
import RingLoader from '../../../../Components/Loader/Ring'
import Underline from '../../../../Components/Underline'
import { API } from '../../../../Components/API'
import Colours from '../../../../Config/Colours.js'
import CircleSVG from '../../../../Components/Circle'
import { toast } from 'react-toastify'
import { useLocation, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Table, Head, Heading, Body, Row, Col } from '../../../../Components/Table'

const Container = styled.div`
    margin: 64px;
    color: ${Colours.n500};

    & > h1 {
        color: ${Colours.n200};
        font-size: 48px;
        margin-bottom: 80px;
        white-space: nowrap;
        display: flex;
    }

    & h2, & p {
        position: relative;
    }

    & h2 {
        font-size: 28.8px;
        color: ${Colours.n200};
        text-align: center;
        margin: 0 !important;
        padding: 0;
    }

    & p {
        font-size: 22.4px;
        line-height: 32px;
        color: ${Colours.n200};
        text-align: center;
    }

    & ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        & li {
            color: ${Colours.n500};
            line-height: 32px;
            & img {
                position: relative;
                height: 20px;
                width: 20px;
                top: 4px;
                left: -5.28px;
                margin-right: 8px;
            }
        }        
    }

    & .circleSVG {
        position: absolute;
        top: 32px;
        right: 32px;
    }

    @media screen and (max-width: 800px) {
        margin: 32px;
    }

    @media screen and (max-width: 720px) {
        margin: 16px;

        & .card {
            padding: 32px 32px 64px 32px;
        }
    }

    @media screen and (max-width: 480px) {
        .acceptBtn {
            font-size: 16px;
            padding: 16px 18px;
        }
    }

    @media screen and (max-width: 400px) {
        & .card {
            padding: 16px 16px 32px 16px;
        }
    }
`
const Split = styled.div`
    display: flex;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Circle = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${Colours.b500};
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ErrorContainer = styled.div`
    color: ${Colours.r400};
    margin-top: -24px;

    & img {
        position: relative;
        width: 12.8px;
    }
`
const Counter = styled.div`
   padding: 24px 0 16px 0;
   color: ${Colours.b500};

   & img {
        position: relative;
        top: 3.2px;
   }
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`

function StudentFinalize(props) {
   
    const history = useHistory()
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [incompleteAccount, setIncompleteAccount] = useState(false)
    const [incompleteAddress, setIncompleteAddress] = useState(false)
    const [incompleteProfile, setIncompleteProfile] = useState(false)

    const submit = async (event) => {
        
        event.preventDefault()
        let reg = JSON.parse(window.localStorage.getItem('registration'))
        if (!reg) { reg = {student: {}}}
        if (!reg.student) { reg.student = {} }

        setLoading(true)

        const data = {}
        const addToData = (key, regKey, datamapper) => {
            if (reg.student.hasOwnProperty(regKey) && reg.student[regKey]) {
                if (!datamapper) {
                    data[key] = reg.student[regKey]
                } else {
                    data[key] = reg.student[regKey].map(datamapper)
                }
                
            }
        }

        addToData('name', 'name')
        addToData('surname', 'surname')
        addToData('gender', 'gender')
        addToData('email', 'email')
        addToData('password', 'password')
        addToData('accept_tos', 'acceptTos')
        addToData('address_line_1', 'addressLine1')
        addToData('address_line_2', 'addressLine2')
        addToData('city', 'city')
        addToData('county', 'county')
        addToData('mobile_number', 'mobileNumber')
        addToData('postcode', 'postcode')
        addToData('profile_image', 'profileImgUrl')

        try {
            const response = await API.post("register/client", data)
            
            if (response && response.data && response.data.success) {
                window.localStorage.removeItem('registration')
                props.setUser(response.data.user)
                history.push('/dashboard')
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            if (error.response.data.errors && error.response.data.errors.email) {
                toast.error(error.response.data.errors.email)
            } else {
                toast.error("An unexpected error occured, please try again.")
            }
        }

        setLoading(false)
    }

    const back = event => {
        event.preventDefault()

        history.push('/register-student-profile', {
            progress: {
                ...location.state.progress,
                complete: 3,
                current: 'profile'
            }
        })
    }

    useEffect(() => {
        const reg = JSON.parse(window.localStorage.getItem('registration'))
        
        if (
            !reg.student.email ||
            !reg.student.password ||
            !reg.student.acceptTos
        ) {
            setIncompleteAccount(true)
        }
        /*
        if (
            !reg.student.addressLine1 ||
            !reg.student.city || 
            !reg.student.postcode
        ) {
            setIncompleteAddress(true)
        }

        if (!reg.student.profileImgUrl || !reg.student.gender) {
            setIncompleteProfile(true)
        }
        */

    }, [])

    const gotoAccountInfo = event => {
        event.preventDefault()

        history.push('/register-student', {
            progress: {
                ...location.state.progress,
                complete: 1,
                current: 'info'
            } 
        })
    }

    const gotoAddress = event => {
        event.preventDefault()

        history.push('/register-student-address', {
            progress: {
                ...location.state.progress,
                complete: 2,
                current: 'address'
            } 
        })
    }

    const gotoProfile = event => {
        event.preventDefault()

        history.push('/register-student-profile', {
            progress: {
                ...location.state.progress,
                complete: 3,
                current: 'profile'
            } 
        })
    }

    return (<>
        <Helmet>
            <title>Finish - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1>Finish. <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    {!incompleteAddress && !incompleteAccount && !incompleteProfile ? <>
                        <h2>Well done!</h2>
                        <h2>You've completed the sign up process.</h2>

                        <p style={{marginTop: '16px'}}>After you press submit, you will be<br />taken to your <Underline offset="-12px">dashboard</Underline> page.</p>
                        <p>You can edit, delete or add anything<br />from your account section at any time.</p>
                    </> : <>
                        <h2>Registration Incomplete</h2>

                        <p style={{marginTop: '16px'}}>Your registration is incomplete. Please go back and complete the following steps:</p>
                        <ul>
                            {incompleteAccount ? <Link onClick={gotoAccountInfo}>Account Information</Link> : null}
                            {incompleteAddress ? <Link onClick={gotoAddress}>Address</Link> : null}
                            {incompleteProfile ? <Link onClick={gotoProfile}>Your Profile</Link> : null}
                        </ul>
                    </>}
                    
                    <hr />

                    <Split style={{marginTop: '16px', paddingTop: '96px', justifyContent: 'space-between', borderTop: '1px solid #E0E0E0'}}>
                        <div>
                            <Link onClick={back} style={{display: 'flex'}}>
                                {loading ? <RingLoader small /> : <><img alt="back" style={{width: '14px', height: '14px', position: 'relative', top: '1.6px'}} src="/img/back-icon.svg" />&nbsp; Back</>}
                            </Link>
                        </div>

                        <div>
                            <Link disabled={incompleteAccount || incompleteAddress || incompleteProfile} primary btn  
                                onClick={submit}>{loading ? <RingLoader small /> : 'SUBMIT'}</Link>
                        </div>
                    </Split>

                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default StudentFinalize
