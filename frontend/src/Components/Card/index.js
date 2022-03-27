import styled from 'styled-components'
import Colours from '../../Config/Colours.js'

const Container = styled.div`
    position: relative;
    background: white;
    border: 1px solid ${Colours.n300};
    border-radius: 4px;
    padding: 64px;
    box-shadow: 0 0 1px rgba(48, 48, 51, 0.05), 0 4px 8px rgba(48, 48, 51, 0.1);
    display: flex;
    flex-direction: column;
    transition: background .25s;

    ${props => props.centered ? `
        justify-content: center;
        align-items: center;
        text-align: center;
    ` : ''}

    ${props => props.primary ? `
        border: 1px solid ${Colours.b500};
        box-shadow: 0px 0px 1px ${Colours.b500}, 0px 16px 24px rgba(143, 200, 255, 0.2);
    ` : ''}

    & h2 {
        font-size: 26px;
        line-height: 40px;
    }

    ${props => !props.primary ? `
        & > h2:first-of-type {
            margin-bottom: 64px;
        }
    ` : ''}

    ${props => props.hover ? `
        &:hover {
            background: ${Colours.b075};
        }

        &:hover .radiobtn {
            border-color: ${Colours.b500};
            
        }
    ` : ''}

`

/**
 * Card
 * 
 * Renders contents with a background, border and box shadow
 * 
 * @param centered  Boolean     Center aligns card content 
 * @param primary   Boolean     Renders with a blue border and box shadow
 * @param hover     Boolean     Changes appearance on hover
 * @param ref       Ref         Can be used to get access to the container DOM node
 * @param children  Collection  Contents of the card
 * 
 * @example 
 *  <Card>
 *      <h1>Title</h1>
 *      <p>Content</p>
 *  </Card>
 * 
 * @example 
 *  const cardRef = useRef()
 *  
 *  useEffect(() => {
 *      // Do something with the DOM node available as cardRef.current
 *  }, [cardRef])
 * 
 *  ...
 *  <Card ref={cardRef}>
 *      ...
 *  </Card>
 */
function Card({ref, ...props}) {
    return (
        <Container className="card" {...props} innerRef={ref}>
            {props.children}
        </Container>
    )
}

export default Card
