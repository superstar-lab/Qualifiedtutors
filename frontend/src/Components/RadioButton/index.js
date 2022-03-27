import styled from 'styled-components'
import Colours from '../../Config/Colours.js'

const Container = styled.div`    
    box-sizing: border-box;
    position: relative;
    ${props => props.small ? `
        top: 1px;
    ` : ''}
    width: ${props => props.small ? '16px' : '34px'};
    height: ${props => props.small ? '16px' : '34px'};;
    border: ${props => props.small ? '1px' : '3px'} solid ${props => props.small ? Colours.n700 : Colours.n300};
    border-radius: 50%;
    transition: border-color .25s; 

    ${props => props.active ? `
        border-color: ${Colours.b500};
    
        &:after {
            box-sizing: border-box;
            position: absolute;
            display: block;
            content: "";
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: ${props.small ? '8px' : '16px'};
            height: ${props.small ? '8px' : '16px'};
            background: ${Colours.b500};
            border-radius: 50%;
        }
    ` : ''}
`

const Row = styled.div`
    display: flex;
    align-item: center;
    gap: 4px;
    cursor: pointer;
`

const Label = styled.div`
    color: ${props => props.active ? 'black' : Colours.n500};

    &:hover {
        color: black;
    }
`

/**
 * Radio button
 * 
 * Used to expose a series of buttons, only one of which can be active.
 * 
 * @param setter            Function    Function to update the selected value when it changes
 * @param value             Any         Value to set when this button is active
 * @param containerStyle    Object      If present set on the topmost container
 * @param children          Renderable  Content to render
 * @example 
 *  const [value, setValue] = useState("one")
 * 
 *  <RadioButton value="one" setter={setValue} />
 *  <RadioButton value="two" setter={setValue} /> 
 *  <RadioButton value="three" setter={setValue} />
 */
function RadioButton({children, containerStyle, ...props}) {
    return <Row onClick={e => props.setter(props.value)} style={containerStyle ? containerStyle : {}}>
        <Container className="radiobtn"  {...props} active={props.current == props.value}></Container>
        {children ? <Label active={props.current == props.value}>{children}</Label> : null}
    </Row>
}

export default RadioButton
