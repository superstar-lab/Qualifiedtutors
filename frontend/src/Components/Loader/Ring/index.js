import styled from 'styled-components'

const Container = styled.div`
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;

    ${props => props.small ? `
        width: 20px;
        height: 20px;
    ` : ''}

    ${props => props.medium ? `
        width: 40px;
        height: 38px;
    ` : ''}

    & div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid ${props => props.colour ? props.colour : '#fff'};
        border-radius: 50%;
        animation: ringspin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${props => props.colour ? props.colour : '#fff'} transparent transparent transparent;

        ${props => props.small ? `
            width: 16px;
            height: 16px;
            border-width: 3px;
            margin: 0 2px;
        ` : ''}

        ${props => props.medium ? `
            width: 32px;
            height: 32px;
            border-width: 2px;
            margin: 4px;
        ` : ''}
    }

    & div:nth-of-type(1) {
        animation-delay: -0.45s;
    }

    & div:nth-of-type(2) {
        animation-delay: -0.3s;
    }

    & div:nth-of-type(3) {
        animation-delay: -0.15s;
    }

    @keyframes ringspin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

/**
 * Ring loader
 * 
 * Displays a spinning ring to indicate a loading state
 * 
 * @param small     Boolean Renders much smaller than default
 * @param medium    Boolean Renders smaller than default
 * @param colour    String  Hex color value for the ring
 */
function RingLoader(props) {
    return (
        <Container {...props}>
            <div></div><div></div><div></div><div></div>
        </Container>
    )
}

export default RingLoader
