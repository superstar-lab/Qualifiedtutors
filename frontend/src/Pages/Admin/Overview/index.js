import styled from 'styled-components'
import {Helmet} from "react-helmet"
import { Line, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
import { useEffect, useState } from 'react'
import { API, Toast, Circle } from '../../../Components'
import Colours from '../../../Config/Colours'

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
  )

const Container = styled.div`
    & h2 {
        margin-top: 64px;
    }

    color: ${Colours.n500};

    & .circleSVG {
        font-size: 72px;

        & > div:last-of-type {
            top: -8px;
        }
    }
`

const loginChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: false,
            text: 'Logins'
        },
    },
    scales: {
        
        y: {
        
          ticks: {
            stepSize: 1,
            beginAtZero: true,
          },
        },
      },
}

const registrationChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: false,
            text: 'Registrations'
        },
    },
    scales: {
        
        y: {
        
          ticks: {
            stepSize: 1,
            beginAtZero: true,
          },
        },
      },
}

const messageChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: false,
            text: 'Messages'
        },
    },
    scales: {
        
        y: {
            
          ticks: {
            stepSize: 1,
            beginAtZero: true,
          },
        },
      },
}

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

/**
 * Admin overview page
 * 
 * Displays metrics of interest to site admins
 */
function Overview() {

    const [pending, setPending] = useState({
        tutors: null,
        subjects: null,
        reviews: null
    })
    const [overviewData, setOverviewData] = useState(null)
    const [overviewChartData, setOverviewChartData] = useState({
        labels: [],
        datasets: []
    })
    const [registrationChartData, setRegistrationChartData] = useState({
        labels: [],
        datasets: []
    })
    const [messageChartData, setMessageChartData] = useState({
        labels: [],
        datasets: []
    })

    useEffect(() => {
        const getOverview = async () => {
            try {
                const response = await API.get('admin/overview')
                if (response && response.data) {
                    setOverviewData(response.data.analytics)
                    setPending(response.data.pending)
                } else {
                    throw new Error("Unexpected API response")
                }
            } catch (error) {
                Toast.error("Unexpected error fetching overview, refresh to try again.")
            }
        }

        getOverview()
    }, [])

    useEffect(() => {

        if (!overviewData) { return }

        const data = {...overviewChartData}

        const colours = [
            Colours.b500,
            Colours.g300,
            Colours.y500,
            Colours.r500,
            Colours.n500,
            Colours.b600,
            Colours.r600,
            Colours.t300,
            Colours.g500,
        ]

        const sets = {}
        for(const label of Object.keys(overviewData)) {
            const day = overviewData[label]
            for(const event of Object.keys(day)) {
                if (!sets.hasOwnProperty(event)) {
                    sets[event] = []
                }
            }
        }

        for (const label of Object.keys(overviewData)) {
            const day = overviewData[label]
            for(const key of Object.keys(sets)) {
                if (day[key]) {
                    sets[key].push(day[key])
                } else {
                    sets[key].push(0)
                }
            }
        }

        const loginSet = {}
        if (sets.hasOwnProperty('admin_login')) {
            loginSet.admin_login = sets.admin_login
            delete sets.admin_login
        }
        if (sets.hasOwnProperty('tutor_login')) {
            loginSet.tutor_login = sets.tutor_login
            delete sets.tutor_login
        }
        if (sets.hasOwnProperty('student_login')) {
            loginSet.student_login = sets.student_login
            delete sets.student_login
        }

        const regSet = {}
        if (sets.hasOwnProperty('admin_registration')) {
            regSet.admin_registration = sets.admin_registration
            delete sets.admin_registration
        }
        if (sets.hasOwnProperty('tutor_registration')) {
            regSet.tutor_registration = sets.tutor_registration
            delete sets.tutor_registration
        }
        if (sets.hasOwnProperty('student_registration')) {
            regSet.student_registration = sets.student_registration
            delete sets.student_registration
        }

        const messageSet = {}
        if (sets.hasOwnProperty('student_sent_message')) {
            messageSet.student_sent_message = sets.student_sent_message
            delete sets.student_sent_message
        }
        if (sets.hasOwnProperty('tutor_sent_message')) {
            messageSet.tutor_sent_message = sets.tutor_sent_message
            delete sets.tutor_sent_message
        }
        if (sets.hasOwnProperty('student_read_message')) {
            messageSet.student_read_message = sets.student_read_message
            delete sets.student_read_message
        }
        if (sets.hasOwnProperty('tutor_read_message')) {
            messageSet.tutor_read_message = sets.tutor_read_message
            delete sets.tutor_read_message
        }
        
        setOverviewChartData({
            ...overviewChartData,
            labels: Object.keys(overviewData).map(key => key),
            datasets: Object.keys(loginSet).map((event, index) => ({
                label: event.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                data: loginSet[event],
                backgroundColor: colours[index]
            }))
        })

        setRegistrationChartData({
            ...registrationChartData,
            labels: Object.keys(overviewData).map(key => key),
            datasets: Object.keys(regSet).map((event, index) => ({
                label: event.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                data: regSet[event],
                backgroundColor: colours[index]
            }))
        })

        setMessageChartData({
            ...messageChartData,
            labels: Object.keys(overviewData).map(key => key),
            datasets: Object.keys(messageSet).map((event, index) => ({
                label: event.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                data: messageSet[event],
                backgroundColor: colours[index]
            }))
        })
        
    }, [overviewData])

    return <Container>
        <Row>
            <Col>
                <Circle>{pending.tutors}</Circle>
                <p>Pending Tutor Registrations</p>
            </Col>
            <Col>
                <Circle circleColour={Colours.b500} circleOpacity={.2}>{pending.students}</Circle>
                <p>Pending Student Registrations</p>
            </Col>
            <Col>
                <Circle circleColour={Colours.g300} circleOpacity={.2}>{pending.subjects}</Circle>
                <p>Pending Subjects</p>
            </Col>
            <Col>
                <Circle circleColour={Colours.y500} circleOpacity={.2}>{pending.reviews}</Circle>
                <p>Pending Review Disputes</p>
            </Col>
        </Row>

        <h2>Registrations in the past 31 days</h2>
        <Bar options={registrationChartOptions} data={registrationChartData} />

        <h2>Logins in the past 31 days</h2>
        <Bar options={loginChartOptions} data={overviewChartData} />

        <h2>Messages sent in the past 31 days</h2>
        <Bar options={messageChartOptions} data={messageChartData} />
    </Container>
}

export default Overview