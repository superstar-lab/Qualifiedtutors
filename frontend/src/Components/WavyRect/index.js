import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import zIndex from '../../Config/zIndex.js'

const WavyRect = styled.section`
    position: relative;
    width: 100%;
    background: ${Colours.t500};
    margin: 112px 0;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: -112px;
        width: 100%;
        height: 112px;
        background-image: url('/img/teal_rect.svg');
        background-size: 100%;
        z-index: ${zIndex.behindBG};
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -112px;
        width: 100%;
        height: 112px;
        background-image: url('/img/teal_rect.svg');
        background-size: 100%;
        background-position-y: 100%;
        z-index: ${zIndex.behindBG};
    }

    @media screen and (max-width: 440px) {
        &::after {
            background-size: 100% 130%;
        }

        &::before {
            background-size: 100% 130%;
        }
    }

    @media screen and (max-width: 340px) {
        &::after {
            background-size: 100% 180%;
        }

        &::before {
            background-size: 100% 180%;
        }
    }
`

export default WavyRect