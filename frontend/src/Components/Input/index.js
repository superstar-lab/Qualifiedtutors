import styled from 'styled-components'
import { useEffect, useState } from 'react'
import Colours from '../../Config/Colours.js'

const Container = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 16px;

    ${props => props.valid ? `
        &:after {
            content: "";
            position: absolute;
            right: ${props.validRight ? props.validRight : '12px'};
            bottom: ${props.validBottom ? props.validBottom : '18px'};
            width: 14px;
            height: 13px;
            background: url(/img/chkbox_check_green.webp) no-repeat center center;
            background-size: contain;
        }
    ` : ''}
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;

    & > span {
        font-weight: normal;
        color: ${Colours.n500};
        opacity: .6;
    }
`

const InputElement = styled.input`
    position: relative;
    box-sizing: border-box;
    padding: 7px 11px;
    border-radius: 4px;
    border: 1px solid ${props => props.error ? 
        Colours.r400 : 
            (props.valid ? Colours.g500 : (
                props.active ? Colours.b300 : Colours.n800
            ))
    };
    font-size: 18px;
    line-height: 28px;
    width: 100%;
    color: ${Colours.n400};
    transition: border-color .25s;

    &:hover {
        border-color: ${Colours.b500};
    }

    &:focus {
        outline: none;
        border-color: ${Colours.b500};
    }

    &::placeholder { 
        color: ${Colours.n700};
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: ${Colours.n700};
    }
    ::-moz-placeholder { /* Firefox 19+ */
        color: ${Colours.n700};
    }
    :-ms-input-placeholder { /* IE 10+ */
        color: ${Colours.n700};
    }
    :-moz-placeholder { /* Firefox 18- */
        color: ${Colours.n700};
    }

`

const TextareaElement = styled.textarea`
   box-sizing: border-box;
   padding: 8px 16px;
   border-radius: 4px;
   border: 1px solid ${props => props.error ? Colours.r400 : (props.valid ? Colours.g500 : Colours.n800)};
   font-size: 18px;
   line-height: 28px;
   width: 100%;
   resize: none;
   
    ${props => props.noresize ? `
        resize: none;
    ` : ''}

   &:focus {
        outline: none;
        border-color: ${Colours.b500};
   }

   &:hover {
    border-color: ${Colours.b500};
   }

    &::placeholder { 
        color: ${Colours.n700};
    }

    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: ${Colours.n700};
    }
    ::-moz-placeholder { /* Firefox 19+ */
        color: ${Colours.n700};
    }
    :-ms-input-placeholder { /* IE 10+ */
        color: ${Colours.n700};
    }
    :-moz-placeholder { /* Firefox 18- */
        color: ${Colours.n700};
    }
`

const Error = styled.div`
   white-space: nowrap;
   color: ${Colours.r400}; 
   margin-top: 4px;
`

/**
 * Input 
 * 
 * @param type              String          <input> type attribute value, Default: "text" 
 * @param label             String          If present used as a label above the input 
 * @param value             String          Current value of the <input> 
 * @param placeholder       String          If present used as a placeholder attribute to the <input> 
 * @param text              Boolean         If present renders a <textarea> instead of an <input>
 * @param active            Boolean         If present the input is outlined in light blue
 * @param valid             Boolean         If present the input will be outlined in light green
 * @param error             Boolean         If present the input will be outlined in light red 
 * @param readonly          Boolean         If present supress firing onChange
 * @param onChange          Function(event) Called when the value changes
 * @param containerClass    String          If present used as an additional classname to include on the container
 * @param style             Object          If present used as additonal styles for the container
 * @param labelStyle        Object          If present used as additional styles for the label element
 * @param optionalLabel     Boolean         If present "(optional)" will be displayed beside the label
 * @param className         String          If present used as an additional classname for the input element
 * @param forwardRef        Ref             Can be used to capture a reference to the <input> element
 * @param onKeyUp           Function(event) Fired when a user releases a key with the <input> focused
 * @param autocomplete      String          If present used as a value to the inputs auto-complete attribute
 * @returns 
 */

function Input(props) {
    return (
        <Container className={"inputcontainer " + (props.containerClass ? props.containerClass : "")} style={props.style ? props.style : {}} onChange={e => !props.readonly && props.onChange(e)}>
            {props.label ? <Label style={props.labelStyle ? props.labelStyle : {}}>{props.label} {props.optionalLabel ? <span>(optional)</span> : null}</Label> : null}
            {props.text ? 
                <TextareaElement className={"input text " + props.className ? props.className : ''} active={props.active} ref={props.forwardRef} value={props.value} placeholder={props.placeholder} {...props}/> :
                <InputElement 
                    active={props.active}
                    ref={props.forwardRef} 
                    onKeyUp={props.onKeyUp} 
                    placeholder={props.placeholder ? props.placeholder : ''} 
                    valid={props.valid}  
                    type={props.type ? props.type : 'text'} 
                    error={props.error} 
                    value={props.value} 
                    {...props.style} 
                    autoComplete={props.autocomplete ? props.autocomplete : ''} 
                    data-lpignore={props.autocomplete == "off" ? 'true' : ''} 
                    className={"input line " + props.className ? props.className : ''}
                />
            }
            <Error>{props.error}</Error>
        </Container>
    )
}

export default Input
