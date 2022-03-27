import styled from "styled-components"
import { Circle, FixedWidth, Underline } from "../../Components"
import {Helmet} from "react-helmet"
import Colours from "../../Config/Colours"
import zIndex from "../../Config/zIndex"

const Container = styled.div`
    
    margin: 64px 0 72px 0;

    & .fixedWidth {
        padding: 0 48px;
    }

    & h2 {
        font-size: 48px;
    }

    @media screen and (max-width: 1150px) {
            & .fixedWidth {
                padding: 0 24px;
            }
        
            & .steps {
                flex-wrap: wrap;
                gap: 16px;
            }
        
    }

    @media screen and (max-width: 460px) {
        & h2 {
            font-size: 36px;
        }
    }
`

const Steps = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const StepContent = styled.div`
  
    position: relative;

   & h2 {
        position: absolute;
        top: -350px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(143, 200, 255, 0.25);
        font-size: 300px;
        z-index: ${zIndex.BG};
   }

   & h3 {
        color: ${Colours.n400};
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
        width: 90%;
        margin: 12px auto 12px auto;
        text-align: center;
   }

   & p {
        color: ${Colours.n400};
        font-weight: normal;
        font-size: 18px;
        line-height: 32px;
        width: 66%;
        text-align: center;
        margin: 0 auto;
   }
`

function HowItworks({...props}) {

    return <>
        <Helmet>
            <title>How it works - Qualified Tutors</title>
        </Helmet>

        <Container className="howItWorks">
            <FixedWidth>
                <h2>How it w<Underline>orks.</Underline></h2>
                
                <h3 style={{fontSize: '34px', marginTop: '0', marginBottom: '0', textAlign: 'center', width: '100%'}}>Everything you need</h3>
                <p style={{color: Colours.n600, fontSize: '24px', lineHeight: '32px', width: '100%', textAlign: 'center', marginTop: '16px', marginBottom: '48px'}}>Prices, reviews, bios and more. Or call our concierge for even more help.</p>

                <Steps className="steps">
                    <Circle width="276px" colour={Colours.b300}>
                        <StepContent>
                            <h2>1</h2>
                            <h3>Amet Minim</h3>
                            <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                        </StepContent>
                    </Circle>

                    <Circle width="276px" colour={Colours.g500}>
                        <StepContent>
                            <h2 style={{color: Colours.g500, opacity: '.3'}}>2</h2>
                            <h3>Amet Minim</h3>
                            <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                        </StepContent>
                    </Circle>
                    <Circle width="276px" colour={Colours.r100}>
                        <StepContent>
                            <h2 style={{color: Colours.r100, opacity: '.3', paddingTop: '6px'}}>3</h2>
                            <h3>Amet Minim</h3>
                            <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                        </StepContent>
                    </Circle>
                </Steps>

                <FixedWidth width="820px">
                    <p style={{color: Colours.n600, fontSize: '24px', lineHeight: '1.5', width: '100%', textAlign: 'center', marginTop: '24px'}}>Everything you need to find a perfect teacher is at your fingertips - prices, reviews, bios and more. Or call our concierge for even more help.</p>
                </FixedWidth>
            </FixedWidth>
        </Container>
    </>
}

export default HowItworks