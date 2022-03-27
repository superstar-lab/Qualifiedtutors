import styled from 'styled-components'

const Container = styled.span`
   position: relative;

   &:after {
        display: block;
        content: "";
        position: absolute;
        bottom: ${props => props.offset ? props.offset : '-8.8px'};
        width: 68%;
        height: 16px;
        background: url('/img/line.svg') no-repeat center center;
        background-size: contain;
        transform: translateX(-50%);
        left: 58%;

        ${props => props.large ? `
            bottom: ${props.offset ? props.offset : '-12.8px'};
            width: 80%;
            height: 26px;
            background: url('/img/line_2.svg') no-repeat center center;
            background-size: 100% 100%;
            transform: translateX(-47%);
            left: 50%;
        ` : ''}
   }
`

/**
 * Renders a red line underneath its contents
 *
 * @param children  Renderable
 * @example 
 *  <h1>This is a heading with an <Underlined>word</Underlined>.</h1>
 */
function Underline(props) {
    return (
        <Container {...props}>{props.children}</Container>
    )
}

export default Underline
