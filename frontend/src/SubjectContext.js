import { createContext } from 'react'

const SubjectContext = createContext({
    subjects: [],
    setSubjects: () => {},
    levels: [],
    setLevels: () => {}
})

export default SubjectContext
