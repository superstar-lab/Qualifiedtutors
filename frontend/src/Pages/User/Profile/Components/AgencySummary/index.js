import styled from 'styled-components'
import {
    API,
    Card,
    Circle,
    Toast,
    Underline
} from '../../../../../Components'
import Colours from '../../../../../Config/Colours.js'
import UserContext from '../../../../../UserContext'
import { useEffect, useState } from 'react'
import toast from '../../../../../Components/Toast'
import useWindowSize from '../../../../../Hooks/UseWindowSize'

const Container = styled.div`
    color: ${Colours.n200};    
    margin-bottom: 24px;

    & > .card {
        flex-direction: row;
        padding: 18px;
        transition: background .25s;
    }
    
    .profileCircle {
        width: 246px;
        height: 235px;
        pointer-events: none;

        & > div {
            background-image: attr(data-src url);
            background-size: cover;
        }
    }

    &.hover {
        & > .card:hover {
            background: ${Colours.b700};
            cursor: pointer;
        }
    }

    & .price {
        font-weight: bold;
        font-size: 31px;
        line-height: 22px;
        margin-bottom: 8px;
        color: ${Colours.b400};
        font-family: 'Oxygen';

        &:after {
            width: 48px;
            transform: rotate(-4deg);
            right: 2px;
            left: unset;
        }
    }

    & .priceContainer {
        margin: 8px 12px 0 0;
        text-align: right;

        & > .price:after {
            background-size: contain;
            bottom: -9px;
        }

        & > div {
            margin-top: 8px;
        }
    }

    & .priceCol {
        justify-content: space-between;
    }

    & .content {
        margin-left: 48px;
        margin-right: 16px;
        h1 {
            margin-top: 8px;
            margin-bottom: 4px;
        }

        .inPerson {
            display: flex;
            align-items: center;

            & > img {
                position: relative;
                top: -1.5px;
                width: 12px;
                margin-right: 10px;
            }
        }

        
    }

    .summary {
        color: ${Colours.n400};
        font-size: 16px;
        line-height: 28px;
        font-family: 'Oxygen';
    }

    & .sharebtn {
        position: relative;
        position: relative;
        top: -20px;
        right: -25px;
    }

    & .price {
        @media screen and (max-width: 420px) {
            text-shadow:
                -1px -1px 0 #fff,  
                1px -1px 0  #fff,
                -1px 1px 0  #fff,
                1px 1px 0   #fff;
        }
    }

    @media screen and (max-width: 860px) {
        & .content {
            margin-top: 21px;
            margin-right: 64px;
        }

        & .priceCol {
            position: absolute;
            right: 0;
            height: calc(100% - 28px);
        }
    }
`

const Column = styled.div`
   display: flex;
   flex-direction: column;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`

const Tag = styled.div`
    font-size: 14px;
    line-height: 20px;
    padding: 4px 24px;
    border: .5px solid ${Colours.b500};
    border-radius: 1000px;
    background: ${Colours.t100};
`

const Subjects = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    &.right {
        flex-direction: column;
        gap: 8px;
        margin-right: 18px;
    }

    &.bottom {
        justify-content: end;
        gap: 16px;
        margin: 8px 0 0 0;
    }
`

const Subject = styled.div`
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 16px;
    line-height: 28px;
`

const PriceTagline = styled.div`
    font-size: 14px;
    line-height: 20px;
    color: ${Colours.n600};
`

const Reviews = styled.div`
    margin: 24px 0 -4px 42px;

    &.na {
        font-style: italic;
        color: ${Colours.n600};
        opacity: .66;
        margin-bottom: 16px;
    }
`

const Location = styled.div`
    margin: 0 0 0 42px;
    display: flex;
    align-items: center;

    & > img {
        position: relative;
        top: -1px;
        margin-right: 8px;
    }
`

const Stars = styled.div`
 & img {
    margin-right: 10px;
 }

 & img:last-of-type {
    margin-right: 0;
 }

 margin-bottom: 16px;
`   

function AgencySummary({ user, hover, onClick, rightSubjects }) {

    const [subjects, setSubjects] = useState([])
    const [minmaxPrice, setMinmaxPrice] = useState([0, 0])
    const [tags, setTags] = useState([])
    const [userContext, setUserContext] = useState(null) 
    const [favouriteTutors, setFavouriteTutors] = useState([])

    const windowSize = useWindowSize()

    useEffect(() => {
        if (user) {
            user.subjects && setSubjects(user.subjects)
            
            let t = []
            if (user.opt_degree) { t.push('Degree') }
            if (user.opt_dbs) { t.push('DBS') }
            if (user.opt_enhanced_dbs) { t.push('Enhanced DBS') }
            if (user.opt_examiner) { t.push('Examiner') }
            if (user.opt_aqa) { t.push('AQA') }
            if (user.opt_ccea) { t.push('CCEA') }
            if (user.opt_ocr) { t.push('OCR') }
            if (user.opt_edexel) { t.push('Edexel') }
            if (user.opt_wjec) { t.push('WJEC') }

            setTags(t)
        }
    }, [user])

    useEffect(() => {
        if (!userContext || !userContext.user) { return }

        setFavouriteTutors(JSON.parse(userContext.user.favourite_tutors))
    }, [userContext])

    useEffect(() => {
        const minmax = subjects.reduce((minmax, s) => {
            if (s.pivot.price_per_hour_online && s.pivot.price_per_hour_online < minmax[0]) {
                minmax[0] = s.pivot.price_per_hour_online
            }
            if (s.pivot.price_per_hour_in_person && s.pivot.price_per_hour_in_person < minmax[0]) {
                minmax[0] = s.pivot.price_per_hour_in_person
            }
            

            if (s.pivot.price_per_hour_online && s.pivot.price_per_hour_online > minmax[1]) {
                minmax[1] = s.pivot.price_per_hour_online
            }
            if (s.pivot.price_per_hour_in_person && s.pivot.price_per_hour_in_person > minmax[1]) {
                minmax[1] = s.pivot.price_per_hour_in_person
            }

            return minmax
        }, [Number.MAX_VALUE, 0])

        setMinmaxPrice([Math.round(minmax[0] / 100), Math.round(minmax[1] / 100)])
    }, [subjects])

    const subjectReducer = (subjects, subject) => {
        const otherSubjects = []
        if (subjects.length < 5 && !subjects.includes(subject.subject)) {
            subjects.push(subject.subject)
        } else {
            otherSubjects.push(subject.subject)
        }

        if (subjects.length == 5 && !subjects.includes(subject.subject)) {
            subjects.push('& ' + otherSubjects.length + ' more')
        }

        return subjects
    }

    const toggleFavouriteTutor = async event => {
        event.preventDefault()
        event.stopPropagation()

        try {
            const response = await API.post("/user/toggle_favourite_tutor", {
                tutorId: user.id
            })
            if (response && response.data && response.data.success) {
                userContext.setUser({
                    ...userContext.user,
                    favourite_tutors: response.data.favourites
                })
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            Toast.error("Failed to mark tutor as favourite, please try again.")
        }
    }

    const shareProfile = event => {
        event.preventDefault()
        event.stopPropagation()

        navigator.clipboard.writeText(window.location.origin + "/profile/" + user.message_uuid).then(() => {
            toast.info("Copied tutor profile URL to clipboard")
        })
    }

    return <>
        <UserContext.Consumer>{context => { setUserContext(context); } }</UserContext.Consumer>

        <Container className={'tutorsummary ' + (hover ? 'hover' : '')} onClick={e => onClick && onClick(e)}>
            <Card>
                <Column style={{flex: 1}}>
                    <Row className='mainrow' style={{flex: 1}}>
                        <Column>
                            {userContext && userContext.user && userContext.user.role == 'client' ? <>
                                 <img alt="heart" style={{cursor: 'pointer', width: '20px'}} onClick={toggleFavouriteTutor} src={favouriteTutors && favouriteTutors.includes(user.id) ? "/img/heart_full.svg" : "/img/heart.svg"} />
                                 <img alt="share" className='sharebtn' style={{cursor: 'pointer', width: '20px'}} onClick={shareProfile} src="/img/share.svg" />
                            </> : <div style={{width: '20px'}}></div>}
                        </Column>

                        <Column className='maincol' style={{marginLeft: '-20px'}}>
                            <Circle 
                                colour={Colours.t300} 
                                className="profileCircle" 
                                bgImg={user.profile_image}
                            />
                        </Column>

                        <Column style={{flex: 1}}>
                            <Row style={{flex: 1}} className='contentrow'>
                                {windowSize.width > 640 ? 
                                    <Column className="content" style={{flex: 1}}>
                                        <Column style={{justifyContent: 'space-between', flex: 1}}>
                                            <p className='summary'>{user.profile_summary}</p>                            
                                        </Column>
                                    </Column>
                                : null}
                                
                                <Column className="priceCol">
                                    <div className='priceContainer'>
                                        <Underline className="price">{minmaxPrice[0] != minmaxPrice[1] ? `£${minmaxPrice[0]}-` : null}£{minmaxPrice[1]}</Underline>
                                        <PriceTagline>per hour</PriceTagline>
                                    </div>

                                    
                                    <Subjects className='right'>
                                        <Row style={{alignItems: 'center'}}>
                                            {subjects.find(s => s.pivot.in_person) ? 
                                                <div className="inPerson" style={{marginRight: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}><img alt="person" src="/img/person.webp" style={{width: '16px', height: '20px'}} /> In person</div> 
                                            : null}
                                            {subjects.find(s => s.pivot.online) ? 
                                                <div className="online"><img src="/img/online.svg" alt="online" /> Online</div> 
                                            : null}
                                        </Row>
                                    </Subjects>
                                </Column>
                            </Row>

                           
                        </Column>
                        
                    </Row>
                    {windowSize.width <= 640 ? <Row>
                        <p className='summary' style={{marginBottom: '32px'}}>{user.profile_summary}</p> 
                    </Row> : null}
                </Column>
            </Card>
        </Container>
    </>
}

export default AgencySummary
