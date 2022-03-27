import { useState } from "react"
import {Helmet} from "react-helmet"
import styled from "styled-components"
import { RadioButton } from "../../../Components"
import Colours from "../../../Config/Colours"
import NewAdmin from "./Components/NewAdmin"
import NewAgency from "./Components/NewAgency"
import NewStudent from "./Components/NewStudent"
import NewTutor from "./Components/NewTutor"

const Container = styled.div`

`

const Row = styled.div`
    display: flex;
`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;

    & > span {
        font-weight: normal;
        color: ${Colours.n500};
        opacity: .6;
    }
`

/**
 * New user
 * 
 * Allows admins to create a new user
 * 
 */
function NewUser({...props}) {

    const [userType, setUserType] = useState()
    const [tutorType, setTutorType] = useState()

    return <Container>
        <Label>User type</Label>
        <Row style={{gap: '16px'}}>
            <RadioButton name="userType" setter={setUserType} current={userType} value="Student" small>Student</RadioButton>
            <RadioButton name="userType" setter={setUserType} current={userType} value="Tutor" small>Tutor</RadioButton>
            <RadioButton name="userType" setter={setUserType} current={userType} value="Agency" small>Agency</RadioButton>
            <RadioButton name="userType" setter={setUserType} current={userType} value="Admin" small>Admin</RadioButton>
        </Row>

        {userType == 'Student' ? <NewStudent /> : null}
        {userType == 'Tutor' ? <NewTutor /> : null}
        {userType == 'Agency' ? <NewAgency /> : null}
        {userType == 'Admin' ? <NewAdmin /> : null}
    </Container>
}

export default NewUser