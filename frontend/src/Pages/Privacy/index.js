import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Colours from '../../Config/Colours.js'
import {
    FixedWidth,
    WavyRect,
    Circle,
    Underline,
    Card
} from '../../Components'

const Container = styled.div`
    margin-bottom: 48px;

    & .card {
        padding: 8px 32px;

        & > h2 {
            margin-bottom: 0 !important;
        }
    }

    & .wavyRect {
        margin-bottom: 146px;
    }

    @media screen and (max-width: 1530px) {
        & .fixedWidth {
            padding-left: 32px;
            padding-right: 32px;
        }
    }

    @media screen and (max-width: 980px) {
        & .eyecatchRow {
            position: relative;
            z-index: 10;

            & .eyecatchIcon {
                position: absolute;
                height: 80%;
                width: 240px;
                right: -98px;
                z-index: -1;
                opacity: .33;
            }
        }
    }

    @media screen and (max-width: 800px) {
        & .formrow {
            flex-direction: column;

            & .address {
                padding-right: 0;
                border-right: 0;
                border-bottom: 1px solid #eee;
                margin-bottom: 16px;
            }

            & .form {
                padding-left: 0;
            }
        }
    }


    @media screen and (max-width: 680px) {
        .eyecatchRow h1 {
            font-size: 72px;
            line-height: 86.4px;
        }
    }

    @media screen and (max-width: 600px) {
        .eyecatchRow h1 {
            font-size: 60px;
            line-height: 72px;
        }
    }

    @media screen and (max-width: 520px) {
        .eyecatchRow h1 {
            font-size: 48px;
            line-height: 57.6px;
        }

        & .eyecatchIcon {
            top: -48px;
        }

        & .fixedWidth {
            padding: 0 16px;
        }
    }

    @media screen and (max-width: 420px) {
        h1 {
            font-size: 34px !important;
            line-height: 40.8px !important;
        }

        & .eyecatchIcon {
            right: unset !important;
            left: 180px;
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
`

const EyeCatchIcon = styled.div`
    flex: 1;
    position: relative;

    & .circleSVG {
        position: absolute;
        right: 100px;
    }
`

const Row = styled.div`
    display: flex;
`

function Privacy(props) {

    return <>
        <Helmet>
            <title>Privacy policy - Qualified Tutors</title>
        </Helmet>

        <Container>
            <LeadIn>
                <FixedWidth>
                    <h1>Privacy Policy.</h1>
                </FixedWidth>
            </LeadIn>

            <WavyRect className='wavyRect'>
                <FixedWidth width="1280px">
                    <Row className="eyecatchRow">
                        <EyeCatch>
                            <h1>Lorem ipsum dolar sit.</h1>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </EyeCatch>

                        <EyeCatchIcon className='eyecatchIcon'>
                            <Circle colour={Colours.b300} width="322px"><img alt="speech balloon" src="/img/speech.webp" /></Circle>
                        </EyeCatchIcon>
                    </Row>
                </FixedWidth>
            </WavyRect>

            <FixedWidth>
                <Card>
                    <h2>Lorem <Underline offset="-10px">ipsum</Underline></h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    
                    <h2>Lorem <Underline offset="-10px">ipsum</Underline></h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </Card>
            </FixedWidth>
        </Container>
    </>
}

export default Privacy