
import { useEffect, useState } from "react"
import styled from "styled-components"
import {Helmet} from "react-helmet"
import * as Table from "../../../Components/Table"
import { Dropdown, Toast, Button, API } from '../../../Components'


const Container = styled.div`

`

const Row = styled.div`
    display: flex;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
`

/**
 * Manage pending subjects for Admins
 * 
 * Allows admins to query/approve/reject/rename/remap unrecognized subjects entered by tutors
 * 
 * @param user      Object
 */
function PendingSubjects({user}) {

    const [subjects, setSubjects] = useState([])
    const [categories, setCategories] = useState([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [fixedSubjects, setFixedSubjects] = useState([])

    const [selectedSubjects, setSelectedSubjects] = useState({})
    const [selectedCategories, setSelectedCategories] = useState({})

    const gotoPage = index => {
        setPage(index)
    }

    const getPendingSubjects = async () => {
        try {
            const response = await API.get('admin/subjects/pending')
            if (response && response.data) {
                setSubjects(response.data)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Unexpected error fetching pending subjects. Refresh to try again.")
        }
    }

    useEffect(() => {
        const getSubjectCategories = async () => {
            try {
                const response = await API.get('admin/subjects/categories')
                if (response && response.data) {
                    setCategories(response.data)
                } else {
                    throw new Error("Unexpected API error")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching subject categories. Refresh to try again.")
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
            } catch (error) {
                Toast.error("Unexpected error fetching subjects. Refresh to try again.")
            }
        }

        getPendingSubjects()
        getSubjectCategories()
        getSubjects()
    }, [])

    useEffect(() => {
        setLastPage(Math.ceil(subjects.length / 15))
    }, [subjects])

    const approveSubject = async index => {

        const ogSubject = subjects[index]
        const subject = selectedSubjects[ogSubject.subject_name]

        const params = {
            subject_name: ogSubject.subject_name
        }
        
        if (subject) {
            if (parseInt(subject)) {
                params.subject_id = parseInt(subject)
            } else {
                params.rename_subject = subject
            }

            if (subject.hasOwnProperty('category')) {
                params.category = subject.category
            }
        }

        try {
            const response = await API.post('admin/subjects/approve', params)

            if (response && response.data && response.data.success) {
                getPendingSubjects()
                Toast.success("Successfully approved new subject")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error approving new subject, please try again.")
        }
        
    }   

    const rejectSubject = async index => {

        const subject = subjects[index]

        try {
            const response = await API.post('admin/subjects/reject', {
                subject_name: subject.subject_name
            })

            if (response && response.data && response.data.success) {
                getPendingSubjects()
                Toast.success("Successfully rejected new subject")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error rejecting new subject, please try again.")
        }
    }   

    return <Container>
        <Table.Table>
            <Table.Head>
                <Table.Heading>Subject</Table.Heading>
                <Table.Heading>Reassign/Rename</Table.Heading>
                <Table.Heading style={{width: '184px'}}>Category</Table.Heading>
                <Table.Heading style={{width: '96px'}}></Table.Heading>
            </Table.Head>

            <Table.Body>
                {subjects.slice((page - 1) * 15, (page * 15) + 1).map((s, index) => <Table.Row>
                    <Table.Col>
                        <Col>
                            {s.subject_name}
                        </Col>
                    </Table.Col>
                    <Table.Col>
                        <Dropdown
                            editable
                            onChange={(value, node) => {
                                setSelectedSubjects({
                                    ...selectedSubjects,
                                    [s.subject_name]: node ? node.key : value
                                })
                            }}
                            selected={selectedSubjects.hasOwnProperty(s.subject_name) ? 
                                (parseInt(selectedSubjects[s.subject_name]) ? 
                                    fixedSubjects.find(sub => sub.id == parseInt(selectedSubjects[s.subject_name])).subject
                                : selectedSubjects[s.subject_name]) 
                            : "" }
                        >{fixedSubjects.map(s => <div key={s.id}>{s.subject}</div>)}</Dropdown>
                    </Table.Col>
                    <Table.Col>
                        <Dropdown
                            onChange={(value, node) => {
                                setSelectedCategories({
                                    ...selectedCategories,
                                    [s.subject_name]: value
                                })
                            }}
                            selected={selectedCategories.hasOwnProperty(s.subject_name) ? 
                                selectedCategories[s.subject_name]    
                            : ""}
                        >
                            {categories.map(c => <div>{c.category}</div>)}
                        </Dropdown>
                    </Table.Col>
                    <Table.Col>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', alignItems: 'center', padding: '8px'}}>
                            <Button primary onClick={e => approveSubject(index)}>Approve</Button>
                            <Button danger onClick={e => rejectSubject(index)}>Reject</Button>
                        </div>
                    </Table.Col>
                </Table.Row>)}
            </Table.Body>
        </Table.Table>

        <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{subjects.length}</b> &nbsp; total pending subjects</Row>
        <Row style={{justifyContent: 'space-between', marginTop: '32px', gap: '16px'}}>
            <div><Button disabled={loading || page == 1} outline onClick={e => gotoPage(page - 1)}>Previous</Button></div>
            <div style={{display: 'flex', gap: '16px'}}>
                {Array.from({length: lastPage}).map((_, index) => <Button disabled={loading} outline={page != index + 1} primary={page == index + 1} active={page == index + 1} onClick={e => gotoPage(index + 1)}>{index + 1}</Button>)}
            </div>
            <div><Button disabled={loading || page == lastPage} outline onClick={e => gotoPage(page + 1)}>Next</Button></div>
        </Row>
    </Container>
}

export default PendingSubjects