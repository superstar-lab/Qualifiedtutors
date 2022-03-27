import styled from 'styled-components'
import {Helmet} from "react-helmet"
import Card from '../../../../Components/Card'
import UserContext from '../../../../UserContext.js'
import { useHistory } from 'react-router-dom'

const Container = styled.div`
    
`

const Column = styled.div`

`

function TutorProfile({user}) {

    const history = useHistory()

    return <Container>
        <Column>
            <Card>
                     
            </Card>

            <Card>

            </Card>

            <Card>

            </Card>

            <Card>

            </Card>

            <Card>

            </Card>
        </Column>
    </Container>
}

export default TutorProfile
