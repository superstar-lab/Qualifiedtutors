import styled from 'styled-components'
import { Card } from '..'
import Colours from '../../Config/Colours'
import { useState } from 'react'

const Container = styled.div`
 & .card {
     padding: 0 !important;
 }
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: center;
    padding: 20px 32px;
    cursor: pointer;
    background: white;
    transition: background .25s;
    user-select: none;

    & p {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        margin: 0;

        &:hover {
            font-weight: bold;
        }
    }

    & img {
        width: 12px;
        height: 8px;

        ${props => !props.collapsed ? `
            transform: rotate(180deg);
        ` : ''}
    }
`

const Content = styled.div`
    height: 0;
    overflow: hidden;

    ${props => !props.collapsed ? `
        height: auto;
        border-top: 1px solid ${Colours.n815};
        padding: 20px 32px;
    ` : ''}
`

/**
 * Collapsible
 * 
 * Renders a title with collapsible contents
 * 
 * @param title         String      The title to display
 * @param children      Collection  The contents to be displayed in the collapsible panel
 * @param initialState  Boolean     If present sets the initial collapsed state
 * 
 * @example 
 *  <Collapsible title="Example Title">
 *      <img src="/img/example.png" />
 *      <p>Example content</p>
 *  </Collapsible>
 */
function Collapsible(props) {

    const [collapsed, setCollapsed] = useState(props.initialState !== undefined ? props.initialState : true)

    return <Container><Card>
        <Row onClick={e => setCollapsed(!collapsed)} collapsed={collapsed}>
            <p style={{color: Colours.b500}}>{props.title} <img alt="chevron" src="/img/chevron.webp" /></p>
        </Row>
        <Content collapsed={collapsed}>
            {props.children}
        </Content>
    </Card></Container>
}

export default Collapsible