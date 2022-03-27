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

const Container = styled.div`
    color: ${Colours.n200};    

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

        @media screen and (max-width: 420px) {
            text-shadow:
                -1px -1px 0 #fff,  
                1px -1px 0  #fff,
                -1px 1px 0  #fff,
                1px 1px 0   #fff;
        }
    }

    & .priceContainer {
        position: absolute;
        top: 32px;
        right: 48px;
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

        .summary {
            color: ${Colours.n400};
            font-size: 16px;
            line-height: 28px;
            font-family: 'Oxygen';
        }

        @media screen and (max-width: 720px) {
            margin-left: 16px;
        }
    }

    & .sharebtn {
        position: relative;
        position: relative;
        top: -20px;
        right: -25px;
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

    &.right {
        flex-direction: column;
        gap: 8px;
        margin-right: 18px;
    }

    &.bottom {
        justify-content: end;
        gap: 16px;
        margin: 8px 0 0 0;
        flex-wrap: wrap;

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

function TutorSummary({ user, hover, onClick, rightSubjects, onFavouriteToggle, ...props }) {

    const [subjects, setSubjects] = useState([])
    const [minmaxPrice, setMinmaxPrice] = useState([0, 0])
    const [tags, setTags] = useState([])
    const [userContext, setUserContext] = useState(null) 
    const [favouriteTutors, setFavouriteTutors] = useState([])

    useEffect(() => {
        if (user) {
            user.subjects && setSubjects(user.subjects)
            
            let t = []
            if (user.opt_degree) { t.push('Degree') }
            if (user.opt_enhanced_dbs) { t.push('Enhanced DBS') }
            if (user.opt_examiner) { t.push('Examiner') }
            if (user.tutor_type == 'teacher') { t.push("Qualified Teacher") }
            if (user.verified_tutor_status == 'approved') { t.push("Background Checked") }

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

        if (minmax[0] == Number.MAX_VALUE && minmax[1] == 0) {
            setMinmaxPrice([0, 0])
        } else {
            setMinmaxPrice([Math.round(minmax[0] / 100), Math.round(minmax[1] / 100)])
        }
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

        const favs = userContext && userContext.user && userContext.user.favourite_tutors ? JSON.parse(userContext.user.favourite_tutors) : []
        const exists = favs.find(id => id == user.id)

        try {
            const response = await API.post("/user/toggle_favourite_tutor", {
                tutorId: user.id
            })
            if (response && response.data && response.data.success) {
                userContext.setUser({
                    ...userContext.user,
                    favourite_tutors: response.data.favourites
                })
                onFavouriteToggle && onFavouriteToggle(user.id, !exists)
                Toast.success(exists ? `Removed ${user.name} from favourites` : `Added ${user.name} to favourites`)
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
                                 <img alt="heart" style={{cursor: 'pointer', width: '20px'}} onClick={toggleFavouriteTutor} src={favouriteTutors && favouriteTutors.includes(user.id) ? "/img/heart_full_red.svg" : "/img/heart_red.svg"} />
                                 <img alt="share" className='sharebtn' style={{cursor: 'pointer', width: '20px'}} onClick={shareProfile} src="/img/share_red.svg" />
                            </> : <div style={{width: '20px'}}></div>}
                        </Column>

                        <Column className='maincol'>
                            <Circle 
                                colour={Colours.t300} 
                                className="profileCircle" 
                                bgImg={user.profile_image}
                            />

                            <Reviews className={user.average_review_score == -1 ? 'na' : ''} style={{display: 'flex', gap: '4px'}}>
                                {user.average_review_score == -1 ? 'No reviews yet' : <Stars>
                                    {Array.from({length: user.average_review_score}).map((v, i) => <img key={i} alt="full star" src="/img/star_fill.svg" />)}
                                    {Array.from({length: 5 - user.average_review_score}).map((v, i) => <img alt="empty star" key={i} src="/img/star_outline.svg" />)}
                                </Stars>}
                                <div style={{fontSize: '14px', position: 'relative', top: '4px'}}>({user.reviews.filter(rev => [rev.reviewee_acceptance, rev.admin_action].includes('approved')).length})</div>
                            </Reviews>

                            <Location>
                                <img alt="location" src="/img/location.svg" />
                                {user.county ? user.county + ', ' : null}
                                {user.city}
                            </Location>
                        </Column>

                        <Column style={{flex: 1}}>
                            <Row style={{flex: 1}} className='contentrow'>
                                <Column className="content" style={{flex: 1}}>
                                    <h1>{user.tutor_type == 'agency' ? user.company_name : `${user.name} ${user.surname.charAt(0)}.`}</h1>
                                    <Row>
                                        {subjects.find(s => s.pivot.in_person) ? 
                                            <div className="inPerson" style={{marginRight: '16px'}}><img alt="person" src="/img/person.webp" /> In person</div> 
                                        : null}
                                        {subjects.find(s => s.pivot.online) ? 
                                            <div className="online"><img alt="person" src="/img/online.svg" /> Online</div> 
                                        : null}
                                    </Row>

                                    <Column style={{justifyContent: 'space-between', flex: 1}}>
                                        <p className='summary'>"{user.profile_summary}"</p>                            

                                        <Tags>
                                            {tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
                                        </Tags>
                                    </Column>
                                </Column>

                                <Column className="priceCol">
                                    <div className='priceContainer'>
                                        <Underline className="price">{minmaxPrice[0] != minmaxPrice[1] ? `£${minmaxPrice[0]}-` : null}£{minmaxPrice[1]}</Underline>
                                        <PriceTagline>per hour</PriceTagline>
                                    </div>

                                    {rightSubjects ? <>
                                        <div></div>
                                        <Subjects className='right'>
                                            {subjects.reduce(subjectReducer, []).map(subject => <Subject>{subject}</Subject>)}
                                        </Subjects>
                                    </>: null }
                                </Column>
                            </Row>
                        </Column>
                    </Row>

                    {!rightSubjects ? 
                        <Subjects className='bottom'>
                            {subjects.reduce(subjectReducer, []).map(subject => <Subject>{subject}</Subject>)}
                        </Subjects>
                    : null }
                    
                </Column>
            </Card>
        </Container>
    </>
}

export default TutorSummary
