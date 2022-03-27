import styled from 'styled-components'
import Colours from '../../Config/Colours.js'

const Button = styled.button`
    background: ${Colours.b500};
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: 0;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    
    transition: background .8s;
               background-position: center;

    ${props => props.large ? `
        white-space: nowrap;
        padding: 20px 24px;
        font-size: 21px;
    ` : ''}

    ${props => props.disabled ? `
        cursor: not-allowed;
        background: #757575;
        opacity: .33;
    ` : ''}

    ${props => props.danger ? `
        background: ${Colours.r500};
    ` : ''}

    ${props => props.outline ? `
        border: 1px solid ${Colours.b500};
        background: white;
        color: ${Colours.n500};
        font-weight: lighter;

        &:hover {
            background: ${Colours.b500};
            color: white;
        }

        ${props.white ? `
            border: 1px solid white;
        ` : ''}
    ` : ''}

    ${props => props.square ? `
        border-radius: 0;
    ` : ''}

    ${props => !props.disabled ? `
        &:hover {
            background: ${props.danger ? Colours.r550 : Colours.b550} radial-gradient(circle, transparent 1%, ${props.danger ? Colours.r550 : Colours.b550} 1%) center/15000%;
        }
        &:active {
            background-color: ${props.danger ? Colours.r600 : Colours.b600};
            background-size: 100%;
            transition: background 0s;
        }
    ` : ''}
    
    ${props => props.primary ? `
        background: ${Colours.b500};
        color: white;
    ` : ''}
`

/**
 * Button
 * 
 * Displays a button users can click.
 * 
 * @param disabled  Boolean             Disables the click action of the button and changes its appearance
 * @param onClick   Function(event)     Called when a user clicks the button
 * @param children  Collection          Displayed as the contents of the button
 * @param primary   Boolean             Renders in solid blue (b500)
 * @param danger    Boolean             Renders in solid red (r500)
 * @param white     Boolean             Renders a white border
 * @param outline   Boolean             Renders a blue border (b500)
 * @param large     Boolean             Increases the size of the button
 * @param square    Boolean             Renders without rounded edges
 */
export default props => <Button onClick={e => !props.disabled && props.onClick && props.onClick(e)} {...props}>{props.children}</Button>
