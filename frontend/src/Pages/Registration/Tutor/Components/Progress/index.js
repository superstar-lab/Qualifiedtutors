import styled from 'styled-components'
import Colours from '../../../../../Config/Colours.js'
import { useHistory, useLocation } from 'react-router-dom'
import zIndex from '../../../../../Config/zIndex.js'
import { useEffect, useState } from 'react'

const Container = styled.div`
    width: 100%;    

    
`

const Line = styled.div`
    position: relative;
    width: 100%;
    height: 16px;
    border-radius: 16px;
    background: ${Colours.n300};
    display: flex;
    justify-content: space-between;

    & .linesegment:first-of-type {
        background: red !important;
        
    }

    @media screen and (max-width: 1280px) {
        margin-right: 0 !important;
    }

    @media screen and (max-width: 980px) {
        margin-left: 0 !important;
    }

    @media screen and (max-width: 640px) {
        & .step::before {
            content: "";
        }
    }

    @media screen and (max-width: 400px) {
        display: none;
    }
`

const Segment = styled.div`
    position: absolute;
    width: calc(100% / ${props => props.totalSegments ? props.totalSegments : '8'} + 4px);
    height: 16px;
    left: calc(100% / ${props => props.totalSegments ? props.totalSegments : '8'} * ${props => props.offset - 1});
    background: ${Colours.b500};
    z-index: ${zIndex.level1};

    &.first {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
    }

    &:last-of-type {
        width: calc(100% / ${props => props.totalSegments ? props.totalSegments : '8'});
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
`

const Step = styled.div`
   position: relative;
   top: -6.28px;
   width: 28px;
   height: 28px;
   border-radius: 50%;
   background: ${Colours.n300};
   z-index: ${zIndex.level2};
   cursor: pointer;

   ${props => props.active || props.complete ? `
        background: ${Colours.b500};
   ` : ''}

   border: 2px solid transparent;
   ${props => props.passed ? `
        border: 2px solid ${Colours.b500};
   ` : ''}

   ${props => props.complete ? `
        &:after {
            position: absolute;
            display: block;
            background: url('/img/checkmark.webp') no-repeat center center;
            background-size: contain;
            content: "";
            width: 16.04px;
            height: 14.04px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 26px;            
        }
   ` : ''}

   ${props => props.label ? `
        &:before {
            position: absolute;
            content: "${props.label}";
            top: -48px;
            font-size: 12.8px;
            font-weight: 400;
            white-space: pre-line;
            text-align: center;
            left: 50%;
            transform: translateX(-50%);
            padding-bottom: 4px;
            border-bottom: 2px solid ${Colours.t100};
            height: 32px;
            display: flex;
            align-items: center;

            ${props.active ? `
                border-bottom: 2px solid ${Colours.b500};
            ` : ''}
        }
   ` : ''}
`

function Progress(props) {

    const history = useHistory()
    const location = useLocation()

    const [userType, setUserType] = useState(null)

    const getProgress = () => {
        if (location && location.state && location.state.progress) {
            return location.state.progress
        } else {
            return {
                current: 'account',
                steps: [],

            }
        }
    }

    useEffect(() => {
        const reg = JSON.parse(window.localStorage.getItem('registration'))
        
        if (reg && reg.userType) {
            setUserType(reg.userType)
        } else {
            setUserType('tutor')
        }
    }, [])

    return (
        <Line {...props} className='progress'>
            <Step className='step' complete={true} style={{cursor: 'unset'}}></Step>
            <Step 
                className='step'
                complete={props.steps.includes('account')} 
                label={`Account
                    Information`}
                active={props.current == "info"}
                passed={props.complete >= 2}
                onClick={e => history.push('/register-tutor', {
                    progress: {
                        ...getProgress(),
                        complete: 1,
                        current: 'info'
                    } 
                })}
            ></Step>
            <Step 
                className='step'
                complete={props.steps.includes('address')} 
                label={`Address`}
                active={props.current == "address"}
                passed={props.complete >= 3}
                onClick={e => history.push('/register-tutor-address', {
                    progress: {
                        ...getProgress(),
                        complete: 2,
                        current: 'address'
                    } 
                })}
            ></Step>
            <Step 
                className='step'
                complete={props.steps.includes('subjects')} 
                label={`Subjects
                    & Prices`}
                active={props.current == "subjects"}
                passed={props.complete >= 4}
                onClick={e => history.push('/register-tutor-subjects', {
                    progress: {
                        ...getProgress(),
                        complete: 3,
                        current: 'subjects'
                    } 
                })}
            ></Step>
            {userType != 'agency' ? 
                <Step 
                    className='step'
                    complete={props.steps.includes('qualifications')} 
                    label={`Qualifications`}
                    active={props.current == "qualifications"}
                    passed={props.complete >= 5}
                    onClick={e => history.push('/register-tutor-qualifications', {
                        progress: {
                            ...getProgress(),
                            complete: 4,
                            current: 'qualifications'
                        } 
                    })}
                ></Step>
            : null}
            <Step 
                className='step'
                complete={props.steps.includes('profile')} 
                label={`Your
                    Profile`}
                active={props.current == "profile"}
                passed={props.complete >= 6}
                onClick={e => history.push('/register-tutor-profile', {
                    progress: {
                        ...getProgress(),
                        complete: 5,
                        current: 'profile'
                    } 
                })}
            ></Step>
            <Step
                className='step'
                complete={props.steps.includes('photos')} 
                label={`Photos
                    &.Videos`}
                active={props.current == "photos"}
                passed={props.complete >= 7}
                
                onClick={e => history.push('/register-tutor-photos', {
                    progress: {
                        ...getProgress(),
                        complete: 6,
                        current: 'photos'
                    } 
                })}
            ></Step>

            {userType != 'agency' ? 
                <Step 
                    className='step'
                    complete={props.steps.includes('verification')} 
                    label={`Teaching
                        Documents`}
                    active={props.current == "verification"}
                    passed={props.complete >= 8}
                    onClick={e => history.push('/register-tutor-documents', {
                        progress: {
                            ...getProgress(),
                            complete: 7,
                            current: 'verification'
                        } 
                    })}
                ></Step>
            : null}
            
        
            {userType != 'agency' ? 
                <Step 
                    className='step'
                    complete={props.steps.includes('availability')}
                    label="Availability"
                    active={props.current == "availability"}
                    passed={props.complete >= 9}
                    onClick={e => history.push('/register-tutor-availability', {
                        progress: {
                            ...getProgress(),
                            complete: 8,
                            current: 'availability'
                        }
                    })}
                /> : null
            }
            

            {userType == 'tutor' ? <Step 
                className='step'
                complete={props.steps.includes('references')}
                label="References"
                active={props.current == 'references'}
                passed={props.complete >= 10}
                onClick={e => history.push('/register-tutor-references', {
                    progress: {
                        ...getProgress(),
                        complete: 9,
                        current: 'references'
                    }
                })}
            /> : null}

            {(new Array(
                userType != 'agency' ? props.complete ? (props.complete < 8 ? props.complete : 8) : 1
                : props.complete ? (props.complete < 6 ? props.complete : 5) : 1)
            ).fill(null).map((v, i) => <Segment totalSegments={userType == 'tutor' ? 9 : (userType == 'agency' ? 5 : 8)} className={'linesegment' + (i == 0 ? ' first' : '')} offset={i + 1} />)}
        </Line>
    )
}

export default Progress
