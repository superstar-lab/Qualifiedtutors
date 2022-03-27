import styled from 'styled-components'
import Colours from '../../Config/Colours'

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const Tab = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    border-bottom: 2px solid ${Colours.n700};
    border-right: 2px solid ${Colours.n825};
    user-select: none;
    cursor: pointer;
    background: white;
    transition: background .25s;
    font-size: 14px;
    line-height: 20px;

    &:hover {
        background: ${Colours.b050};
    }

    &:last-of-type {
        border-right: 0;
    }

    ${props => props.active ? `
        border-bottom: 2px solid ${Colours.b500};
    ` : ''}
`

const Content = styled.div`

    ${props => props.active ? `
        display: none;
    ` : ''}
`

const Row = styled.div`
    display: flex;
`

/**
 * Renders a set of tabs and the contents of the active tab
 * 
 * @param tabs          Array[Object]   {name, content}
 * @param active        Integer         Index of the active tab
 * @param setActive     Function        Setter for the active index
 * @param style         Object          If present included on the outermost container
 * @param headingStyle  Object          If present included on the heading row
 * @example
 *  const [active, setActive] = useState(0)
 *  
 *  ...
 * 
 *  <Tabs active={active} setActive={setActive} tabs={[
 *      name: 'Tab 1',
 *      content: <div>
 *          <h1>Tab 1 content</h1>
 *      </div>
 *  ], [
 *      name: 'Tab 2',
 *      content: <div>
 *          <h1>Tab 2 content</h1>
 *      </div>
 *  ]} />
 */
function Tabs({tabs, active, setActive, style, headingStyle}) {

    return <Container style={style ? style : {}}>
        <Row style={headingStyle ? headingStyle : {}}>
            {tabs.map((tab, index) => <Tab active={active == index} onClick={e => setActive(index)}>{tab.title}</Tab>)}
        </Row>
        
        {tabs.map((tab, index) => <Content key={index} active={active == index}>
            {tab.content}
        </Content>)}
    </Container>
}

export default Tabs