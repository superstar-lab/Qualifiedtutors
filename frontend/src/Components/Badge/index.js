import styled from "styled-components"
import Colours from "../../Config/Colours"

const Container = styled.div`
    
    position: relative;

    &:before {
        position: absolute;
        top: 0; left: 0;
        content: "";
        border-radius: 50%;
        background: ${Colours.b500};
        width: ${props => props.content && props.content.length >= 2 ? '30px' : '26px'};
        height: 26px;
    }

    &:after {
        position: absolute;
        top: 1px; left: 1px;
        content: "${props => props.content}";
        border-radius: 50%;
        background: ${Colours.b500};
    
        width: ${props => props.content && props.content.length >= 2 ? '26px' : '22px'};
        height: 22px;
        border: 1px solid white;
        border-radius: 50%;
        background: ${Colours.b500};
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

/**
 * Badge
 * 
 * Displays a round indicator with a number inside it.
 * 
 * @param children Number   The number to display inside the badge
 * @returns 
 */
function Badge({children}) {

    return <Container className="badge" content={children} />
}

export default Badge