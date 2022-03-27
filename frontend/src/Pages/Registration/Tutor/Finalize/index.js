import styled from 'styled-components'
import {Helmet} from "react-helmet"
import FixedWidth from '../../../../Components/FixedWidth'
import Card from '../../../../Components/Card'
import Link from '../../../../Components/Link'
import Progress from '../Components/Progress'
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

        & #save-draft-link {
            margin-right: 16px !important;
            font-size: 16px !important;
        }

        #controls {
            padding-top: 64px !important;
        }
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

        #submit-link {
            font-size: 16px;
            padding: 10px;
        }

        #controls {
            padding-top: 32px !important;
        }
    }

    @media screen and (max-width: 400px) {
        & .card {
            padding: 16px 16px 32px 16px;
        }

        h1 {
            margin-bottom: 18px;
        }

        & #save-draft-link {
            font-size: 14px !important;
            margin-right: 8px !important;
        }

        #back-link {
            font-size: 14px;

            & img {
                margin-right: -4px;
            }
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

function Finalize(props) {
   
    const history = useHistory()
    const location = useLocation()

    const [loading, setLoading] = useState(false)
    const [incomplete, setIncomplete] = useState(false)

    const submit = async (draft, event) => {
        
        event.preventDefault()
        const reg = JSON.parse(window.localStorage.getItem('registration'))
        setLoading(true)

        const data = {}
        const addToData = (key, regKey, datamapper) => {
            if (reg.hasOwnProperty(regKey) && reg[regKey]) {
                if (!datamapper) {
                    data[key] = reg[regKey]
                } else {
                    data[key] = reg[regKey].map(datamapper)
                }
                
            }
        }

        data.draft = draft
        //addToData('tutor_type', 'userType')
        data.tutor_type = reg.areYouTeacher ? 'teacher' : 'tutor'
        addToData('name', 'firstName')
        addToData('surname', 'lastName')
        addToData('gender', 'gender')
        addToData('email', 'email')
        addToData('password', 'password')
        addToData('accept_tos', 'acceptTos')
        addToData('address_line_1', 'addressLine1')
        addToData('address_line_2', 'addressLine2')
        addToData('city', 'town')
        addToData('county', 'county')
        addToData('mobile_number', 'mobileNumber')
        addToData('postcode', 'postcode')
        addToData('profile_image', 'profileImgUrl')
        addToData('profile_summary', 'summary')
        addToData('profile_about_you', 'aboutYou')
        addToData('opt_degree', 'degree')
        addToData('opt_dbs', 'dbs')
        addToData('opt_enhanced_dbs', 'enhancedDbs')
        addToData('opt_examiner', 'examiner')
        addToData('opt_aqa', 'aqa')
        addToData('opt_ccea', 'ccfa')
        addToData('opt_ocr', 'ocr')
        addToData('opt_edexel', 'edexel')
        addToData('opt_wjec', 'wjec')
        addToData('profile_video_link', 'videoUrl')
        addToData('subjects', 'subjects', sub => {
            const s = {...sub}

            if(parseInt(s.subject)) {
                s.subject_id = parseInt(s.subject)
            } else {
                s.subject_name = s.subject
            }
            delete s.subject

            if (s.online) {
                s.price_per_hour_online = parseInt(s.perHour.replace('£', '').trim()) * 100
            }
            if (s.inPerson) {
                s.price_per_hour_in_person = parseInt(s.perHour.replace('£', '').trim()) * 100
            }

            if (!s.hasOwnProperty('price_per_hour_in_person')) {
                s.price_per_hour_in_person = 0
            }
            if (!s.hasOwnProperty('price_per_hour_online')) {
                s.price_per_hour_online = 0
            }
            
            delete s.perHour

            s.online = !!s.online 
            s.in_person = !!s.inPerson 
            delete s.inPerson 

            return s
        })
        addToData('qualifications', 'qualifications', qual => {
            const q = {...qual}


            q.degree = !!q.degree 
            q.other = !!q.other 

            return q
        })
        addToData('profile_additional_images', 'profilePics', img => img.url)
        addToData('verification_documents', 'verificationDocs', doc => doc.url)
        addToData('qualification_documents', 'qualificationDocs', doc => doc.url)
        addToData('optional_documents', 'otherDocs', doc => doc.url)
        
        if (reg.userType == 'tutor') {
            addToData('references', 'references', ref => ref)
        } else if (reg.userType == 'agency') {
            if (reg.agencyBios && reg.agencyBios.length > 0 && !(
                reg.agencyBios.length == 1 &&
                reg.agencyBios[0].name == "" &&
                reg.agencyBios[0].blurb == "" && 
                reg.agencyBios[0].imageUrl == ""
            )) {
                addToData('company_bios', 'agencyBios', bio => bio)
            }
            addToData('banner_image', 'bannerImgUrl')
            addToData('company_name', 'agencyName')
            addToData('company_tagline', 'agencyTagline')
            addToData('company_website', 'agencyWebsite')
        }


        try {
            const response = await API.post("register/tutor", data)
            
            if (response && response.data && response.data.success) {
                window.localStorage.removeItem('registration')
                props.setUser(response.data.user)
                history.push('/dashboard')
            } else {
                if (response && response.data && response.data.errors) {
                    for(const key of Object.keys(response.data.errors)) {
                        toast.error(response.data.errors[key].join(' '))
                    }
                } else {
                    throw new Error("Unexpected API response")
                }
            }
        } catch (error) {
            if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.email) {
                toast.error(error.response.data.errors.email)
            } else {
                toast.error("An unexpected error occured, please try again.")
            }
        }

        setLoading(false)
    }

    const back = event => {
        event.preventDefault()
        const reg = JSON.parse(window.localStorage.getItem('registration'))

        if (reg.userType == 'tutor') {
            history.push('/register-tutor-references', {
                progress: {
                    ...location.state.progress,
                    current: 'references',
                    complete: 9
                }
            })
        } else {
            history.push('/register-tutor-availability', {
                progress: {
                    ...location.state.progress,
                    current: 'availability',
                    complete: 8
                }
            })
        }

        window.scrollTo(0, 0)

        /*
        {
            pathname: "/register-tutor-availability",
            state: {
                ...location.state,
                //qualifications: [...qualifications],
                progress: {
                    ...location.state.progress,
                    current: 'availability',
                    complete: 8
                }
            }
        }
        */
    }

    useEffect(() => {
        let reg = window.localStorage.getItem('registration')
        if (reg) { reg = JSON.parse(reg) }
        else {
            history.push('/register')
            return
        }

        if (
            !reg.email ||
            !reg.password ||
            !reg.acceptTos
        ) {
            setIncomplete(true)
        }
    }, [])

    return (<>
        <Helmet>
            <title>Finish - Qualified Tutors</title>
        </Helmet>

        <FixedWidth>
            <Container>
                <h1><span>F<Underline>inish.</Underline></span> <Progress style={{marginLeft: '32px', marginRight: '192px', position: 'relative', top: '64px'}} {...location.state.progress} /></h1>

                <Card>
                    {!incomplete ? <>
                        <h2>Well done!</h2>
                        <h2>You've completed the sign up process.</h2>

                        <p style={{marginTop: '16px'}}>After you press submit, you will be<br />taken to your draft <Underline>profile</Underline> page.</p>
                        <p>You can edit, delete or add anything<br />from your account section at any time.</p>
                        <p>We will review your documents ASAP and<br />let you know when your profile will go live.</p>     
                    </> : <>
                        <h2>Registration Incomplete</h2>

                        <p style={{marginTop: '16px'}}>Required fields from the Account Information step are incomplete.</p>
                    </>}
                    
                    <hr />

                    <Split id="controls" style={{marginTop: '16px', paddingTop: '96px', justifyContent: 'space-between', borderTop: '1px solid #E0E0E0', alignItems: 'center'}}>
                        <div>
                            <Link id="back-link" onClick={back} style={{display: 'flex', alignItems: 'center'}}>
                                {loading ? <RingLoader small /> : <><img alt="back" style={{width: '14px', height: '14px', position: 'relative'}} src="/img/back-icon.svg" />&nbsp; Back</>}
                            </Link>
                        </div>

                        <div>
                            <Link id="save-draft-link" disabled={incomplete} primary style={{marginRight: '64px', fontSize: '24px'}} 
                                onClick={e => submit(true, e)}>{loading ? <RingLoader small /> : 'SAVE AS DRAFT'}</Link>
                            <Link id="submit-link" disabled={incomplete} primary btn  
                                onClick={e => submit(false, e)}>{loading ? <RingLoader small /> : 'SUBMIT'}</Link>
                        </div>
                    </Split>

                </Card>
            </Container>
        </FixedWidth>
    </>)
}

export default Finalize
