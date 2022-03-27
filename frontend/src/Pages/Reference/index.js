import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {Helmet} from "react-helmet"
import styled from "styled-components"
import { API, Button, Card, Checkbox, Dropdown, FixedWidth, Input, RingLoader, Toast, Underline } from "../../Components"
import toast from "../../Components/Toast"
import Colours from "../../Config/Colours"
import { EmailRegex, MobileNumberRegex, PostcodeRegex } from "../../Config/Validation"

const Container = styled.div`
    margin: 48px 0;

    & h1:first-of-type {
        margin-top: 0;
    }

    & h1, & h2 {
        color: ${Colours.n200};
    }

    & h3 {
        font-weight: normal;
        line-height: 1.5;
        margin-bottom: 8px;
    }

    & p {
        color: ${Colours.n500};
    }
`

const Row = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const Error = styled.span`
    color: ${Colours.r500};
    font-size: 16px;
`

/**
 * Form for tutor referees to submit a reference
 */
function References() {

    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)
    const [reference, setReference] = useState()
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const params = useParams()

    const [state, setState] = useState({
        title: "",
        name: "",
        surname: "",
        email: "",
        school: "",
        addressLine1: "",
        addressLine2: "",
        town: "",
        postcode: "",
        phone: "",
        
        howLong: null,
        howDoYouKnow: null,
        confident: null,
        rating: null,
        professionalism: null,
        managementSkills: null,
        reliability: null,
        trustworthyness: null,
        comments: ""
    })

    const [errors, setErrors] = useState({
        title: "",
        name: "",
        surname: "",
        email: "",
        school: "",
        addressLine1: "",
        addressLine2: "",
        town: "",
        postcode: "",
        phone: "",
        
        howLong: "",
        howDoYouKnow: "",
        confident: "",
        rating: "",
        professionalism: "",
        managementSkills: "",
        reliability: "",
        trustworthyness: "",
        comments: ""
    })

    const updateState = (field, value) => {
        setState(prevState => ({
            ...prevState,
            [field]: value
        }))

        if (errors[field]) {
            updateError(field, "")
        }
    }

    const updateError = (field, value) => {
        setErrors(prevState => ({
            ...prevState,
            [field]: value
        }))
    }

    const submit = async event => {
        
        let hasErrors = false 

        if (!state.name) {
            hasErrors = true
            updateError("name", "Required")
        }

        if (!state.surname) {
            hasErrors = true
            updateError("surname", "Required")
        }

        if (!state.email || !state.email.match(EmailRegex)) {
            hasErrors = true
            updateError("email", "Valid email required")
        }

        if (!state.phone || !state.phone.match(MobileNumberRegex)) {
            hasErrors = true
            updateError("phone", "Valid number required")
        }

        if (!state.school) {
            hasErrors = true 
            updateError("school", "Required")
        }

        if (!state.addressLine1) {
            hasErrors = true 
            updateError("addressLine1", "Required")
        }

        if (!state.town) {
            hasErrors = true 
            updateError("town", "Required")
        }

        if (!state.postcode || !state.postcode.match(PostcodeRegex)) {
            hasErrors = true 
            updateError("postcode", "Valid postcode required")
        }

        if (!state.howLong) {
            hasErrors = true 
            updateError("howLong", "Required")
        }
        if (!state.howDoYouKnow) {
            hasErrors = true 
            updateError("howDoYouKnow", "Required")
        }
        if (!state.confident) {
            hasErrors = true 
            updateError("confident", "Required")
        }
        if (!state.rating) {
            hasErrors = true 
            updateError("rating", "Required")
        }
        if (!state.professionalism) {
            hasErrors = true 
            updateError("professionalism", "Required")
        }
        if (!state.managementSkills) {
            hasErrors = true 
            updateError("managementSkills", "Required")
        }
        if (!state.reliability) {
            hasErrors = true 
            updateError("reliability", "Required")
        }
        if (!state.trustworthyness) {
            hasErrors = true 
            updateError("trustworthyness", "Required")
        }
        if (state.comments.length < 100) {
            hasErrors = true 
            updateError("comments", "Minimum 100 characters")
        }

        if (!hasErrors) {
            setSubmitting(true)
            try {
                const response = await API.post('/reference/submit/' + params.uuid, state)
                if (response && response.data && response.data.success) {
                    setSuccess(true)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Failed to submit reference. Please try again.")
            }
            setSubmitting(false)
        }
    }

    useEffect(() => {

        const getReference = async () => {
            try {
                const response = await API.get('reference/' + params.uuid)
                if (response && response.data && response.data.success) {
                    if (response.data.reference.response && Object.keys(response.data.reference.response).length > 0) {
                        setLoadingError("This reference has already been provided.")
                        setLoading(false)
                    } else {
                        setLoadingError(false)
                        setReference(response.data.reference)
                        setLoading(false)
                    }
                    
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                toast.error("Failed to fetch reference. Please refresh to try again.")
            }
        }

        if (params && params.uuid) {
            getReference()
        }
    }, [params])

    return <>
        <Helmet>
            <title>Confirm reference - Qualified Tutors</title>
        </Helmet>

        <Container>
            <FixedWidth width="720px">
                <h1>Confirm Refe<Underline>rence</Underline></h1>
                <Card>
                    {loading ? <RingLoader colour={Colours.b500} /> : 
                        (loadingError ? loadingError : 
                            success ? <>
                                <h2 style={{marginBottom: '0', marginTop: '0'}}>Thank you</h2>
                                <p>Your reference has been received and will be reviewed ASAP.</p>
                            </> :
                            <>
                                <p style={{marginTop: '0'}}>{reference.tutor_name} {reference.tutor_surname} has requested a reference from you. Please complete the following form which we will use as a reference.</p>
                                <h2 style={{marginBottom: '16px'}}>About you</h2>
                    
                                <Row style={{flexWrap: 'unset'}}>
                                    <Dropdown 
                                        label="Title"
                                        selected={state.title}
                                        onChange={value => updateState('title', value)}
                                        style={{minWidth: '98px'}}
                                        valid={!!state.title}
                                    >
                                        
                                        <div key="mr">Mr</div>
                                        <div key="miss">Miss</div>
                                        <div key="mrs">Mrs</div>
                                        <div key="ms">Ms</div>
                                        <div key="mx">Mx</div>
                                        <div key="dr">Dr</div>
                                        <div key="prof">Prof</div>
                                    </Dropdown>   

                                    <Input valid={!!state.name} error={errors.name} label="First name" value={state.name} onChange={e => updateState('name', e.target.value)} />
                                    <Input valid={!!state.surname} error={errors.surname} label="Last name" value={state.surname} onChange={e => updateState('surname', e.target.value)} />
                                </Row>  

                                <Row style={{flexWrap: 'unset'}}>
                                    <Input valid={!!state.email && state.email.match(EmailRegex)} error={errors.email} label="Email" value={state.email} onChange={e => updateState('email', e.target.value)} />
                                    <Input valid={!!state.phone && state.phone.match(MobileNumberRegex)} error={errors.phone} label="Phone number" value={state.phone} onChange={e => updateState('phone', e.target.value)} />
                                </Row>

                                <Row>
                                    <Input valid={!!state.school} error={errors.school} label="School name" value={state.school} onChange={e => updateState('school', e.target.value)} />
                                </Row>

                                <Column>
                                    <Input valid={!!state.addressLine1} error={errors.addressLine1} label="Street name" value={state.addressLine1} onChange={e => updateState('addressLine1', e.target.value)} />
                                    <Input valid={!!state.addressLine2} value={state.addressLine2} onChange={e => updateState('addressLine2', e.target.value)} />
                                </Column>

                                <Row style={{flexWrap: 'unset'}}>
                                    <div>
                                        <Input valid={!!state.town} error={errors.town} label="Town" value={state.town} onChange={e => updateState('town', e.target.value)} />
                                    </div>
                                    <div>
                                    <Input valid={!!state.postcode && state.postcode.match(PostcodeRegex)} error={errors.postcode} label="Postcode" value={state.postcode} onChange={e => updateState('postcode', e.target.value)} />
                                    </div>
                                </Row>

                                <Row>
                                    
                                </Row>

                                <h2 style={{marginTop: '48px', marginBottom: '0'}}>About {reference.tutor_name}</h2>

                                <h3>How long have you know {reference.tutor_name}? {errors.howLong ? <Error>{errors.howLong}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.howLong == 'Less than 1 year'} setter={v => updateState('howLong', v ? 'Less than 1 year' : null)}>Less than 1 year</Checkbox>
                                    <Checkbox outline value={state.howLong == '1 to 2 years'} setter={v => updateState('howLong', v ? '1 to 2 years' : null)}>1 to 2 years</Checkbox>
                                    <Checkbox outline value={state.howLong == '2 to 3 years'} setter={v => updateState('howLong', v ? '2 to 3 years' : null)}>2 to 3 years</Checkbox>
                                    <Checkbox outline value={state.howLong == '3 to 4 years'} setter={v => updateState('howLong', v ? '3 to 4 years' : null)}>3 to 4 years</Checkbox>
                                    <Checkbox outline value={state.howLong == '4 to 5 years'} setter={v => updateState('howLong', v ? '4 to 5 years' : null)}>4 to 5 years</Checkbox>
                                    <Checkbox outline value={state.howLong == 'More than 5 years'} setter={v => updateState('howLong', v ? 'More than 5 years' : null)}>More than 5 years</Checkbox>
                                </Row>

                                <h3>How do you know {reference.tutor_name}? {errors.howDoYouKnow ? <Error>{errors.howDoYouKnow}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.howDoYouKnow == 'Was my tutor'} setter={v => updateState('howDoYouKnow', v ? 'Was my tutor' : null)}>{reference.tutor_name + ' was my tutor'}</Checkbox>
                                    <Checkbox outline value={state.howDoYouKnow == 'School collegue'} setter={v => updateState('howDoYouKnow', v ? 'School collegue' : null)}>{"I'm a school collegue of " + reference.tutor_name}</Checkbox>
                                    <Checkbox outline value={state.howDoYouKnow == 'Work collegue'} setter={v => updateState('howDoYouKnow', v ? 'Work collegue' : null)}>{"I'm a work collegue of " + reference.tutor_name}</Checkbox>
                                    <Checkbox outline value={state.howDoYouKnow == 'Their Doctor'} setter={v => updateState('howDoYouKnow', v ? 'Their Doctor' : null)}>{"I'm their Doctor"}</Checkbox>
                                    <Checkbox outline value={state.howDoYouKnow == 'Their teacher'} setter={v => updateState('howDoYouKnow', v ? 'Their teacher' : null)}>{"I taught " + reference.tutor_name}</Checkbox>
                                </Row>

                                <h3>Do you feel confident that {reference.tutor_name} has the qualities to work as a private tutor? {errors.confident ? <Error>{errors.confident}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.confident == 'yes'} setter={v => updateState('confident', v ? 'yes' : null)}>Yes</Checkbox>
                                    <Checkbox outline value={state.confident == 'no'} setter={v => updateState('confident', v ? 'no' : null)}>No</Checkbox>
                                </Row>

                                <h3>Rate {reference.tutor_name}'s ability to deliver great tutoring sessions: {errors.rating ? <Error>{errors.rating}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    {Array.from({length: 5}).map((v, i) => i + 1 <= state.rating ? <img alt="full star" src="/img/star_fill.svg" style={{cursor: 'pointer'}} onClick={e => updateState("rating", i + 1)} /> : <img alt="empty star" src="/img/star_outline.svg" style={{cursor: 'pointer'}} onClick={e => updateState("rating", i + 1)} />)}
                                </Row>

                                <h3>How professional is {reference.tutor_name}? {errors.professionalism ? <Error>{errors.professionalism}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.professionalism == 'excellent'} setter={v => updateState('professionalism', v ? 'excellent' : null)}>Excellent</Checkbox>
                                    <Checkbox outline value={state.professionalism == 'good'} setter={v => updateState('professionalism', v ? 'good' : null)}>Good</Checkbox>
                                    <Checkbox outline value={state.professionalism == 'average'} setter={v => updateState('professionalism', v ? 'average' : null)}>Average</Checkbox>
                                    <Checkbox outline value={state.professionalism == 'weak'} setter={v => updateState('professionalism', v ? 'weak' : null)}>Weak</Checkbox>
                                    <Checkbox outline value={state.professionalism == 'poor'} setter={v => updateState('professionalism', v ? 'poor' : null)}>Poor</Checkbox>
                                </Row>

                                <h3>How would you rate {reference.tutor_name}'s teaching management skills? {errors.managementSkills ? <Error>{errors.managementSkills}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                <Checkbox outline value={state.managementSkills == 'excellent'} setter={v => updateState('managementSkills', v ? 'excellent' : null)}>Excellent</Checkbox>
                                    <Checkbox outline value={state.managementSkills == 'good'} setter={v => updateState('managementSkills', v ? 'good' : null)}>Good</Checkbox>
                                    <Checkbox outline value={state.managementSkills == 'average'} setter={v => updateState('managementSkills', v ? 'average' : null)}>Average</Checkbox>
                                    <Checkbox outline value={state.managementSkills == 'weak'} setter={v => updateState('managementSkills', v ? 'weak' : null)}>Weak</Checkbox>
                                    <Checkbox outline value={state.managementSkills == 'poor'} setter={v => updateState('managementSkills', v ? 'poor' : null)}>Poor</Checkbox>
                                    <Checkbox outline value={state.managementSkills == "don't know"} setter={v => updateState('managementSkills', v ? "don't know" : null)}>Don't know</Checkbox>
                                </Row>

                                <h3>How reliable is {reference.tutor_name}? {errors.reliability ? <Error>{errors.reliability}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.reliability == 'excellent'} setter={v => updateState('reliability', v ? 'excellent' : null)}>Excellent</Checkbox>
                                    <Checkbox outline value={state.reliability == 'good'} setter={v => updateState('reliability', v ? 'good' : null)}>Good</Checkbox>
                                    <Checkbox outline value={state.reliability == 'average'} setter={v => updateState('reliability', v ? 'average' : null)}>Average</Checkbox>
                                    <Checkbox outline value={state.reliability == 'weak'} setter={v => updateState('reliability', v ? 'weak' : null)}>Weak</Checkbox>
                                    <Checkbox outline value={state.reliability == 'poor'} setter={v => updateState('reliability', v ? 'poor' : null)}>Poor</Checkbox>
                                </Row>

                                <h3>How trustworthy is {reference.tutor_name}? {errors.trustworthyness ? <Error>{errors.trustworthyness}</Error> : null}</h3>
                                <Row style={{marginBottom: '16px'}}>
                                    <Checkbox outline value={state.trustworthyness == 'excellent'} setter={v => updateState('trustworthyness', v ? 'excellent' : null)}>Excellent</Checkbox>
                                    <Checkbox outline value={state.trustworthyness == 'good'} setter={v => updateState('trustworthyness', v ? 'good' : null)}>Good</Checkbox>
                                    <Checkbox outline value={state.trustworthyness == 'average'} setter={v => updateState('trustworthyness', v ? 'average' : null)}>Average</Checkbox>
                                    <Checkbox outline value={state.trustworthyness == 'weak'} setter={v => updateState('trustworthyness', v ? 'weak' : null)}>Weak</Checkbox>
                                    <Checkbox outline value={state.trustworthyness == 'poor'} setter={v => updateState('trustworthyness', v ? 'poor' : null)}>Poor</Checkbox>
                                </Row>

                                <h3>Please write a couple of lines to support your responses: {errors.comments ? <Error>{errors.comments}</Error> : null}</h3>
                                <Input text style={{height: '164px'}} valid={!!state.comments && state.comments.length >= 100} placeholder="100 characters minimum" value={state.comments} onChange={e => updateState('comments', e.target.value)} />

                                <Row style={{justifyContent: 'space-between', marginTop: '16px'}}>
                                    <div></div>
                                    <Button primary onClick={submit}>{submitting ? <RingLoader small /> : 'Submit'}</Button>
                                </Row>
                            </>    
                        )
                    }
                    


                </Card>
            </FixedWidth>
        </Container>
    </>
}

export default References