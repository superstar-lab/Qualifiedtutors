import styled from 'styled-components'

const Container = styled.div`
    max-width: ${props => props.width ? props.width : '1440px'};
    margin: 0 auto;
`

/**
 * Renders a container with a max width
 * 
 * @param width     Integer       Maximum width of the container
 * @param children  Renderable    Contents to render
 * @returns 
 */
function FixedWidth(props) {
    return <Container {...props} className="fixedWidth">
        {props.children}
    </Container>
}

export default FixedWidth
