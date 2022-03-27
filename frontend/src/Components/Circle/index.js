import styled from 'styled-components'
import { ReactComponent as CircleSVG } from './circle.svg'

const Container = styled.div`
    user-select: none; 
    position: relative;
    opacity: ${props => props.opacity ? props.opacity : 1};
    width: ${props => props.width ? props.width : '136.79px'};
    font-size: ${props => props.fontSize ? props.fontSize : '120px'};
    color: ${props => props.colour};
    transition: opacity .25s;

    & svg path {
        fill: ${props => props.colour};
        ${props => props.circleColour ? `
            fill: ${props.circleColour};
        ` : ''}
        transition: fill .25s, opacity .25s;
        opacity: ${props => props.circleOpacity ? props.circleOpacity : '1'};
    }
`

const Text = styled.div`
    position: absolute;
    top: -14.4px;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;

    ${props => props.bgImg ? `
        background: url(${props.bgImg}) no-repeat center center;
        background-size: contain;
        border-radius: 50%;
        width: 85%;
        height: 85%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    ` : ''}
`
/**
 * Displays a decorative circle
 * 
 * Renders the circle decoration SVG and optional contents
 * 
 * @param  
 * @returns 
 */
function Circle(props) {
    
    return (
        <Container {...props} className={props.className ? "circleSVG " + props.className : 'circleSVG'}>
            <CircleSVG />
            <Text bgImg={props.bgImg ? props.bgImg : null}>{props.children || props.children === 0 ? props.children : null}</Text>
        </Container>
    )
}

export default Circle
