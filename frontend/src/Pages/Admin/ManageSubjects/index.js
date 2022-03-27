import { useEffect, useRef, useState } from 'react'
import {Helmet} from "react-helmet"
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Checkbox, Input, Toast, API, Modal, Card, Dropdown, RingLoader } from '../../../Components'
import * as Table from '../../../Components/Table'
import toast from '../../../Components/Toast'
import Colours from '../../../Config/Colours'
import SubjectCategories from '../../../Config/SubjectCategories'
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
        padding: 16px;
        border: .5px solid #E0E0E0;
        border-bottom: 0;
        

        & .inputcontainer {
            margin: 0;
        }

        & .filterwrapper {
            flex: 1;
            
            & > div {
                align-items: flex-start;
                gap: 16px;
            }
        }
    
    }

    & .useractions {
        position: sticky;
        top: 159px;
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
 * Manage subjects for Admins
 * 
 * Allows admins to query/edit subjects/levels/categories
 * 
 * @param user      Object
 * @param setUser   Function
 */
function ManageSubjects({user, setUser}) {

    const [subjects, setSubjects] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [fixedSubjects, setFixedSubjects] = useState([])
    const [fixedLevels, setFixedLevels] = useState([])
    const [pagination, setPagination] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
  
    const [allSelected, setAllSelected] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deletingSubjects, setDeletingSubjects] = useState(false)
    
    const [filtersCollapsed, setFiltersCollapsed] = useState(false)

    const [newSubject, setNewSubject] = useState({subject: "", levels: "[]", category: ""})
    const [editingSubject, setEditingSubject] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [savingNewSubject, setSavingNewSubject] = useState(false)
    const [savingEditedSubject, setSavingEditedSubject] = useState(false)

    const [nameFilter, setNameFilter] = useState("")
    const [levelFilters, setLevelFilters] = useState([])
    const [categoryFilters, setCategoryFilters] = useState([])

    const filtersRef = useRef()
    const userActionsRef = useRef()

    const history = useHistory()

    const buildParams = () => {
        const params = {}

        if (nameFilter.length > 0) {
            params.name = nameFilter
        }

        if (levelFilters) {
            params.levels = levelFilters
        }

        if (categoryFilters) {
            params.categories = categoryFilters
        }

        return params
    }

    const getSubjects = async () => {

        try {
            const response = await API.get('subjects/paginate')

            if (response && response.data && response.data.data) {
                setSubjects(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured fetching subjects, refresh to try again.")
        }
    }

    useEffect(() => {
    
        const getFixedSubjects = async () => {
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

        const getFixedLevels = async () => {
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

        getSubjects()
        getFixedSubjects()
        getFixedLevels()
    }, [])

    const fetchPage = async url => {
        setLoading(true)

        try {
            const response = await API.get(url, {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setSubjects(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            Toast.error("An unexpected error occured fetching subjects, refresh to try again.")
        }

        setLoading(false)
    }

    const filter = async (overrideParams) => {

        try {
            const response = await API.get('subjects/paginate', overrideParams !== undefined ? undefined : {
                params: buildParams()
            })

            if (response && response.data && response.data.data) {
                setSubjects(response.data.data)
                setPagination(response.data.links)
                setTotal(response.data.total)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured fetching subjects, please try again.")
        }
    }

    const timestampToString = (dt) => {
        if (!dt) { return "" }
        return new Date(dt).toDateString()
    }


    const clearFilters = () => {
        
        setNameFilter("")
        setLevelFilters([])
        setCategoryFilters([])
        
        filter(true)
    }

    const selectDeselectAll = () => {
        let allSelected = true
        for(const sub of subjects) {
            if (!selectedSubjects.includes(sub.id)) {
                allSelected = false
            }
        }

        if (allSelected) {
            setSelectedSubjects([])
        } else {
            const subs = [...selectedSubjects]
            for (const sub of subjects) {
                if (!subs.includes(sub.id)) {
                    subs.push(sub.id)
                }
            }

            setSelectedSubjects(subs)
        }
    }

    const selectAllSubjects = async () => {

        try {
            const response = await API.get('admin/select_all_subjects', {
                params: buildParams()
            })

            if (response && response.data && response.data.ids) {
                setSelectedSubjects(response.data.ids)
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("An unexpected error occured selecting subjects, please try again.")
        }
    }

    const selectDeselectSubject = id => {

        const index = selectedSubjects.findIndex(sid => sid == id)
        if (index === -1) {
            setSelectedSubjects([...selectedSubjects, id])
        } else {
            setSelectedSubjects(selectedSubjects.filter(sid => sid != id))
        }
    }

    const deleteSubjects = async () => {
        setDeletingSubjects(true)

        try {
            const response = await API.post("admin/subjects/delete", {
                ids: selectedSubjects
            })

            if (response && response.data && response.data.success) {
                getSubjects()
                setDeleteModalVisible(false)
                toast.success("Successfully deleted " + selectedSubjects.length + " subjects")
                setSelectedSubjects([])
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error deleting subjects, please try again.")
        }

        setDeletingSubjects(false)
    }

    const editSubject = id => {
        setEditingSubject(id)
    }

    const addLevelToSubject = (value, _new) => {
        const subject = _new ? {...newSubject} : {...editingSubject}
        const levels = JSON.parse((_new ? newSubject : editingSubject).levels)
        
        if (!levels.includes(value)) {
            levels.push(value)
            subject.levels = JSON.stringify(levels)
            
            if (_new) {
                setNewSubject(subject)
            } else {
                setEditingSubject(subject)
            }
        }
    }

    const saveSubjectEdits = async () => {
        
        setSavingEditedSubject(true)

        try {
            const response = await API.post("admin/subjects/edit", {
                id: editingSubject.id,
                subject: editingSubject.subject,
                levels: JSON.parse(editingSubject.levels),
                category: editingSubject.category
            })

            if (response && response.data && response.data.success) {
                const index = subjects.findIndex(s => s.id == editingSubject.id)
                const subs = [...subjects]
                subs[index] = response.data.subject
                
                setSubjects(subs)
                setEditingSubject(null)
                toast.success("Successfully updated subject")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error saving subject, please try again")
        }

        setSavingEditedSubject(false)
    }

    const createSubject = async () => {
        
        setSavingNewSubject(true)

        try {
            const response = await API.post("admin/subjects/new", {
                subject: newSubject.subject,
                levels: JSON.parse(newSubject.levels),
                category: newSubject.category
            })

            if (response && response.data && response.data.success) {
                setNewSubject({subject: "", levels: "[]", category: ""})
                setModalVisible(false)
                getSubjects()
                toast.success("Successfully created new subject")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch(error) {
            toast.error("Unexpected error creating subject, please try again.")
        }

        setSavingNewSubject(false)
    }

    const removeLevelFromSubject = (level, _new) => {
        const subject = _new ? {...newSubject} : {...editingSubject}
        const levels = JSON.parse((_new ? newSubject : editingSubject).levels)
        const index = levels.findIndex(l => l == level)

        if (index !== -1) {
            levels.splice(index, 1)
            subject.levels = JSON.stringify(levels)

            if (_new) {
                setNewSubject(subject)
            } else {
                setEditingSubject(subject)
            }
        }
    }

    useEffect(() => {
        let all = true 
        for(const subject of subjects) {
            if (!selectedSubjects.find(sid => subject.id == sid)) {
                all = false
            }
        }

        setAllSelected(all)
    }, [selectedSubjects, subjects])

    useEffect(() => {
        const height = filtersRef.current.offsetHeight - 80
        userActionsRef.current.style.top = (158 + height) + "px"
    }, [levelFilters, categoryFilters])

    return <Container>

        <Row style={{background: Colours.n825}} className={"filtertr "  + (filtersCollapsed ? 'collapsed' : '')} ref={filtersRef}>
            <div className='filterwrapper'>
                <Row style={{gap: '16px'}}>
                    <Input placeholder="Search name" value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                    <Col>
                        <Dropdown 
                            active={levelFilters.length > 0}
                            placeholder="Add level filter" 
                            onChange={(value, node) => !levelFilters.find(l => l == value) && setLevelFilters([...levelFilters, value])}
                        >
                            {fixedLevels.map((lvl, i) => <div key={i}>{lvl}</div>)}
                        </Dropdown>

                        <Tags style={levelFilters.length == 0 ? {margin: 0} : {}}>
                            {levelFilters.map(lvl => <Tag>{lvl} <img alt="remove" onClick={e => setLevelFilters(levelFilters.filter(l => l != lvl))} style={{width: '16px'}} src="/img/close.webp" /></Tag>)}
                        </Tags>
                    </Col>
                    <Col>
                        <Dropdown 
                            placeholder="Add category filter" 
                            onChange={(value, node) => !categoryFilters.find(c => c == value) && setCategoryFilters([...categoryFilters, value])}
                        >
                            {SubjectCategories.map((cat, i) => <div key={i}>{cat}</div>)}
                        </Dropdown>

                        <Tags style={categoryFilters.length == 0 ? {margin: 0} : {}}>
                            {categoryFilters.map(cat => <Tag>{cat} <img alt="remove" onClick={e => setCategoryFilters(categoryFilters.filter(c => c != cat))} style={{width: '16px'}} src="/img/close.webp" /></Tag>)}
                        </Tags>
                    </Col>

                    <Button outline style={{whiteSpace: 'nowrap'}} onClick={e => clearFilters()}>Clear filters</Button>
                    <Button primary style={{whiteSpace: 'nowrap'}} onClick={e => filter()}>Apply filters</Button>
                </Row>
            </div>
        </Row>

        <Table.Table>
            <Table.Head>
                <Table.Heading style={{padding: '8px', width: '16px'}}></Table.Heading>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Levels</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading></Table.Heading>
            </Table.Head>

            <Table.Body>
                <Table.Row className={'useractions ' + (selectedSubjects.length > 0 ? 'active' : '')} ref={userActionsRef}>
                    <Table.Col colSpan="5">
                        <Row>
                            <Checkbox value={allSelected} setter={v => selectDeselectAll(v)} />
                            <p>{selectedSubjects.length} subjects selected</p>
                            
                            <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
                                <Button outline onClick={e => setModalVisible(true)}>New subject</Button>
                                <Button outline onClick={selectAllSubjects}>Select all</Button>
                                <Button outline disabled={selectedSubjects.length == 0} onClick={e => setSelectedSubjects([])}>Deselect all</Button>
                                <Button danger disabled={selectedSubjects.length == 0} onClick={e => setDeleteModalVisible(true)}>Delete subjects</Button>
                            </div>
                        </Row>
                    </Table.Col>
                </Table.Row>

                {subjects.map(subject => <Table.Row>
                    <Table.Col><Checkbox value={selectedSubjects.find(id => subject.id == id)} setter={v => selectDeselectSubject(subject.id, v)} /></Table.Col>
                    <Table.Col>{editingSubject && editingSubject.id == subject.id ? <Input value={editingSubject.subject} onChange={e => setEditingSubject({...editingSubject, subject: e.target.value})} /> : subject.subject}</Table.Col>
                    <Table.Col>
                        {editingSubject && editingSubject.id == subject.id  ? <Dropdown placeholder="Add a level" style={{marginTop: '16px'}} onChange={value => addLevelToSubject(value, false)}>{fixedLevels.map((lvl, index) => <div key={index}>{lvl}</div>)}</Dropdown> : null}
                        <Tags>
                            {JSON.parse((editingSubject && editingSubject.id == subject.id ? editingSubject.levels : subject.levels)).map(level => <Tag>{level} {editingSubject && editingSubject.id == subject.id ? <>&nbsp;<img alt="remove" onClick={e => removeLevelFromSubject(level)} style={{width: '16px'}} src="/img/close.webp" /></> : null}</Tag>)}
                        </Tags>
                    </Table.Col>
                    <Table.Col>{editingSubject && editingSubject.id == subject.id  ? <Dropdown style={{minWidth: '132px'}} selected={editingSubject.category} onChange={value => setEditingSubject({...editingSubject, category: value})}>{SubjectCategories.map((cat, index) => <div key={index}>{cat}</div>)}</Dropdown> : subject.category}</Table.Col>
                    
                    <Table.Col>
                        <Row>
                            {savingEditedSubject ? <RingLoader small colour={Colours.b500} /> :
                                editingSubject && editingSubject.id == subject.id ? <>
                                    <img alt="save" onClick={saveSubjectEdits} style={{width: '16px', height: '16px', marginRight: '16px', cursor: 'pointer'}} src="/img/checkmark_green.svg" />
                                    <img alt="cancel" onClick={e => setEditingSubject(null)} style={{width: '14px', height: '14px', cursor: 'pointer'}} src="/img/close_red.webp" />
                                </> : <>
                                    <Button outline onClick={e => editSubject(subject)}>Edit</Button>
                                </>
                            }
                        </Row>
                    </Table.Col>
                </Table.Row>)}  
            </Table.Body>
        </Table.Table>

        {pagination.length > 0 ? <>
            <Row style={{marginTop: '8px', marginBottom: '32px', justifyContent: 'flex-end'}}><b>{total}</b> &nbsp; total subject match filters</Row>
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
                <p>Are you sure you want to delete {selectedSubjects.length} subject(s)?</p>
                <Row style={{justifyContent: 'space-between', flex: 1}}>
                    <Button primary onClick={e => setDeleteModalVisible(false)}>Cancel</Button>
                    <Button danger onClick={deleteSubjects}>{deletingSubjects ? <RingLoader small /> : 'Confirm'}</Button>
                </Row>
            </Card>
        </Modal>

        <Modal style={{overflow: 'unset', maxWidth: '440px'}} visible={modalVisible} dismiss={e => setModalVisible(false)}>
            <Card>
                <Input label="Name" value={newSubject.subject} onChange={e => setNewSubject({...newSubject, subject: e.target.value})} />
                
                <Dropdown label="Category" selected={newSubject.category} onChange={(value) => setNewSubject({...newSubject, category: value})}>
                    {SubjectCategories.map((cat, i) => <div key={i}>{cat}</div>)}
                </Dropdown>
                
                <Dropdown label="Levels" placeholder="Add a level" onChange={(value) => addLevelToSubject(value, true)}>{fixedLevels.map((lvl, i) => <div key={i}>{lvl}</div>)}</Dropdown>
                <Tags>
                    {JSON.parse(newSubject.levels).map((lvl, i) => <Tag key={i}>{lvl} <img alt="remove" onClick={e => removeLevelFromSubject(lvl, true)} style={{width: '16px'}} src="/img/close.webp" /></Tag>)}
                </Tags>

                <Row style={{position: 'absolute', bottom: '22px', width: 'calc(100% - 128px)', justifyContent: 'space-between'}}>
                    <Button outline onClick={e => {setModalVisible(false); setNewSubject({subject: "", levels: "[]", category: ""}); }}>Cancel</Button>
                    <Button primary onClick={createSubject}>{savingNewSubject ? <RingLoader small /> : 'Save'}</Button>
                </Row>
            </Card>
        </Modal>
    </Container>
}

export default ManageSubjects