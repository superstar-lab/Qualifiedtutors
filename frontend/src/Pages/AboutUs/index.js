import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Colours from '../../Config/Colours.js'
import {
    FixedWidth,
    WavyRect,
    Circle,
    Underline,
    Card,
    Input,
    Button,
    RingLoader,
    Toast
} from '../../Components'
import Collapsible from '../../Components/Collapsible/index.js'
import { useState } from 'react'
import { EmailRegex } from '../../Config/Validation.js'
import zIndex from '../../Config/zIndex.js'

const Container = styled.div`
    margin-bottom: 48px;

    & .fixedWidth {
        padding: 0 48px;
    }

    & .card {
        padding: 8px 0;
    }

    & .overtop {
        position: relative;
        z-index: ${zIndex.overtop};
    }

    

    @media screen and (max-width: 720px) {
        & .fixedWidth {
            padding: 0 16px;
        }

        & .card {
            padding: 16px 24px !important;
        }
    }

    @media screen and (max-width: 980px) {
        & .historyrow {
            flex-direction: column;
        }
    }
`

const LeadIn = styled.div`
    margin: 48px 0;

    h1 {
        font-weight: bold;
        font-size: 48px;
        line-height: 60px;
        color: ${Colours.n100};
        
    }

  
`

const EyeCatch = styled.div`
    flex: 1;

    h1 {
        font-weight: bold;
        font-size: 80px;
        line-height: 96px;
    }

    @media screen and (max-width: 680px) {
        h1 {
            font-size: 72px;
            line-height: 86.4px;
        }
    }

    @media screen and (max-width: 500px) {
        h1 {
            font-size: 60px;
            line-height: 72px;
        }
    }

    @media screen and (max-width: 420px) {
        h1 {
            font-size: 48px;
            line-height: 57.6px;
        }
    }
`

const EyeCatchIcon = styled.div`
    flex: 1;
    position: relative;

    & .circleSVG:first-of-type {
        position: absolute;
        left: 78px;
        z-index: ${zIndex.top};
        & img {
            width: 275px;
        }
    }

    & .circleSVG:last-of-type {
        position: absolute;
        left: 373px;
        top: 128px;
        z-index: ${zIndex.top};

        & img {
            width: 160px;
        }
    }

    @media screen and (max-width: 1350px) {
        position: absolute;
        right: 16px;
        width: 640px;
        height: 380px;
    }

    @media screen and (max-width: 1280px) {
        opacity: .33;
    }

    

    @media screen and (max-width: 640px) {
        right: unset !important;
        left: -53px;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const Row = styled.div`
    display: flex;
`

const FaqLeadIn = styled.div`
    margin-top: 142px;

    h2 {
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
    }
`

const Faqs = styled.section`
    margin-bottom: 64px;
`

const Address = styled.div`
    flex: 1;
    padding-right: 64px;
    border-right: 1px solid #EEEEEE;

    & p {
        color: #616161;
        font-size: 18px;
        line-height: 32px;
    }
`

const Form = styled.div`
    flex: 1;
    padding-left: 64px;
    margin-bottom: 48px;
`

const Quote = styled.div`

`

const History = styled.div`
    & .card {
        padding: 0 42px;
    }
`

/**
 * About us page
 * 
 * Purely presentational, no logic, props, etc.
 */
function AboutUs(props) {

    return <>
        <Helmet>
            <title>About us - Qualified Tutors</title>
        </Helmet>

        <Container>
            <LeadIn>
                <FixedWidth>
                    <h1>Abou<Underline>t us.</Underline></h1>
                </FixedWidth>
            </LeadIn>

            <WavyRect>
                <FixedWidth width="1280px">
                    <Row>
                        <EyeCatch>
                            <h1 className='overtop'>Designed<br />by teachers.</h1>
                            <p className='overtop' style={{fontSize: '18px', lineHeight: '32px', color: '#323232'}}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
                        </EyeCatch>

                        <EyeCatchIcon>
                            <Circle className="circle" width="326px" colour={Colours.r100}><img alt="person" src="/img/person2.webp" /></Circle>
                            <Circle className="circle" width="270px" colour={Colours.b300}><img alt="person" src="/img/person3.webp" /></Circle>
                        </EyeCatchIcon>
                    </Row>
                </FixedWidth>
            </WavyRect>
            
            <FaqLeadIn>
                <FixedWidth>
                    <Card style={{padding: '32px 48px', fontSize: '18px', lineHeight: '32px', color: '#616161'}}>
                        Hello and thanks for joining us on Qualified Tutors. We set out to minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam nostrud amet.
                    </Card>
                </FixedWidth>
            </FaqLeadIn>

            <Quote style={{margin: '42px 0', textAlign: 'center', fontSize: '24px', lineHeight: '36px', fontFamily: 'Oxygen', color: '#212121'}}>
            “Our aim, first and foremost, is  to be a trusted <br />
    partner to those <Underline>wanting</Underline> to become tutors.”

                <Row style={{justifyContent: 'center', marginTop: '32px'}}>
                    <img alt="person" src="/img/Avatar.webp" style={{width: '48px', height: '48px', position: 'relative', top: '3px'}} />
                    <Column>
                        <p style={{fontWeight: 'bold', fontSize: '16px', lineHeight: '28px', color: '#212121', margin: '0 0 0 8px', textAlign: 'left'}}>Nick S.</p>
                        <p style={{fontSize: '14px', lineHeight: '20px', color: '#757575', margin: '0 0 0 8px'}}>Founder of Qualified Tutors</p>
                    </Column>
                </Row>
            </Quote>

            <History>
                <FixedWidth>
                    <Row className='historyrow' style={{gap: '42px', flex: 1}}>
                        <Card style={{flex: 2}}>
                            <h2>Our <Underline>history</Underline></h2>
                        </Card>

                        <Card style={{flex: 1}}>
                            <h2>Our <Underline>beliefs</Underline></h2>
                        </Card>
                    </Row>
                </FixedWidth>
            </History>
        </Container>
    </>
}

export default AboutUs