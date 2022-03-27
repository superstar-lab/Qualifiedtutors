import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import zIndex from '../../Config/zIndex.js'

const Container = styled.div`
   display: flex; 
   cursor: pointer;
   color: ${Colours.n200};
   user-select: none;

   &:hover {
        .box {
            border-color: ${props => props.active ? Colours.b400 : Colours.b300};
        }

        .label {
            color: ${Colours.n200};
        }
    }

    ${props => props.active ? `
        .label {
            color: ${Colours.n200};
        }
    ` : ''}

    ${props => props.outline ? `
        transition: border-color .25s;
        border-radius: 4px;
        padding: 8px;
        border: 1px solid ${props.active ? Colours.b500 : Colours.n300};
    ` : ''}

    @media screen and (max-width: 640px) {
        .label {
            & > span {
                white-space: break-spaces;
            }
        }
    }
`

const Box = styled.div`
    position: relative;

    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border: 2px solid ${Colours.b500};
    background: white;

    border-radius: 4px;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    color: ${Colours.b500};
    user-select: none;
    cursor: pointer;
    transition: border-color .25s, background .25s;
    

    &:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
        background: ${Colours.b500};
        transition: transform .15s;
        transform-origin: center center;
        transform: scale(0);
        z-index: ${zIndex.checkbox - 1};

        ${props => props.active ? `
            transform: scale(1);
        ` : ''}
    }

    & img {
        position: relative;
        z-index: ${zIndex.checkbox + 1};
    }

    ${props => props.active ? `
        border-color: ${Colours.b500};
    ` : ''}
`

const Label = styled.label`
    margin-left: 8px; 
    cursor: pointer;
    white-space: nowrap;
    line-height: 23px;

    color: ${Colours.n500};
`

/**
 * Checkbox
 * 
 * Displays a checkbox
 * 
 * @param setter    Function(bool)  Setter for the value param
 * @param value     Boolean         Controls the checked/unchecked states
 * @param label     String          Displays a label to the right of the checkbox
 * @param children  Collection      If present and the label param IS NOT the children are displayed in place of the label
 * @param outline   Boolean         If present the entire control (box + label) are outlined 
 * @returns 
 */

function Checkbox(props) {
   return (
       <Container onClick={e => props.setter && props.setter(!props.value)} className="checkbox" {...props} active={!!props.value} outline={!!props.outline}>
            <Box className="box" active={!!props.value}>{!!props.value ? <img alt="checkmark" src="/img/chkbox_check.webp" style={{width: '14px', height: '13px'}} /> : null}</Box>
            {props.label || (!props.label && props.children) ? <Label className="label">{props.label ? props.label : props.children}</Label> : null}
       </Container>
   )
}

export default Checkbox
