import styled from 'styled-components'
import Colours from '../../Config/Colours'

const Container = styled.div`
    
    --handleoffset: 1.5rem;
    --focus-shadow: 0 0 0;
    --b1: 0 0% 100%;
    --bc: 0 0% 20%;
    --tw-bg-opacity: 0.2;
    --tw-border-opacity: 0.2;

    appearance: none;
    border: 1px solid ${Colours.n500};
    cursor: pointer;
    height: 1.5rem;
    width: 3rem;
    border-radius: 30.4px;
    transition: background, box-shadow .2s ease-in-out;
    box-shadow: calc(var(--handleoffset)*-1) 0 0 2px hsl(var(--b1)) inset,0 0 0 2px hsl(var(--b1)) inset,var(--focus-shadow);
    border-color: hsla(var(--bc) / var(--tw-border-opacity,1));
    background-color: hsla(var(--bc) / var(--tw-bg-opacity,1));

    ${props => props.checked ? `
        --tw-bg-opacity: 1;
        --tw-border-opacity: 0.2;
        --bc: 210 100% 56%;
        box-shadow: var(--handleoffset) 0 0 2px hsl(var(--b1)) inset,0 0 0 2px hsl(var(--b1)) inset,var(--focus-shadow);
    ` : ''}

    ${props => props.label ? `
        position: relative;

        &::after {
            content: "${props.label}";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateX(calc(100% + 12px)) translateY(-50%);
        }
    ` : ''}
`
/**
 * Toggle
 * 
 * Renders a component that can be switched between an on/off state
 * 
 * @param value 
 * @param setter 
 * @param label 
 */
function Toggle({value, setter, label}) {    
    return <Container checked={value} onClick={e => setter && setter(!value)} label={label}></Container>
}

export default Toggle