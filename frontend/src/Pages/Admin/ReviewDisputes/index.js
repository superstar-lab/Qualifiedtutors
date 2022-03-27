import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Helmet} from "react-helmet"
import * as Table from '../../../Components/Table'
import { Toast, Input, Button, API, Modal, Card } from '../../../Components'
import Colours from '../../../Config/Colours'
import { useHistory } from 'react-router-dom'
import toast from '../../../Components/Toast'

const Container = styled.div`
    & .header {
        cursor: pointer;

        &:hover {
            background: ${Colours.b050};
        }

        &.active {
            background: ${Colours.b500};
            color: white;

            & * {
                color: white;
            }
        }
    }

    & .content {

        & td {
            height: 0;
        }

        & .rowcontent {
            overflow: hidden;
        }
        
        &.collapsed .rowcontent {
            height: 0;
        }

        &.expanded .rowcontent {
            height: auto;
        }
    }
    
    & .rowcontent > div:first-of-type {
        gap: 16px;
    }
`

const Row = styled.div`
    display: flex;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
`

const Content = styled.div``

/**
 * Manage pending student/admin review disputes for Admins
 * 
 * Allows admins to query/approve/reject student escalations of tutor rejected reviews
 * 
 * @param user      Object
 * @param setUser   Function
 */
function ReviewDisputes({user, setUser}) {

    const history = useHistory()

    const [disputes, setDisputes] = useState([])
    const [subjects, setSubjects] = useState([])
    const [pagination, setPagination] = useState([])
    const [expandedRow, setExpandedRow] = useState(null)
    const [loading, setLoading] = useState(false)

    const [total, setTotal] = useState(0)

    const [emailModalVisible, setEmailModalVisible] = useState(false)
    const [emailReplyTo, setEmailReplyTo] = useState("")
    const [emailMessage, setEmailMessage] = useState("")
    const [emailSubject, setEmailSubject] = useState("")
    const [emailUserId, setEmailUserId] = useState(null)

    const expandRow = index => {

        if (expandedRow == index) {
            setExpandedRow(null)
        } else {
            setExpandedRow(index)
        }
    }

    const getDisputes = async () => {

        try {
            const response = await API.get('admin/students/review_escalations')
            
            if (response && response.data && response.data.data) {
                setDisputes(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error fetching review excalations. Refresh to try again.")
        }
    }

    useEffect(() => {
     
        const getSubjects = async () => {
            try {
                const response = await API.get('subjects')

                if (response && response.data) {
                    setSubjects(response.data)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch(error) {
                Toast.error("Unexpected error fetching subjects. Refresh to try again.")
            }
        }

        getDisputes()
        getSubjects()
    }, [])

    const approveReview = async index => {

        const review = disputes[index]
        setLoading(true)

        try {
            const response = await API.post('admin/reviews/approve', {
                review_id: review.id
            })

            if (response && response.data && response.data.success) {
                Toast.success("Successfully approved review.")
                getDisputes()
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error approving review. Please try again.")
        }

        setLoading(false)
    }

    const rejectReview = async index => {

        const review = disputes[index]
        setLoading(true)

        try {
            const response = await API.post('admin/reviews/reject', {
                review_id: review.id
            })

            if (response && response.data && response.data.success) {
                Toast.success("Successfully rejected review.")
                getDisputes()
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("Unexpected error approving review. Please try again.")
        }

        setLoading(false)        
    }

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url)

            if (response && response.data && response.data.data) {
                setDisputes(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("An unexpected error occured fetching disputes. Please try again.")
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

    const viewProfile = uuid => {
        window.open(window.location.origin + '/profile/' + uuid, '_blank').focus()
    }

    const sendEmailToUser = (userId) => {
        setEmailUserId(userId)
        setEmailModalVisible(true)
    }

    const sendEmail = async () => {

        try {

            const params = {
                userIds: [emailUserId],
                message: emailMessage,
                subject: emailSubject
            }

            if (emailReplyTo) {
                params.replyTo = emailReplyTo
            }

            const response = await API.post('admin/users/massemail', params)

            if (response && response.data && response.data.success) {
                setEmailMessage("")
                setEmailReplyTo("")
                setEmailSubject("")
                setEmailUserId(null)
            } else {
                throw new Error("Unexpected API response")
            }

        } catch (error) {
            toast.error("Unexpected error sending email, please try again.")
        }

        setEmailModalVisible(false)
    }

    return <Container>
        <Table.Table>
            <Table.Head>
                <Table.Heading style={{width: '32px'}}></Table.Heading>
                <Table.Heading>Tutor</Table.Heading>
                <Table.Heading>Student</Table.Heading>
                <Table.Heading>Subject</Table.Heading>
                <Table.Heading>Level</Table.Heading>
            </Table.Head>

            <Table.Body>
                {disputes.map((dispute, index) => <>
                    <Table.Row className={"header" + (expandedRow == index ? ' active' : '')} onClick={e => expandRow(index)}>
                        <Table.Col><img alt="expand/collapse" src={expandedRow == index ? "/img/disclosure_white.svg" : "/img/disclosure.svg"} style={expandedRow == index ? {transform: 'rotate(180deg)'} : {}} /></Table.Col>
                        <Table.Col>
                            {dispute.reviewee ? dispute.reviewee.name : ''} {dispute.reviewee ? dispute.reviewee.surname : ''} 
                            ({dispute.reviewee ? dispute.reviewee.email : ''})
                        </Table.Col>
                        <Table.Col>{dispute.reviewer ? dispute.reviewer.name : ''} {dispute.reviewer ? dispute.reviewer.surname : ''} ({dispute.reviewer ? dispute.reviewer.email : ''})</Table.Col>
                        <Table.Col>{
                            subjects && subjects.length > 0 ? 
                                (subjects.find(s => s.id == dispute.subject_id) ? subjects.find(s => s.id == dispute.subject_id).subject : null)
                                : null
                            }
                        </Table.Col>
                        <Table.Col>{dispute.level}</Table.Col>
                    </Table.Row>

                    <Table.Row className={"content" + (expandedRow == index ? ' expanded' : ' collapsed')} style={{background: Colours.n825}}>
                        <Table.Col colSpan="5">
                            <Content className="rowcontent">
                                <Row>
                                    <Col style={{flex: 1}}>
                                        <Row style={{margin: '6px 0'}}>
                                            {Array.from({length: dispute.rating}).map(v => <img alt="full star" src="/img/star_fill.svg" />)}
                                            {Array.from({length: 5 - dispute.rating}).map(v => <img alt="empty star" src="/img/star_outline.svg" />)}
                                        </Row>
                                        <Input text readonly value={dispute.review} />
                                    </Col>

                                    <Input style={{flex: 1}} text readonly value={dispute.reviewee_rejection_message} label="Tutor rejection message" />
                                    <Input style={{flex: 1}} text readonly value={dispute.reviewer_escalation_message} label="Student escalation message" />
                                </Row>

                                <Row style={{justifyContent: 'flex-end', flexWrap: 'wrap', marginBottom: '24px', gap: '8px'}}>
                                    <Button outline onClick={e => viewProfile(dispute.reviewee.message_uuid)}>View tutor profile</Button>
                                    <Button outline onClick={e => loginAsUser(dispute.reviewee.id)}>Login as tutor</Button>
                                    <Button outline onClick={e => loginAsUser(dispute.reviewer.id)}>Login as student</Button>
                                    <Button outline onClick={e => sendEmailToUser(dispute.reviewee.id)}>Email tutor</Button>
                                    <Button outline onClick={e => sendEmailToUser(dispute.reviewer.id)}>Email student</Button>
                                    <Button danger disabled={loading} onClick={e => rejectReview(index)}>Reject Review</Button>
                                    <Button primary disabled={loading} onClick={e => approveReview(index)}>Approve Review</Button>
                                </Row>

                            </Content>
                        </Table.Col>
                    </Table.Row>
                </>)}
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? <>
            <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total review disputes</Row>
            <Row style={{justifyContent: 'space-between', marginTop: '32px', gap: '16px'}}>
                <div><Button disabled={loading || !pagination[0].url} outline onClick={e => fetchPage(pagination[0].url)}>Previous</Button></div>
                <div style={{display: 'flex', gap: '16px'}}>
                    {pagination.slice(1, -1).map(link => <Button disabled={loading} outline={!link.active} primary={link.active} active={link.active} onClick={e => fetchPage(link.url)}>{link.label.replace('&laquo;', '').replace('&raquo;', '')}</Button>)}
                </div>
                <div><Button disabled={loading || !pagination[pagination.length - 1].url} outline onClick={e => fetchPage(pagination[pagination.length - 1].url)}>Next</Button></div>
            </Row>
        </>: null}

        <Modal visible={emailModalVisible}>
            <Card>
                <Input label="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                <Input label="Reply-To" value={emailReplyTo} onChange={e => setEmailReplyTo(e.target.value)} />
                <Input text label="Message" value={emailMessage} onChange={e => setEmailMessage(e.target.value)} />

                <Row style={{justifyContent: 'space-between'}}>
                    <Button outline onClick={e => {
                        setEmailModalVisible(false)
                        setEmailMessage("")
                        setEmailReplyTo("")
                        setEmailSubject("")
                        setEmailUserId(null)
                    }}>Cancel</Button>
                    <Button primary onClick={sendEmail}>Send</Button>
                </Row>
            </Card>
        </Modal>
    </Container>
}

export default ReviewDisputes