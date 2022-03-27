import { useEffect, useRef, useState } from 'react'
import {Helmet} from "react-helmet"
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Checkbox, Input, Toast, API, Modal, Card, Dropdown } from '../../../Components'
import * as Table from '../../../Components/Table'
import Colours from '../../../Config/Colours'
import zIndex from '../../../Config/zIndex'
import AvailabilitySelector from '../../FinaATutor/Components/AvailabilitySelector'

const Container = styled.div`
    & .filterrow {
        padding: 16px 0;
        align-items: center;
        gap: 16px;
        

        & .inputcontainer {
            margin-bottom: 0;
            height: 45px;
        }
    }

    & .filtertr {
        position: sticky;
        top: 78px;
        z-index: ${zIndex.top + 1};
        border: .5px solid #E0E0E0;
        border-bottom: 0;
        padding: 0 16px;

        & .filterwrapper {
            flex: 1;
        }
        
    }

    & .useractions {
        position: sticky;
        top: 227px;
        z-index: ${zIndex.top};
        background: white;

        & > td {
            overflow: hidden;
            height: 0;
        }

        &.active {
            & > td {
                height: auto;
            }   
        }

        & > td > div {
            align-items: center;
            gap: 18px;

            & > div:last-of-type {
                gap: 8px;
            }
        }
    }
`

const Row = styled.div`
    display: flex;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
`

const Tag = styled.div`
    background: ${Colours.b500};
    color: white;
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    & > img {
        cursor: pointer;
    }
`

/**
 * Manage users for Admins
 * 
 * Allows admins to query/edit users
 * 
 * @param user      Object
 * @param setUser   Function
 */
function ManageUsers({user, setUser}) {

    const [users, setUsers] = useState([])
    const [pagination, setPagination] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [totalTutors, setTotalTutors] = useState(null)
    const [totalStudents, setTotalStudents] = useState(null)
    const [totalPendingTutors, setTotalPendingTutors] = useState(null)
    const [totalPendingStudents, setTotalPendingStudents] = useState(null)
    
    const [selectedUsers, setSelectedUsers] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const [selectAllLoading, setSelectAllLoading] = useState(false)

    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [emailModalVisible, setEmailModalVisible] = useState(false)

    const [textSearch, setTextSearch] = useState("")
    const [tutorFilter, setTutorFilter] = useState(false)
    const [studentFilter, setStudentFilter] = useState(false)
    const [adminFilter, setAdminFilter] = useState(false)

    const [message, setMessage] = useState("")
    const [replyTo, setReplyTo] = useState("support@qualifiedtutors.co.uk")
    const [subject, setSubject] = useState("")

    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [selectedLevels, setSelectedLevels] = useState([])
    const [fixedSubjects, setFixedSubjects] = useState([])
    const [fixedLevels, setFixedLevels] = useState([])

    const [availability, setAvailability] = useState({
        morning: [false, false, false, false, false, false, false],
        afternoon: [false, false, false, false, false, false, false],
        evening: [false, false, false, false, false, false, false]
    })
    const [hasAvailabilitySet, setHasAvailabilitySet] = useState(false)

    const [filtersCollapsed, setFiltersCollapsed] = useState(false)

    const filtersRef = useRef()
    const userActionsRef = useRef()

    const history = useHistory()

    const buildParams = () => {
        const params = {
            search: textSearch,
            tutorFilter,
            studentFilter,
            adminFilter
        }

        if (selectedSubjects) {
            params.subjects = selectedSubjects
        }

        if (selectedLevels) {
            params.levels = selectedLevels
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

    useEffect(() => {
        const getUsers = async () => {

            try {
                const response = await API.get('admin/users')

                if (response && response.data && response.data.data) {
                    setUsers(response.data.data)
                    setPagination(response.data.links)
                    setTotal(response.data.total)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("An unexpected error occured fetching users, refresh to try again.")
            }
        }

        const getSubjects = async () => {
            try {
                const response = await API.get('subjects')
                if (response && response.data) {
                    setFixedSubjects(response.data)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch(error) {
                Toast.error("Unexpected error fetching subjects, refresh to try again.")
            } 
        }

        const getLevels = async () => {
            try {
                const response = await API.get('subjects/levels')
                if (response && response.data) {
                    setFixedLevels(response.data)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching levels, refresh to try again.")
            }
        }

        const getTotals = async () => {
            try {
                const response = await API.get('admin/users/totals')
                if (response && response.data && response.data.success) {
                    setTotalTutors(response.data.tutors)
                    setTotalStudents(response.data.students)
                    setTotalPendingTutors(response.data.pendingTutors)
                    setTotalPendingStudents(response.data.pendingStudents)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching totals, refresh to try again.")
            }
        }

        getUsers()
        getSubjects()
        getLevels()
        getTotals()
    }, [])

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url, {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setUsers(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("An unexpected error occured fetching users, refresh to try again.")
        }

        setLoading(false)
    }

    const loginAsUser = async id => {
        try {
            const response = await API.post('admin/users/impersonate', {
                user_id: id
            })

            if (response && response.data && response.data.success) {
                history.push('/')
                setUser({
                    ...response.data.user,
                    return_token: response.data.return_token
                })
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Failed to impersonate user, please try again.")
        }
    }

    const filter = async () => {

        try {
            const response = await API.get('admin/users', {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setUsers(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured fetching users, please try again.")
        }
    }

    const selectDeselectUser = (id, value) => {
        if (value) {
            if (!selectedUsers.find(uid => uid == id)) { setSelectedUsers([...selectedUsers, id]) }
        } else {
            if (selectedUsers.find(uid => uid == id)) { setSelectedUsers(selectedUsers.filter(uid => uid != id)) }
        }
    }

    const selectDeselectAll = value => {

        let selected = [...selectedUsers]
        const userIds = users.map(user => user.id)

        if (!value) {
            for(const user of users) {
                selected = selected.filter(uid => !userIds.includes(uid))
            }
        } else {
            for (const user of users) {
                if (!selected.find(uid => uid == user.id)) { selected.push(user.id) }
            }
        }

        setSelectedUsers(selected)
    }

    const selectAllUsers = async () => {

        setSelectAllLoading(false)
        try {
            const response = await API.get('admin/select_all_users', {
                params: buildParams()
            })

            if (response && response.data && response.data.ids) {
                setSelectedUsers(response.data.ids)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured selecting all users, please try again.")
        }
        setSelectAllLoading(true)
    }

    const timestampToString = (dt) => {
        if (!dt) { return "" }
        return new Date(dt).toDateString()
    }

    const sendMassEmail = async () => {
        try {
            const params = {
                userIds: selectedUsers,
                message: message
            }

            if (subject) { params.subject = subject }
            if (replyTo) { params.replyTo = replyTo }

            const response = await API.post('admin/users/massemail', params)

            if (response && response.data && response.data.success) {
                setMessage("")
                setSubject("")
                setReplyTo("support@qualifiedtutors.co.uk")
                Toast.success("Your emails have been sent")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Failed to send emails, please try again.")
        }

        setEmailModalVisible(false)
    }

    const deleteUsers = async () => {
        try {
            const response = await API.post('admin/users/massdelete', {
                userIds: selectedUsers
            })
            if (response && response.data && response.data.success) {
                const currentUsers = users.map(u => ({...u}))
                setUsers(currentUsers.filter(u => !selectedUsers.includes(u.id)))     
                setSelectedUsers([])           
                Toast.success("Successfully deleted users")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error deleting users, please try again.")
        }

        setDeleteModalVisible(false)
    }

    const clearFilters = () => {
        setTextSearch("")
        setTutorFilter(false)
        setStudentFilter(false)
        setAdminFilter(false)
        setSelectedSubjects([])
        setSelectedLevels([])
        setAvailability({
            morning: [false, false, false, false, false, false, false],
            afternoon: [false, false, false, false, false, false, false],
            evening: [false, false, false, false, false, false, false]
        })

        filter()
    }

    const newUser = () => {
        history.push('/admin/new-user')
    }

    useEffect(() => {
        let all = true 
        for(const user of users) {
            if (!selectedUsers.find(uid => user.id == uid)) {
                all = false
            }
        }

        setAllSelected(all)
    }, [selectedUsers, users])

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

    useEffect(() => {
        const height = filtersRef.current.offsetHeight - 149
        userActionsRef.current.style.top = (227 + height) + "px"
    }, [selectedSubjects, selectedLevels])

    return <Container>
        <Row style={{marginBottom: '16px', justifyContent: 'flex-start'}}><b>{totalTutors}</b> &nbsp; total tutors / &nbsp;<b>{totalStudents}</b> &nbsp; total students / &nbsp;<b>{totalPendingTutors}</b> &nbsp; total pending tutors / &nbsp;<b>{totalPendingStudents}</b> &nbsp; total pending students</Row>
        
        <Row style={{background: Colours.n825}} className={"filtertr "  + (filtersCollapsed ? 'collapsed' : '')} ref={filtersRef}>
                <div className='filterwrapper'>
                    <Row className='filterrow'>
                        <Input 
                            placeholder="Search text fields (name, email, phone, address, etc.)" 
                            active={!!textSearch}
                            value={textSearch} 
                            onChange={e => setTextSearch(e.target.value)} 
                        />

                        <Dropdown 
                            active={hasAvailabilitySet}
                            placeholder="Search Availability"
                            listStyle={{width: '436px', overflow: 'hidden'}}
                            component={<AvailabilitySelector availability={availability} setAvailability={setAvailability} />}
                        />
                        <Checkbox label="Tutor" value={tutorFilter} setter={setTutorFilter} />
                        <Checkbox label="Student" value={studentFilter} setter={setStudentFilter} />
                        <Checkbox label="Admin" value={adminFilter} setter={setAdminFilter} />
                    </Row>
                    
                    <Row style={{marginBottom: '16px', gap: '16px', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}}>
                            <Dropdown
                                active={selectedSubjects.length > 0}
                                placeholder="Add subject filter"
                                style={{minWidth: '198px'}}
                                listStyle={{zIndex: zIndex.top + 1}}
                                onChange={(value, node) => !selectedSubjects.find(sid => sid == node.key) && setSelectedSubjects([...selectedSubjects, node.key])}
                            >
                                {fixedSubjects.map(subject => <div key={subject.id}>{subject.subject}</div>)}
                            </Dropdown>

                            <Row style={{gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px'}}>
                                {selectedSubjects.map(id => <Tag>{fixedSubjects.find(s => s.id == id).subject} <img onClick={e => setSelectedSubjects(selectedSubjects.filter(sid => sid != id))} style={{width: '16px'}} alt="remove" src="/img/close.webp" /></Tag>)}
                            </Row>
                        </div>
                        
                        <div style={{flex: 1}}>
                            <Dropdown
                                active={selectedLevels.length > 0}
                                placeholder="Add level filter"
                                style={{minWidth: '198px'}}
                                listStyle={{zIndex: zIndex.top}}
                                onChange={(value, node) => !selectedLevels.find(l => l == value) && setSelectedLevels([...selectedLevels, value])}
                            >
                                {fixedLevels.map((level, index) => <div key={index}>{level}</div>)}
                            </Dropdown>

                            <Row style={{gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '8px'}}>
                                {selectedLevels.map(lvl => <Tag>{lvl} <img alt="remove" onClick={e => setSelectedLevels(selectedLevels.filter(l => l != lvl))} style={{width: '16px'}} src="/img/close.webp" /></Tag>)}
                            </Row>
                        </div>

                        <div style={{display: 'flex', gap: '8px', marginTop: '4px'}}>
                            <Button outline style={{whiteSpace: 'nowrap'}} onClick={clearFilters}>Clear filters</Button>
                            <Button primary style={{whiteSpace: 'nowrap'}} onClick={filter}>Apply filters</Button>
                        </div>
                    </Row>
                </div>
        </Row>
        
        <Table.Table>
            <Table.Head>
                <Table.Heading style={{padding: '8px', width: '16px'}}></Table.Heading>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Email</Table.Heading>
                <Table.Heading>Role</Table.Heading>
                <Table.Heading>Last Login</Table.Heading>
                <Table.Heading>Created</Table.Heading>
                <Table.Heading></Table.Heading>
            </Table.Head>

            <Table.Body>
                <Table.Row className={'useractions ' + (selectedUsers.length > 0 ? 'active' : '')} ref={userActionsRef}>
                    <Table.Col colSpan="7">
                        <Row>
                            <Checkbox value={allSelected} setter={v => selectDeselectAll(v)} />
                            <p>{selectedUsers.length} users selected</p>
                            
                            <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
                                <Button outline onClick={newUser}>New user</Button>
                                <Button outline onClick={selectAllUsers}>Select all</Button>
                                <Button outline disabled={selectedUsers.length == 0} onClick={e => setSelectedUsers([])}>Deselect all</Button>
                                <Button outline disabled={selectedUsers.length == 0} onClick={e => setEmailModalVisible(true)}>Email users</Button>
                                <Button danger disabled={selectedUsers.length == 0} onClick={e => setDeleteModalVisible(true)}>Delete users</Button>
                            </div>
                        </Row>
                    </Table.Col>
                </Table.Row>

                

                

                {users.map(user => <Table.Row>
                    <Table.Col><Checkbox value={selectedUsers.find(id => user.id == id)} setter={v => selectDeselectUser(user.id, v)} /></Table.Col>
                    <Table.Col>{user.name} {user.surname}</Table.Col>
                    <Table.Col>{user.email}</Table.Col>
                    <Table.Col>
                        {user.role == 'client' ? 'student' : user.role}
                    </Table.Col>
                    <Table.Col>
                        {timestampToString(user.last_login)}
                    </Table.Col>
                    <Table.Col>
                        {timestampToString(user.created_at)}
                    </Table.Col>
                    <Table.Col>
                        {user.role != 'admin' ? <Button style={{whiteSpace: 'nowrap'}} outline onClick={e => loginAsUser(user.id)}>Login as user</Button> : null}
                    </Table.Col>
                </Table.Row>)}
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? <>
            <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total users match filters</Row>
            <Row style={{justifyContent: 'space-between', marginTop: '32px', gap: '16px'}}>
                <div><Button disabled={loading || !pagination[0].url} outline onClick={e => fetchPage(pagination[0].url)}>Previous</Button></div>
                <div style={{display: 'flex', gap: '16px'}}>
                    {pagination.slice(1, -1).map(link => <Button disabled={loading} outline={!link.active} primary={link.active} active={link.active} onClick={e => fetchPage(link.url)}>{link.label.replace('&laquo;', '').replace('&raquo;', '')}</Button>)}
                </div>
                <div><Button disabled={loading || !pagination[pagination.length - 1].url} outline onClick={e => fetchPage(pagination[pagination.length - 1].url)}>Next</Button></div>
            </Row>
        </>: null}
        
        <Modal visible={deleteModalVisible} dismiss={e => setDeleteModalVisible(false)}>
            <Card>
                <p>Are you sure you want to delete {selectedUsers.length} user(s)?</p>
                <Row style={{justifyContent: 'space-between', flex: 1}}>
                    <Button primary onClick={e => setDeleteModalVisible(false)}>Cancel</Button>
                    <Button danger onClick={deleteUsers}>Confirm</Button>
                </Row>
            </Card>
        </Modal>

        <Modal visible={emailModalVisible} dismiss={e => setEmailModalVisible(false)}>
            <Card style={{minWidth: '350px'}}>
                <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                <Input label="Reply-to" value={replyTo} onChange={e => setReplyTo(e.target.value)} />
                <Input text label="Message" style={{height: '256px', marginBottom: '48px'}} value={message} onChange={e => setMessage(e.target.value)} />

                <Row style={{justifyContent: 'space-between', flex: 1}}>
                    <Button outline onClick={e => setEmailModalVisible(false)}>Cancel</Button>
                    <Button primary onClick={sendMassEmail}>Send</Button>
                </Row>
            </Card>
        </Modal>
    </Container>
}

export default ManageUsers