import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '../../../../Components'
import useWindowSize from '../../../../Hooks/UseWindowSize'

const Container = styled.div`
    padding: 0 16px 0 16px;

    & b {
        margin-bottom: 2px;
        display: block;
    }

    @media screen and (max-width: 420px) {
        & p {
            font-size: 14px;
        }
    }
`

const Row = styled.div`
    display: flex;

    & > button {
        margin-right: -1px;
    }

    &.dow > button {
        padding-left: 9.3px;
        padding-right: 9.3px;

        @media screen and (max-width: 420px) {
            padding-left: 6px;
            padding-right: 6px;
        }
    }

    &.timeslots {
        & button {
            white-space: nowrap;
            flex: 1;
        }
    }
`
/**
 * Availability selector
 * 
 * Allows users to select specific timeslots in a tutors availability
 * 
 * @param availability      Object  
 * @param setAvailability   Function    
 * @param containerClass    String      If present included as an additional class on the container element
 * @example
 *     const [availability, setAvailability] = useState({
 *          morning: [false, false, false, false, false, false, false],
 *          afternoon: [false, false, false, false, false, false, false],
 *          evening: [false, false, false, false, false, false, false]
 *      })
 *      
 *      ...
 * 
 *      <AvailabilitySelector availability={availability} setAvailability={setAvailability} />
 */
function AvailabilitySelector({availability, setAvailability, containerClass, ...props}) {

    const [days, setDays] = useState([false, false, false, false, false, false, false])
    const [hours, setHours] = useState([false, false, false])

    const windowSize = useWindowSize()

    const setDay = index => {
        const d = [...days]
        d[index] = !d[index]
        setDays(d)
    }

    const setHour = index => {
        const h = [...hours]
        h[index] = !h[index]
        setHours(h)
    }

    const apply = () => {
        
        const avail = {
            morning: [false, false, false, false, false, false, false],
            afternoon: [false, false, false, false, false, false, false],
            evening: [false, false, false, false, false, false, false]
        }

        for(const index in days) {

            if (days[index]) {
                if (hours[0]) {
                    avail.morning[index] = true
                }
    
                if (hours[1]) {
                    avail.afternoon[index] = true
                }
    
                if (hours[2]) {
                    avail.evening[index] = true
                }
            }
            
        }

        setAvailability(avail)

        props.onAccept && props.onAccept()
    }

    return <Container className={containerClass ? containerClass : ""}>
        <p style={{marginTop: '12px', marginBottom: '16px'}}>Choose times that suit you for lessons</p>

        <b style={{paddingBottom: '4px'}}>DAY OF WEEK</b>
        <Row style={{marginBottom: '16px'}} className="dow">
            <Button outline square primary={days[0]} onClick={e => setDay(0)}>{windowSize.width > 420 ? 'MON' : 'MO'}</Button>
            <Button outline square primary={days[1]} onClick={e => setDay(1)}>{windowSize.width > 420 ? 'TUE' : 'TU'}</Button>
            <Button outline square primary={days[2]} onClick={e => setDay(2)}>{windowSize.width > 420 ? 'WED' : 'WE'}</Button>
            <Button outline square primary={days[3]} onClick={e => setDay(3)}>{windowSize.width > 420 ? 'THU' : 'TH'}</Button>
            <Button outline square primary={days[4]} onClick={e => setDay(4)}>{windowSize.width > 420 ? 'FRI' : 'FR'}</Button>
            <Button outline square primary={days[5]} onClick={e => setDay(5)}>{windowSize.width > 420 ? 'SAT' : 'SA'}</Button>
            <Button outline square primary={days[6]} onClick={e => setDay(6)}>{windowSize.width > 420 ? 'SUN' : 'SU'}</Button>
        </Row>

        <b style={{paddingTop: '8px', paddingBottom: '4px'}}>TIME OF THE DAY</b>

        <Row className='timeslots'>
            <Button outline square primary={hours[0]} onClick={e => setHour(0)}>PRE-12 PM</Button>
            <Button outline square primary={hours[1]} onClick={e => setHour(1)}>12-5 PM</Button>
            <Button outline square primary={hours[2]} onClick={e => setHour(2)}>AFTER 5PM</Button>
        </Row>

        <Row style={{marginTop: '15px', flex: 1, justifyContent: 'space-between'}}>
            <div></div>
            <Button primary onClick={apply}>Apply</Button>
        </Row>
    </Container>
}

export default AvailabilitySelector