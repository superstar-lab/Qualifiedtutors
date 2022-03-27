import styled from "styled-components"
import Colours from "../../Config/Colours"

const Container = styled.div`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid transparent;
    position: relative;
    transition: border-color .25s;

    &:before {
        content: "";
        display: block;
        position: absolute;
        width: 2px;
        height: 16px;
        transform-origin: top left;
        top: 50%;
        left: 50%;
        transform: rotate(-45deg) translate(-50%, -50%);
        background: ${Colours.n500};
        transition: background .25s;
    }

    &:after {
        content: "";
        display: block;
        position: absolute;
        width: 2px;
        height: 16px;
        transform-origin: top left;
        top: 50%;
        left: 50%;
        transform: rotate(45deg) translate(-50%, -50%);
        background: ${Colours.n500};
        transition: background .25s;
    }

    &:hover {
        border-color: ${Colours.b500};

        &:before, &:after {
            background: ${Colours.b500};
        }
    }
`

/**
 * Clear button
 * 
 * Displays a cross (outlined in a circle on hover)
 * 
 * @param style     Object
 * @param onClick   Function
 */
function ClearButton({...props}) {

    return <Container style={props.style ? props.style : {}} onClick={e => props.onClick && props.onClick(e)}></Container>
}

export default ClearButton