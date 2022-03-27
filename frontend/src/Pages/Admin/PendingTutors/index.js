import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import {Helmet} from "react-helmet"
import styled from "styled-components"
import { API, Button, Dropdown, Input, Table, Toast } from "../../../Components"
import Colours from "../../../Config/Colours"
import zIndex from "../../../Config/zIndex"
import AvailabilitySelector from "../../FinaATutor/Components/AvailabilitySelector"

const Container = styled.div`
    & .filterwrapper {
        & > div {
            align-items: center;
        }
        & .inputcontainer {
            align-items: center;
            display: flex;
        }

        & .filterrow {
            gap: 16px;
            margin-bottom: 16px;
        }
    }

    & .filtertr {
        position: sticky;
        top: 79px;
        z-index: ${zIndex.top + 1};
        border: .5px solid #E0E0E0;
        border-bottom: 0;
        display: flex;
        padding-left: 16px;
        padding-right: 16px;
    }
`

const Row = styled.div`
    display: flex;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
`

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`

const Tag = styled.div`
    background: ${Colours.b500};
    color: white;
    border-radius: 3px;
    padding: 4px 6px;
`

/**
 * Manage pending tutor registrations for Admins
 * 
 * Allows admins to query/approve/reject registrations of new tutors
 * 
 * @param user      Object
 */
function PendingTutors({user}) {

    const [pendingTutors, setPendingTutors] = useState([])
    const [pagination, setPagination] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [fixedSubjects, setFixedSubjects] = useState([])
    const [fixedLevels, setFixedLevels] = useState([])

    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [selectedLevels, setSelectedLevels] = useState([])

    const [search, setSearch] = useState("")
    const [filtersCollapsed, setFiltersCollapsed] = useState(false)

    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false]
    })
    const [hasAvailabilitySet, setHasAvailabilitySet] = useState(false)

    useEffect(() => {
        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            setHasAvailabilitySet(true)
        } else {
            setHasAvailabilitySet(false)
        }
    }, [availability])

    const history = useHistory()

    const buildTutorParams = () => {
        
        const params = {}
        
        if (selectedSubjects) {
            params.subjects = selectedSubjects.map(sub => sub.id)
        }

        if (selectedLevels) {
            params.levels = selectedLevels
        }

        if (search) {
            params.search = search
        }

        if (
            availability.morning.find(v => v) ||
            availability.afternoon.find(v => v) ||
            availability.evening.find(v => v)
        ) {
            params.availability = availability
        }

        return params
    }

    const getPendingTutors = async (overrideParams) => {
        try {

            const params = overrideParams ? null : buildTutorParams()

            const response = await API.get('admin/pending_tutors', {
                params
            })
            if (response && response.data && response.data.data) {
                setPendingTutors(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Unexpected error fetching pending tutors. Refresh to try again.")
        }
    }

    useEffect(() => {
        
        const getSubjects = async () => {
            try {
                const response = await API.get('subjects')
                if (response && response.data) {
                    setFixedSubjects(response.data)
                } else {
                    throw new Error('Unexpected API response')
                }
            } catch (error) {
                Toast.error("Unexpected error fetching subjects. Refresh to try again.")
            }
        }

        const getLevels = async () => {
            try {
                const response = await API.get('subjects/levels')
                if (response && response.data) {
                    setFixedLevels(response.data)
                } else {
                    throw new Error('Unexpected API response')
                }
            } catch (error) {
                Toast.error("Unexpected error fetching levels. Refresh to try again.")
            }
        }

        getPendingTutors()
        getSubjects()
        getLevels()
    }, [])

    const reviewApplication = uuid => {
        history.push('/admin/pending-tutor-registrations/' + uuid)
    }

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url, {
                params: buildTutorParams()
            })

            if (response && response.data && response.data.data) {
                setPendingTutors(response.data.data)
                setPagination(response.data.links)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("An unexpected error occured fetching pending tutors, refresh to try again.")
        }

        setLoading(false)
    }
 

    const timestampToString = (dt) => {
        if (!dt) { return "" }
        return new Date(dt).toDateString()
    }

    const addSubjectFilter = (value, node) => {

        if (selectedSubjects.find(sub => sub.id == node.key)) { return }

        setSelectedSubjects([
            ...selectedSubjects,
            fixedSubjects.find(sub => sub.id == node.key)
        ])
    }

    const addLevelFilter = (value, node) => {

        if (selectedLevels.includes(value)) { return }

        setSelectedLevels([
            ...selectedLevels,
            value
        ])
    }

    const removeSubjectFilter = id => {
        setSelectedSubjects(selectedSubjects.filter(sub => sub.id != id))
    }

    const removeLevelFilter = lvl => {
        setSelectedLevels(selectedLevels.filter(l => l != lvl))
    }

    const clearFilters = () => {
        setSelectedLevels([])
        setSelectedSubjects([])
        setSearch("")
        setAvailability({
            morning: [false, false, false, false, false, false, false],
            afternoon: [false, false, false, false, false, false, false],
            evening: [false, false, false, false, false, false, false]
        })

        getPendingTutors(true)
    }

    return <Container>

        <Row style={{background: Colours.n825}} className="filtertr">
            <div className="filterwrapper" style={{flex: 1}}>
                <Row className='filterrow' style={{marginTop: '16px'}}>
                    <Input 
                        active={!!search}
                        style={{marginBottom: '0'}}
                        placeholder="Search text fields (name, address, profile, etc.)" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />

                    <Dropdown
                        active={hasAvailabilitySet}
                        placeholder="Search Availability"
                        style={{minWidth: '320px'}}
                        listStyle={{width: '436px', overflow: 'hidden'}}
                        component={<AvailabilitySelector availability={availability} setAvailability={setAvailability} />}
                    />
                </Row>

                    <Row className="filterrow" style={{alignItems: 'flex-start'}}>
                        <div  style={{flex: 1, display: 'flex', gap: '8px', flexDirection: 'column'}}>
                            <Dropdown
                                active={selectedSubjects.length > 0}
                                placeholder="Add subject filter"
                                onChange={addSubjectFilter}
                                style={{minWidth: '198px'}}
                            >
                                {fixedSubjects.map(sub => <div key={sub.id}>{sub.subject}</div>)}
                            </Dropdown>

                            <Row style={{flexWrap: 'wrap', gap: '8px'}}>
                                {selectedSubjects.map(sub => <Tag>{sub.subject} &nbsp; <img alt="remove" onClick={e => removeSubjectFilter(sub.id)} src="/img/close.webp" style={{width: '12px', height: '12px', cursor: 'pointer'}} /></Tag>)}
                            </Row>
                        </div>

                        <div  style={{flex: 1, display: 'flex', gap: '8px', flexDirection: 'column'}}>
                            <Dropdown
                                active={selectedLevels.length > 0}
                                placeholder="Add level filter"
                                onChange={addLevelFilter}
                                style={{minWidth: '198px'}}
                            >
                                {fixedLevels.map((lvl, id) => <div key={id}>{lvl}</div>)}
                            </Dropdown>

                            <Row style={{marginLeft: '16px', flexWrap: 'wrap', gap: '8px'}}>
                                {selectedLevels.map(lvl => <Tag>{lvl} &nbsp; <img alt="remove" onClick={e => removeLevelFilter(lvl)} src="/img/close.webp" style={{width: '12px', height: '12px', cursor: 'pointer'}} /></Tag>)}
                            </Row>
                        </div>

                        <div style={{display: 'flex', gap: '8px'}}>
                            <Button outline style={{whiteSpace: 'nowrap'}} onClick={clearFilters}>Clear filters</Button>
                            <Button primary style={{whiteSpace: 'nowrap'}} onClick={e => getPendingTutors()}>Apply filters</Button>
                        </div>
                    </Row>
            </div>
        </Row>

        <Table.Table>
            <Table.Head>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Email</Table.Heading>
                <Table.Heading>Phone</Table.Heading>
                <Table.Heading>Subjects</Table.Heading>
                <Table.Heading>Created</Table.Heading>
                <Table.Heading></Table.Heading>
            </Table.Head>

            <Table.Body>
                
                {pendingTutors.map(tutor => <Table.Row>
                    <Table.Col>{tutor.name} {tutor.surname}</Table.Col>
                    <Table.Col>{tutor.email}</Table.Col>
                    <Table.Col>{tutor.mobile_number}</Table.Col>
                    <Table.Col><Tags style={{padding: '8px 0'}}>{tutor.subjects.map(subject => <Tag>{subject.subject + '@' + subject.pivot.level}</Tag>)}</Tags></Table.Col>
                    <Table.Col>{timestampToString(tutor.created_at)}</Table.Col>
                    <Table.Col>
                        <Button outline onClick={e => reviewApplication(tutor.message_uuid)}>Review</Button>
                    </Table.Col>
                </Table.Row>)}
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? 
            <>
                <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total pending tutor registrations match filters</Row>
                <Row style={{justifyContent: 'space-between', gap: '16px'}}>
                    <div><Button disabled={loading || !pagination[0].url} outline onClick={e => fetchPage(pagination[0].url)}>Previous</Button></div>
                    <div style={{display: 'flex', gap: '16px'}}>
                        {pagination.slice(1, -1).map(link => <Button disabled={loading} outline={!link.active} primary={link.active} active={link.active} onClick={e => fetchPage(link.url)}>{link.label.replace('&laquo;', '').replace('&raquo;', '')}</Button>)}
                    </div>
                    <div><Button disabled={loading || !pagination[pagination.length - 1].url} outline onClick={e => fetchPage(pagination[pagination.length - 1].url)}>Next</Button></div>
                </Row>
            </>
        : null}
    </Container>
}

export default PendingTutors