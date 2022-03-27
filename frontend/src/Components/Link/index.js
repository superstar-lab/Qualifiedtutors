import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import Colours from '../../Config/Colours.js'

const StyledLink = styled(RouterLink)`
    text-decoration: none;
    color: ${Colours.n600};
    transition: opacity .25s, background .25s, color .25s;
    opacity: 1;
    user-select: none;

    &:active, &:visited {
        color: ${Colours.n600};
    }

    &:hover {
        color: ${Colours.n200};

        & > .back-arrow {
            background: url('/img/back_black_18.webp');
        }
    }



    ${props => props.primary && !props.btn ? `
        color: ${Colours.b500};
        &:active, &:visited { color: ${Colours.b500};  }

        &:hover {
            color: ${Colours.b400};

            &:active, &:visited {
                color: ${Colours.b400};
            }
        }
    ` : ''}

    ${props => props.black ? `
        color: black;
        &:active, &:visited { color: black; }

        &:hover {
            font-weight: bold;
        }
    ` : ''};

    ${props => props.danger ? `
        color: ${Colours.r500};
        &:active, &:visited { color: ${Colours.r500}; }

        &:hover {
            color: ${Colours.r400};

            &:active, &:visited {
                color: ${Colours.r400};
            }
        }
    ` : ''};

    ${props => props.active ? `
        font-weight: bold;
        color: ${Colours.n200};
        &:active, &:visited { color: ${Colours.n200}; }
    ` : ''}

    ${props => props.disabled ? `
        cursor: not-allowed;
        opacity: .33;


    ` : ''}
    ${props => props.disabled && props.btn ? `
        background: ${Colours.n600};
    ` : ''}
    

    ${props => props.btn ? `
        background: ${props.primary ? Colours.b500 : (props.danger ? Colours.r500 : 'white')};
        color: ${Colours.n900};
        border-radius: 4px;
        font-weight: bold;
        flex: 0;
        white-space: nowrap;
        transition: background .8s;
        background-position: center;

        ${props.small ? `
            padding: 10.56px 20px;
        ` : `
            padding: 20px 24px;
            font-size: 21px;
        `}

        &:visited { color: ${Colours.n900}; }
        
        &:hover {
            background: ${props.primary ? Colours.b550 : (props.danger ? Colours.r550 : 'white')} radial-gradient(circle, transparent 1%, ${props.primary ? Colours.b550 : (props.danger ? Colours.r550 : 'white')} 1%) center/15000%;
        }
        &:active {
            color: ${Colours.n900};
            background-color: ${props.primary ? Colours.b600 : (props.danger ? Colours.r600 : 'white')};
            background-size: 100%;
            transition: background 0s;
        }
    ` : ''}
`

/**
 * Link
 * 
 * Renders an anchor 
 * 
 * @param   onClick Function(event) 
 * @param   active  Boolean
 * @param   primary Boolean
 * @param   danger  Boolean
 * @param   btn     Boolean
 * @param   small   Boolean
 * @returns 
 */

function Link({active, primary, btn, small, ...props}) {
    const handleClick = event => {
        props.onClick && props.onClick(event)
        if (event.defaultPrevented) { return }

        window.scrollTo(0, 0)

        props.disabled && event.preventDefault()
    }

    return <StyledLink 
        {...props} 
        active={active ? 1 : 0}  
        primary={primary ? 1 : 0}
        btn={btn ? 1 : 0}
        small={small ? 1 : 0}
        onClick={handleClick}
    >{props.children}</StyledLink>
}

export default Link
