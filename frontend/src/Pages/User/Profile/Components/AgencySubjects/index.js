import styled from "styled-components"
import { useEffect, useState } from 'react'
import * as Table from "../../../../../Components/Table"
import Colours from "../../../../../Config/Colours"
import { Button } from "../../../../../Components"
import useWindowSize from "../../../../../Hooks/UseWindowSize"

const Container = styled.div`

`

const Tabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 36px;
`

const Tab = styled.div`
    color: ${Colours.n500};
    padding: 18px 18px 12px 18px;
    cursor: pointer;
    background: white;
    transition: background .25s, border-bottom .25s;
    border-bottom: 2px solid transparent;

    &:hover {
        background: ${Colours.n830};
    }

    ${props => props.active ? `
        border-bottom: 2px solid ${Colours.b500};
    ` : ''}
`

const Content = styled.div`

`

const Row = styled.div`
    display: flex;
    justify-content: space-between;

    & .expand {
        & .white {
            display: none;
        }

        &:hover {
            & .blue {
                display: none;
            }

            & .white {
                display: inline-block;
            }
        }
    }
`


const Label = styled.label`
    color: ${Colours.b500};
    font-weight: bold;
    display: block;
`

function AgencySubjects({subjects, ...props}) {

    const [categorizedSubjects, setCategorizedSubjects] = useState({})
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedTab, setSelectedTab] = useState(0)
    const [expandSubjects, setExpandSubjects] = useState(false)

    const windowSize = useWindowSize()

    useEffect(() => {
        const catSubs = {}

        for(const subject of subjects) {
            if (!catSubs.hasOwnProperty(subject.subject)) {
                catSubs[subject.subject] = []
            }

            catSubs[subject.subject].push({
                subject: subject.subject,
                level: subject.pivot.level,
                price_in_person: subject.pivot.in_person ? subject.pivot.price_per_hour_in_person : null,
                price_online: subject.pivot.online ? subject.pivot.price_per_hour_online : null
            })
        }

        setCategorizedSubjects(catSubs)
    }, [subjects])

    useEffect(() => {
        const keys = Object.keys(categorizedSubjects)
        if (keys.length && keys.length >= selectedTab) {
            const key = keys[selectedTab]
            setSelectedCategory(categorizedSubjects[key])
        }
    }, [categorizedSubjects, selectedTab])

    return <Container>
        <Tabs>
            {Object.keys(categorizedSubjects).map((subject, index) => <Tab onClick={e => {setSelectedTab(index); setExpandSubjects(false);}} active={selectedTab == index}>{subject.toUpperCase()}</Tab>)}
        </Tabs>

        <Content>
            <Table.Table stacked={windowSize.width < 640}> 
                <Table.Head>
                    <Table.Heading>Subject</Table.Heading>
                    <Table.Heading>Level</Table.Heading>
                    <Table.Heading>Per hour</Table.Heading>
                </Table.Head>

                <Table.Body>
                    {(selectedCategory.length > 5 && !expandSubjects ? selectedCategory.slice(0, 5) : selectedCategory).map(subject => <Table.Row>
                        <Table.Col>
                            {windowSize.width < 640 ? <Label>Subject</Label> : null}
                            {subject.subject}
                        </Table.Col>
                        <Table.Col>
                            {windowSize.width < 640 ? <Label>Level</Label> : null}
                            {subject.level}
                        </Table.Col>
                        <Table.Col>
                            {windowSize.width < 640 ? <Label>Per hour</Label> : null}
                            {subject.price_in_person  ? <div>£{Math.round(subject.price_in_person / 100)} in person</div> : null}
                            {subject.price_online ? <div>£{Math.round(subject.price_online / 100)} online</div> : null}
                        </Table.Col>
                    </Table.Row>)}
                </Table.Body>
            </Table.Table>
            
            <Row style={{margin: '32px 0 12px 0'}}>
                <div></div>
                {selectedCategory.length > 5 ?
                    <Button className="expand" outline onClick={e => setExpandSubjects(!expandSubjects)}>{expandSubjects ? 'See less' : 'See more'} <img alt="discloure arrow" className='blue' src="/img/disclosure.svg" style={!expandSubjects ? {transform: 'rotate(0deg)'} : {transform: 'rotate(180deg)'}} /> <img alt="disclosure arrow" className='white' src="/img/disclosure_white.svg" style={!expandSubjects ? {transform: 'rotate(0deg)'} : {transform: 'rotate(180deg)'}} /> </Button>
                : null}
            </Row>
        </Content>
    </Container>
}

export default AgencySubjects