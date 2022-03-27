import { useEffect, useState } from "react"
import {Helmet} from "react-helmet"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { API, Button, Card, Dropdown, Input, Modal, RingLoader, Table, Toast } from "../../../Components"
import toast from "../../../Components/Toast"
import Colours from "../../../Config/Colours"
import zIndex from "../../../Config/zIndex"
import AvailabilitySelector from "../../FinaATutor/Components/AvailabilitySelector"
import PersonalDetails from "../../User/Dashboard/Components/PersonalDetails"

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
 * Manage pending student registrations for Admins
 * 
 * Allows admins to query/approve/reject registrations of new students
 * 
 * @param user      Object
 */
function PendingStudents({user}) {

    const [pendingStudents, setPendingStudents] = useState([])
    const [pagination, setPagination] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const [search, setSearch] = useState("")

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(false)

    const history = useHistory()

    const buildTutorParams = () => {
        
        const params = {}
        
        if (search) {
            params.search = search
        }

        return params
    }

    const getPendingStudents = async (overrideParams) => {
        try {

            const params = overrideParams ? null : buildTutorParams()

            const response = await API.get('admin/pending_students', {
                params
            })
            if (response && response.data && response.data.data) {
                setPendingStudents(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Unexpected error fetching pending students. Refresh to try again.")
        }
    }

    useEffect(() => {

        getPendingStudents()
    }, [])

    const reviewApplication = async uuid => {
        
        setLoadingUser(true)
        try {
            const response = await API.get("admin/student/" + uuid)
            if (response && response.data) {
                setSelectedUser(response.data)
                setModalVisible(true)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            toast.error("Unexpected error fetching user, please try again.")
        }
        setLoadingUser(false)
    }

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url, {
                params: buildTutorParams()
            })

            if (response && response.data && response.data.data) {
                setPendingStudents(response.data.data)
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

   
    const clearFilters = () => {
        
        setSearch("")
       

        getPendingStudents(true)
    }


    const approveUser = async id => {

        try {
            const response = await API.post('admin/student/approve', {
                studentId: id
            })
            if (response && response.data && response.data.success) {
                setModalVisible(false)
                setSelectedUser(null)
                getPendingStudents()
                Toast.success("Successfully approved student registration")
            }
        } catch (error) {
            Toast.error("Unexpected error approving user, please try again")
        }
    }

    const rejectUser = async id => {

        try {
            const response = await API.post('admin/student/reject', {
                studentId: id
            })
            if (response && response.data && response.data.success) {
                setModalVisible(false)
                setSelectedUser(null)
                getPendingStudents()
                Toast.success("Successfully rejected student registration")
            }
        } catch (error) {
            Toast.error("Unexpected error rejecting user, please try again")
        }
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

                    <div style={{display: 'flex', gap: '8px'}}>
                        <Button outline style={{whiteSpace: 'nowrap'}} onClick={clearFilters}>Clear filters</Button>
                        <Button primary style={{whiteSpace: 'nowrap'}} onClick={e => getPendingStudents()}>Apply filters</Button>
                    </div>
                </Row>
            </div>
        </Row>

        <Table.Table>
            <Table.Head>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Email</Table.Heading>
                <Table.Heading>Phone</Table.Heading>
                <Table.Heading>Created</Table.Heading>
                <Table.Heading></Table.Heading>
            </Table.Head>

            <Table.Body>
                

                {pendingStudents.map(tutor => <Table.Row>
                    <Table.Col>{tutor.name} {tutor.surname}</Table.Col>
                    <Table.Col>{tutor.email}</Table.Col>
                    <Table.Col>{tutor.mobile_number}</Table.Col>
                    <Table.Col>{timestampToString(tutor.created_at)}</Table.Col>
                    <Table.Col>
                        <Button outline onClick={e => reviewApplication(tutor.message_uuid)}>Review</Button>
                    </Table.Col>
                </Table.Row>)}
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? 
            <>
                <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total pending student registrations match filters</Row>
                <Row style={{justifyContent: 'space-between', gap: '16px'}}>
                    <div><Button disabled={loading || !pagination[0].url} outline onClick={e => fetchPage(pagination[0].url)}>Previous</Button></div>
                    <div style={{display: 'flex', gap: '16px'}}>
                        {pagination.slice(1, -1).map(link => <Button disabled={loading} outline={!link.active} primary={link.active} active={link.active} onClick={e => fetchPage(link.url)}>{link.label.replace('&laquo;', '').replace('&raquo;', '')}</Button>)}
                    </div>
                    <div><Button disabled={loading || !pagination[pagination.length - 1].url} outline onClick={e => fetchPage(pagination[pagination.length - 1].url)}>Next</Button></div>
                </Row>
            </>
        : null}

        <Modal visible={modalVisible} dismiss={e => { setModalVisible(false); setSelectedUser(null); }} style={{overflowY: 'scroll'}}>
            <Card>
                {loadingUser || !selectedUser ? <RingLoader colour={Colours.b500} /> : <>
                    <PersonalDetails user={selectedUser} readonly />

                    <Row style={{justifyContent: 'space-between', marginTop: '32px'}}>
                        <Button danger onClick={e => rejectUser(selectedUser.id)}>Reject</Button>
                        <Button primary onClick={e => approveUser(selectedUser.id)}>Approve</Button>
                    </Row>
                </>}
            </Card>
        </Modal>
    </Container>
}

export default PendingStudents