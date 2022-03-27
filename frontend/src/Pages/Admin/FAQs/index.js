import { useEffect, useState, useRef } from 'react'
import {Helmet} from "react-helmet"
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Checkbox, Input, Toast, API, Modal, Card, Dropdown, RingLoader } from '../../../Components'
import * as Table from '../../../Components/Table'
import toast from '../../../Components/Toast'
import Colours from '../../../Config/Colours'
import zIndex from '../../../Config/zIndex'

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
        display: flex;
        
        
        & .filterwrapper {
            padding: 16px 0 0 16px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            
            & button {
                white-space: nowrap;
                margin-top: 4px;
            }

            & .inputcontainer {
                margin-bottom: 0;
            }
        }

    }

    & .useractions {
        position: sticky;
        top: 173px;
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

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0;
    gap: 6px;
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
 * Manage FAQs for Admins
 * 
 * Allows admins to query/edit FAQs and help articles
 * 
 * @param user      Object
 * @param setUser   Function
 */
function ManageFAQs({user, setUser}) {

    const [faqs, setFaqs] = useState([])
    const [selectedFaqs, setSelectedFaqs] = useState([])
    
    const [pagination, setPagination] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
  
    const [allSelected, setAllSelected] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deleting, setDeleting] = useState(false)
    
    const [newFaq, setNewFaq] = useState({title: "", body: "", type: "", category: ""})
    const [editingFaq, setEditingFaq] = useState({id: null, title: "", body: "", type: "", category: ""})

    const [categories, setCategories] = useState([])

    const [titleFilter, setTitleFilter] = useState("")
    const [typeFilter, setTypeFilter] = useState("")
    const [categoryFilters, setCategoryFilters] = useState([])

    const [modalVisible, setModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [savingNewFaq, setSavingNewFaq] = useState(false)
    const [savingEditedFaq, setSavingEditedFaq] = useState(false)

    const history = useHistory()
    const filtersRef = useRef()
    const userActionsRef = useRef()

    const buildParams = () => {
        const params = {}

        if (titleFilter) {
            params.title = titleFilter
        }

        if (typeFilter) {
            params.type = typeFilter
        }

        if (categoryFilters.length > 0) {
            params.categories = categoryFilters
        }

        return params
    }

    const getFaqs = async (overrideParams) => {

        try {
            const response = await API.get('admin/faqs', overrideParams ? undefined : {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setFaqs(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured fetching FAQs, refresh to try again.")
        }
    }

    const getCategories = async () => {
        try {
            const response = await API.get('admin/faqs/categories')

            if (response && response.data) {
                setCategories(response.data)
            }
        } catch (error) {
            console.error(error)
            Toast.error("Unexpected error fetching categories, refresh to try again")
        }
    }

    useEffect(() => {
        getCategories()
        getFaqs()
    }, [])

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url, {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setFaqs(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("An unexpected error occured fetching FAQs, refresh to try again.")
        }

        setLoading(false)
    }

    const clearFilters = () => {
        
        setTitleFilter("")
        setTypeFilter("")
        setCategoryFilters([])
       
        getFaqs(true)
    }

    const selectDeselectAll = () => {
        
        let sel = [...selectedFaqs]
        
        if (allSelected) {
            sel = sel.filter(id => !selectedFaqs.includes(id))
        } else {
            for(const faq of faqs) {
                if (!sel.includes(faq.id)) {
                    sel.push(faq.id)
                }
            }
        }

        setSelectedFaqs(sel)
    }

    const selectAllFaqs = async () => {
        try {
            const response = await API.get('admin/faqs/ids')
            setSelectedFaqs(response.data)
        } catch(error) {
            toast.error("Unexpected error selecting all FAQs")
        }
    }

    const selectDeselectFaq = id => {

        const index = selectedFaqs.findIndex(fid => fid == id)
        const selected = [...selectedFaqs]
        console.log('s', selected, index)
        if (index === -1) {
            selected.push(id)
        } else {
            selected.splice(index, 1)
        }

        setSelectedFaqs(selected)
    }

    const deleteFaqs = async () => {
        setDeleting(true)

        try {
            const response = await API.post('admin/faqs/delete', {
                ids: selectedFaqs
            })
            if (response && response.data && response.data.success) {
                setDeleteModalVisible(false)
                toast.success("Deleted " + selectedFaqs.length + " FAQs")
                setSelectedFaqs([])
                getFaqs()
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {   
            toast.error("Unexpected error occured trying to delete FAQs, please try again.")
        }

        setDeleting(false)
    }

    const editFaq = faq => {
        setEditingFaq(faq)
        setEditModalVisible(true)
    }

    const saveFaqEdits = async () => {
        
        setSavingEditedFaq(true)

        try {
            const response = await API.post("admin/faqs/edit", {
                
            })

            if (response && response.data && response.data.success) {
                const index = faqs.findIndex(f => f.id == editingFaq.id)
                const fs = [...faqs]
                fs[index] = response.data.faq
                
                setFaqs(fs)
                setEditingFaq(null)
                toast.success("Successfully updated FAQ")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error saving FAQ, please try again")
        }

        setSavingEditedFaq(false)
    }

    const createFaq = async () => {
        
        setSavingNewFaq(true)

        try {
            const response = await API.post("admin/faqs/new", {
                title: newFaq.title,
                type: newFaq.type.toLocaleLowerCase(),
                category: newFaq.category,
                body: newFaq.body
            })

            if (response && response.data && response.data.success) {
                setNewFaq({title: "", body: "", type: "", category: ""})
                setModalVisible(false)
                getFaqs()
                toast.success("Successfully created new subject")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error creating FAQ, please try again.")
        }

        setSavingNewFaq(false)
    }

    const saveEditedFaq = async () => {

        setSavingEditedFaq(true)

        try {
            const response = await API.post("admin/faqs/edit", {
                id: editingFaq.id,
                title: editingFaq.title,
                type: editingFaq.type.toLocaleLowerCase(),
                category: editingFaq.category,
                body: editingFaq.body
            })

            if (response && response.data && response.data.success) {
                const fs = [...faqs]
                const index = fs.findIndex(f => f.id == editingFaq.id)
                fs[index] = response.data.faq 
                setFaqs(fs)
                setEditModalVisible(false)
                toast.success("Successfully edited FAQ")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error editing FAQ, please try again.")
        }

        setSavingEditedFaq(false)
    }

    const addCategoryFilter = (value, node) => {

        if (categoryFilters.find(c => c == value)) { return }

        const cats = [...categoryFilters]
        cats.push(value)
 
        setCategoryFilters(cats)
    }

    useEffect(() => {
        let all = true 
        for(const faq of faqs) {
            if (!selectedFaqs.find(fid => faq.id == fid)) {
                all = false
            }
        }

        setAllSelected(all)
    }, [selectedFaqs, faqs])

    useEffect(() => {
        const height = filtersRef.current.offsetHeight - 149
        userActionsRef.current.style.top = (227 + height) + "px"
    }, [categoryFilters])

    return <Container>

        <Row style={{background: Colours.n825}} className={"filtertr"} ref={filtersRef}>
            <div className='filterwrapper'>
                <Input placeholder="Search titles" value={titleFilter} onChange={e => setTitleFilter(e.target.value)} />
                <Dropdown selected={typeFilter} onChange={(value, node) => setTypeFilter(node === undefined ? value : node.key)} placeholder="Type" clearable>
                    <div key="faq">FAQs</div>
                    <div key="help">Help</div>
                </Dropdown>

                <Col>
                    <Dropdown onChange={addCategoryFilter} placeholder="Add category filter" clearable clearCallback={e => setCategoryFilters([])} container>
                        {categories.map((cat, i) => <div key={i}>{cat}</div>)}
                    </Dropdown>

                    <Tags>
                        {categoryFilters.map((cat, i) => <Tag key={i}>{cat} <img alt="filter" onClick={e => setCategoryFilters(categoryFilters.filter(c => c != cat))} style={{width: '16px'}} src="/img/close.webp" /></Tag>)}
                    </Tags>
                </Col>

                <Button outline onClick={e => clearFilters()}>Clear filters</Button>
                <Button primary onClick={getFaqs}>Apply filters</Button>
            </div>
        </Row>

        <Table.Table>
            <Table.Head>
                <Table.Heading style={{padding: '8px', width: '16px'}}></Table.Heading>
                <Table.Heading>Title</Table.Heading>
                <Table.Heading>Type</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading style={{width: '64px'}}></Table.Heading>
            </Table.Head>

            <Table.Body>
                <Table.Row className={'useractions ' + (selectedFaqs.length > 0 ? 'active' : '')} ref={userActionsRef}>
                    <Table.Col colSpan="5">
                        <Row>
                            <Checkbox value={allSelected} setter={v => selectDeselectAll(v)} />
                            <p>{selectedFaqs.length} FAQs selected</p>
                            
                            <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
                                <Button outline onClick={e => setModalVisible(true)}>New FAQ</Button>
                                <Button outline onClick={selectAllFaqs}>Select all</Button>
                                <Button outline disabled={selectedFaqs.length == 0} onClick={e => setSelectedFaqs([])}>Deselect all</Button>
                                <Button danger disabled={selectedFaqs.length == 0} onClick={e => setDeleteModalVisible(true)}>Delete FAQs</Button>
                            </div>
                        </Row>
                    </Table.Col>
                </Table.Row>

                {faqs.map(faq => <Table.Row>
                    <Table.Col><Checkbox value={selectedFaqs.find(id => faq.id == id)} setter={v => selectDeselectFaq(faq.id, v)} /></Table.Col>
                    <Table.Col>{faq.title}</Table.Col>
                    <Table.Col>{faq.type}</Table.Col>
                    <Table.Col>{faq.category}</Table.Col>
                    
                    <Table.Col>
                        <Row>
                            <Button outline onClick={e => editFaq(faq)}>Edit</Button>
                        </Row>
                    </Table.Col>
                </Table.Row>)}  
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? <>
            <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total FAQs match filters</Row>
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
                <p>Are you sure you want to delete {selectedFaqs.length} FAQ(s)?</p>
                <Row style={{justifyContent: 'space-between', flex: 1}}>
                    <Button primary onClick={e => setDeleteModalVisible(false)}>Cancel</Button>
                    <Button danger onClick={deleteFaqs}>{deleting ? <RingLoader small /> : 'Confirm'}</Button>
                </Row>
            </Card>
        </Modal>

        <Modal style={{overflow: 'unset'}} visible={modalVisible} dismiss={e => setModalVisible(false)}>
            <Card>
                <Row style={{gap: '16px'}}>
                    <div>
                        <Input label="Name" value={newFaq.title} onChange={e => setNewFaq({...newFaq, title: e.target.value})} />

                        <Dropdown label="Type" selected={newFaq.type} onChange={(value) => setNewFaq({...newFaq, type: value})} style={{marginBottom: '16px'}}>
                            <div key="FAQ">FAQ</div>
                            <div key="Help">Help</div>
                        </Dropdown>

                        <Dropdown editable label="Category" selected={newFaq.category} onChange={(value) => setNewFaq({...newFaq, category: value})} style={{marginBottom: '16px'}}>
                            {categories.map((cat, i) => <div key={i}>{cat}</div>)}
                        </Dropdown>
                    </div>
                    
                    <Input text label="Body" value={newFaq.body} onChange={e => setNewFaq({...newFaq, body: e.target.value})} style={{height: '233px'}} />
                </Row>

                <Row style={{position: 'absolute', bottom: '22px', width: 'calc(100% - 128px)', justifyContent: 'space-between'}}>
                    <Button outline onClick={e => {setModalVisible(false); setNewFaq({title: "", type: "", category: "", body: ""}); }}>Cancel</Button>
                    <Button primary onClick={createFaq}>{savingNewFaq ? <RingLoader small /> : 'Save'}</Button>
                </Row>
            </Card>
        </Modal>

        <Modal style={{overflow: 'unset'}} visible={editModalVisible} dismiss={e => setEditModalVisible(false)}>
            <Card>
                <Row style={{gap: '16px'}}>
                    <div>
                        <Input label="Name" value={editingFaq.title} onChange={e => setEditingFaq({...editingFaq, title: e.target.value})} />

                        <Dropdown label="Type" selected={editingFaq.type} onChange={(value) => setEditingFaq({...editingFaq, type: value})} style={{marginBottom: '16px'}}>
                            <div key="FAQ">FAQ</div>
                            <div key="Help">Help</div>
                        </Dropdown>

                        <Dropdown editable label="Category" selected={editingFaq.category} onChange={(value) => setEditingFaq({...editingFaq, category: value})} style={{marginBottom: '16px'}}>
                            {categories.map((cat, i) => <div key={i}>{cat}</div>)}
                        </Dropdown>
                    </div>
                    
                    <Input text label="Body" value={editingFaq.body} onChange={e => setEditingFaq({...editingFaq, body: e.target.value})} style={{height: '233px'}} />
                </Row>

                <Row style={{position: 'absolute', bottom: '22px', width: 'calc(100% - 128px)', justifyContent: 'space-between'}}>
                    <Button outline onClick={e => {setEditModalVisible(false); setEditingFaq({title: "", type: "", category: "", body: ""}); }}>Cancel</Button>
                    <Button primary onClick={saveEditedFaq}>{savingEditedFaq ? <RingLoader small /> : 'Save'}</Button>
                </Row>
            </Card>
        </Modal>
    </Container>
}

export default ManageFAQs