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
    width: calc(100% / 3 + 4px);
    height: 16px;
    left: calc(100% / 3 * ${props => props.offset - 1});
    background: ${Colours.b500};
    z-index: ${zIndex.level1};

    &.first {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
    }

    &:last-of-type {
        width: calc(100% / 3);
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

function StudentProgress(props) {

    const history = useHistory()
    const location = useLocation()

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
                onClick={e => history.push('/register-student', {
                    progress: {
                        ...location.state.progress,
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
                onClick={e => history.push('/register-student-address', {
                    progress: {
                        ...location.state.progress,
                        complete: 2,
                        current: 'address'
                    } 
                })}
            ></Step>
            <Step 
                className='step'
                complete={props.steps.includes('profile')} 
                label={`Your
                    Profile`}
                active={props.current == "profile"}
                passed={props.complete >= 4}
                onClick={e => history.push('/register-student-profile', {
                    progress: {
                        ...location.state.progress,
                        complete: 3,
                        current: 'profile'
                    } 
                })}
            ></Step>

            {(new Array(props.complete ? (props.complete < 4 ? props.complete : 4) : 1)).fill(null).map((v, i) => <Segment className={'linesegment' + (i == 0 ? ' first' : '')} offset={i + 1} />)}
        </Line>
    )
}

export default StudentProgress
