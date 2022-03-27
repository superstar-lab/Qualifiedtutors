import styled from 'styled-components'
import {Helmet} from "react-helmet"
import { useEffect, useState } from 'react'
import {
    Underline,
    Circle,
    FixedWidth,
    Link,
    Carousel,
    API,
    Dropdown
} from '../../Components'
import Colours from '../../Config/Colours.js'
import zIndex from '../../Config/zIndex'
import Cities from '../../Config/Cities'
import Counties from '../../Config/Counties'
import { LoosePostcodeRegex } from '../../Config/Validation'
import { useHistory, useLocation } from 'react-router-dom'
import SubjectContext from '../../SubjectContext'

const Container = styled.div`
    & .fixedWidth {
        padding: 0 48px;
    }

    @media screen and (max-width: 1440px) {
        .decorativeCircles {
            margin-left: -116px;
        }
    }

    @media screen and (max-width: 1150px) {
        & .fixedWidth {
            padding: 0 24px;
        }
        
        .howItWorks {
            .steps {
                flex-wrap: wrap;
                gap: 16px;
            }
        }

        .association .links {
            flex-wrap: wrap;
            gap: 16px;
        }

        .subjects .subjectContainer {
            justify-content: center;
        }
    }

    @media screen and (max-width: 800px) {
        .decorativeCircles {
            margin-left: 0;
        }

        .fixedWidth {
            margin: 0;
        }

        .findTutor {
            .mainCol {
                max-width: unset !important;
            }

            .search input {
                width: 100% !important;
            }
        }
    }

    @media screen and (max-width: 640px) {
        & .search {
            & .dropdown > div:first-of-type {
                text-overflow: unset;
                padding-right: 20px;
            }

            & .dropdown input {
                font-size: 12px;

                & ~ div {
                    width: 10px;
                    height: 13px;
                    background-size: contain;
                    transform: translateY(calc(-50% + 3px));
                    background-repeat: no-repeat;
                }
            }

            & button {
                font-size: 16px !important;
                padding: 0 16px !important;
            }
        }
    }

    @media screen and (max-width: 480px) {
        & .search {

            & .dropdown > div:first-of-type {
                padding-left: 6px;
            }

            & .dropdown input {
                font-size: 11px;
            }
            & button {
                font-size: 12px !important;
                padding: 0 8px !important;
            }
        }
    }
`

const Section = styled.section`
    position: relative;
    width: 100%;

    h2 {
        font-size: 48px;
    }

    & .tealRect {

    }

   
    &.white {
        background: white;
    }

    &.paddingTop {
        padding-top: 112px;
    }

    &.paddingBottom {
        padding-bottom: 112px;
    }

    &.findTutor {
        margin-bottom: 104px;
        margin-top: 96px;

        & .mainCol {
            max-width: 635px;
        }

        & .fixedWidth {
            display: flex;
        }

        & b {
            font-weight: bold;
            font-size: 16px;
            line-height: 28px;
            color: ${Colours.b500};
        }

        & h1 {
            font-size: 80px;
            font-weight: 700;
            line-height: 96px;
            margin-top: 24px;
            margin-bottom: 32px;
        }

        & p {
            font-size: 18px;
            line-height: 32px;
            font-weight: 400;
            color: ${Colours.n600};
        }

        & p:first-of-type { 
            margin-bottom: 48px;
        }

        & .search {
            display: flex;
            margin-bottom: 24px;

            & .dropdown {
                border-top: 2px solid ${Colours.b300};
                border-bottom: 2px solid ${Colours.b300};

                & > div:first-of-type {
                    border: 0;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }

                &:first-of-type {
                    border-left: 2px solid ${Colours.b300};
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    border-right: 1px solid rgba(0,0,0,.01);
                }

                &:last-of-type {
                    
                }

                & input::placeholder {
                    opacity: .5;
                }
            }

            &:hover {
                & .dropdown {
                    border-top: 2px solid ${Colours.b500};
                    border-bottom: 2px solid ${Colours.b500};    

                    &:first-of-type {
                        border-left: 2px solid ${Colours.b500};
                    }
                }
            }

            & button {
               background: ${Colours.b500};
               color: white;
               border: 0;
               border-radius: 0 4px 4px 0;
               font-weight: bold;
               font-size: 21px;
               line-height: 32px;
               padding: 0 26px;
               cursor: pointer;
               transition: background .8s;
               background-position: center;

               &:hover {
                   background: ${Colours.b550} radial-gradient(circle, transparent 1%, ${Colours.b550} 1%) center/15000%;
               }
               &:active {
                   background-color: ${Colours.b600};
                   background-size: 100%;
                   transition: background 0s;
               }
            }
        }

        & .decorativeCircles {
            position: relative;
        }
        
        & .circle {
            position: absolute;
            z-index: ${zIndex.top};
        }

        & .circle:nth-of-type(1) {
            top: -60px;
            left: 100px;
        }

        & .circle:nth-of-type(2) {
            left: 506px;
            top: 8px;
        }

        & .circle:nth-of-type(3) {
            left: 185px;
            top: 342px;
        }

        & .circle:nth-of-type(4) {
            top: 438px;
            left: 454px;
        }

        & .circle:nth-of-type(5) {
            top: 539px;
            left: 315px;
        }

        & .circle:nth-of-type(6) {
            top: 648px;
            left: 298px;
        }
    }

    &.subjects h2 {
        margin-top: 92px;
        margin-bottom: 72px;
    }

    &.association {
        padding-top: 156px;
        padding-bottom: 141px;
    }

    &.howItWorks {
        padding-top: 93px;
        padding-bottom: 216px;

        & > div >  h2:first-of-type {
            margin-top: 0;
            margin-bottom: 64px;
        }
    }

    @media screen and (max-width: 1280px) {
        .decorativeCircles {
            position: absolute !important;
            right: 0;
            width: 696px;
            z-index: ${zIndex.level1};
        }

        & .mainCol {
            position: relative;
            z-index: ${zIndex.level2};
        }
    }

    @media screen and (max-width: 1150px) {
        &.findTutor {
            margin-top: 64px;
            margin-bottom: 64px;
        }

        .decorativeCircles {
            & > div:nth-of-type(1),
            & > div:nth-of-type(3) {
                opacity: .33;
            }
        }
    }

    @media screen and (max-width: 980px) {
        .decorativeCircles > div {
            opacity: .33;
        }
    }

    @media screen and (max-width: 750px) {
        &.findTutor {
            h1 {
                font-size: 64px;
                line-height: 76.8px;
            }
        }
    }

    @media screen and (max-width: 640px) {
        .decorativeCircles {
            left: -76px;
            right: unset;
        }

        .decorativeCircles {
            & > div:nth-of-type(3) {
                opacity: .1;
            }

            & > div:nth-of-type(4) {
                opacity: .06;
            }

            & > div:nth-of-type(5) {
                opacity: .03;
            }

            & > div:nth-of-type(6) {
                opacity: .025;
            }
        }

        &.findTutor {

            margin-top: 32px;
            margin-bottom: 32px;

            h1 {
                font-size: 48px;
                line-height: 57.6px;
                margin: 8px 0;
            }

            & .mainCol {
                & b, & p {
                    font-size: 14px;
                }
                
                & p {
                    margin-bottom: 16px;
                }

                & .search {
                    margin-bottom: 0;
                }
            }
        }

        &.howItWorks {
            padding-top: 32px;
            padding-bottom: 96px;            

            h1 {
                
                margin: 8px 0;
            }

            & > div >  h2:first-of-type {
                margin-top: 0;
                margin-bottom: 36px;
                font-size: 40px;
                line-height: 57.6px;
            }
        }
        
        &.association {

            padding-top: 100px;
            padding-bottom: 64px;

            & > div >  h2:first-of-type {
                margin-top: 0;
                font-size: 40px;
                line-height: 57.6px;
            }

            & .links {
                margin-top: 0;
            }


        }
    }

    @media screen and (max-width: 460px) {
        &.findTutor {
            h1 {
                font-size: 36px;
                line-height: 1.25;
            }

            & #up-grades {
                font-size: 34px;
            }
        }
    }
`

const TealRect = styled(Section)`
    position: relative;
    width: 100%;
    background: ${Colours.t500};
    

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: -112px;
        width: 100%;
        height: 112px;
        background-image: url('/img/teal_rect.svg');
        background-color: white;
        background-size: 100%;
        z-index: ${zIndex.sectionBG};
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: -112px;
        width: 100%;
        height: 112px;
        background-image: url('/img/teal_rect.svg');
        background-color: white;
        background-size: 100%;
        background-position-y: 100%;
        z-index: ${zIndex.sectionBG};
    }

    @media screen and (max-width: 440px) {
        &::after {
            background-size: 100% 130%;
        }

        &::before {
            background-size: 100% 130%;
        }
    }

    @media screen and (max-width: 340px) {
        &::after {
            background-size: 100% 180%;
        }

        &::before {
            background-size: 100% 180%;
        }
    }
`

const Column = styled.div`
    
`

const Row = styled.div`

`

const Associations = styled.div`
   display: flex;
   justify-content: space-around;
   align-items: center;
   margin-top: 132px;
`

const Subjects = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 56px;
   max-width: 1064px;
   margin: 0 auto 120px auto;
`

const Subject = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 24px 32px;

    width: 224px;
    height: 224px;

    background: #FFFFFF;

    border: 1px solid #8FC8FF;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px #1E90FF, 0px 16px 24px rgba(143, 200, 255, 0.2);
    border-radius: 50%;

    & img {
        width: 40px;
        height: 40px;
    }
`

const PopularSearches = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
`

const Steps = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const StepContent = styled.div`
  
    position: relative;

   & h2 {
        position: absolute;
        top: -350px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(143, 200, 255, 0.25);
        font-size: 300px;
        z-index: ${zIndex.BG};
   }

   & h3 {
        color: ${Colours.n400};
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
        width: 90%;
        margin: 12px auto 12px auto;
        text-align: center;
   }

   & p {
        color: ${Colours.n400};
        font-weight: normal;
        font-size: 18px;
        line-height: 32px;
        width: 66%;
        text-align: center;
        margin: 0 auto;
   }
`

const Review = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

     & > img:first-of-type {
        border: 2px solid white;
        border-radius: 50%;
        width: 76px;
        height: 76px;
        margin-bottom: 16px;
     }

     & .copy {
        font-size: 18px;
        line-height: 32px;
        color: ${Colours.n250};
        max-width: 750px;
        text-align: center;
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
/**
 * Home page
 * 
 */
function Home() {
    
    const [searchString, setSearchString] = useState('')
    const [levels, setLevels] = useState([])
    const [subjects, setSubjects] = useState([])
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("")

    const history = useHistory()
    const location = useLocation()

    const [reviews, setReviews] = useState([{
        picture: '/img/person6.webp',
        score: 4,
        name: 'Cathrine',
        date: '2022-01-20T03:24:57.000000Z',
        review: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
    }, {
        picture: '/img/person4.webp',
        score: 4,
        name: 'Natalie',
        date: '2022-01-20T03:24:57.000000Z',
        review: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
    }])

    useEffect(() => {
        if (selectedSubject && selectedSubject.levels) {
            setLevels(JSON.parse(selectedSubject.levels))
        }
    }, [selectedSubject])

    useEffect(() => {
        setSelectedSubject("")
        setSelectedLevel("")
    }, [location])

    const search = (str) => {
        const params = {}

        if (selectedSubject) {
            params.subject = selectedSubject.id 

            if (selectedLevel) {
                params.level = selectedLevel
            }

            history.push('/find-a-tutor?' + (new URLSearchParams(params).toString()))
        } else {
            history.push('/find-a-tutor')
        }
    }

    return (<>
        <Helmet>
            <title>Qualified Tutors</title>
        </Helmet>
    
        <SubjectContext.Consumer>
            {subjectContext => 
                <Container>
                    <Section className="findTutor">
                        <FixedWidth>
                        <Column className="mainCol">
                            <b>+ ALL TUTORS ARE FULLY QUALIFIED</b>
                            <h1>Find <Underline large>your</Underline> tutor.<br /><span id="up-grades">Up your grades.</span></h1>
                            <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.<br />Velit officia consequat duis enim velit mollit. Exercitation veniam consequa.</p>
                        
                            <div className="search">
                                <Dropdown
                                    editable
                                    clearable
                                    placeholder="Subject"
                                    noChevron
                                    onChange={(value, node) => setSelectedSubject(node && node.key ? subjectContext.subjects.find(s => s.id == node.key) : value)}
                                    selected={selectedSubject instanceof Object ? selectedSubject.subject : selectedSubject}
                                    clearCallback={() => setSelectedLevel("")}
                                >
                                    {subjectContext.subjects.map(subject => <div key={subject.id}>{subject.subject}</div>)}
                                </Dropdown>
                                <Dropdown
                                    editable
                                    clearable
                                    placeholder={levels.length > 0 ? "Level" : "Select a subject first"}
                                    noChevron
                                    onChange={value => setSelectedLevel(value)}
                                    selected={selectedLevel}
                                >
                                    {levels.map(level => <div key={level}>{level}</div>)}
                                </Dropdown>
                                <button onClick={search}>SEARCH</button>
                            </div>
                        </Column>

                        <Column className="decorativeCircles">
                            <Circle className="circle" width="384px" colour={Colours.b300}><img alt="person" src="/img/person2.webp" /></Circle>
                            <Circle className="circle" width="212px" colour={Colours.g500}><img alt="person" src="/img/person1.webp" /></Circle>
                            <Circle className="circle" width="208px" colour={Colours.r100}><img alt="person" src="/img/person3.webp" /></Circle>
                            <Circle className="circle" width="186px" colour={Colours.b300}><img alt="person" src="/img/person4.webp" /></Circle>
                            <Circle className="circle" width="133px" colour={Colours.g500}><img alt="person" src="/img/person5.webp" /></Circle>
                            <Circle className="circle" width="66px" colour={Colours.g500}></Circle>
                        </Column>
                        </FixedWidth>
                    </Section>

                    <Section className="white paddingBottom howItWorks">
                        <FixedWidth>
                            <h2>How it w<Underline>orks.</Underline></h2>
                            
                            <Steps className="steps">
                                <Circle width="276px" colour={Colours.b300}>
                                    <StepContent>
                                        <h2>1</h2>
                                        <h3>Amet Minim</h3>
                                        <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                                    </StepContent>
                                </Circle>

                                <Circle width="276px" colour={Colours.g500}>
                                    <StepContent>
                                        <h2 style={{color: Colours.g500, opacity: '.3'}}>2</h2>
                                        <h3>Amet Minim</h3>
                                        <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                                    </StepContent>
                                </Circle>
                                <Circle width="276px" colour={Colours.r100}>
                                    <StepContent>
                                        <h2 style={{color: Colours.r100, opacity: '.3', paddingTop: '6px'}}>3</h2>
                                        <h3>Amet Minim</h3>
                                        <p>Amet minim mollit non deserunt ullamco  amet sint.</p>
                                    </StepContent>
                                </Circle>
                            </Steps>
                        </FixedWidth>
                    </Section>

                    <TealRect>
                        <FixedWidth>
                            <Carousel style={{padding: '8px 0 16px 0'}}>
                                {reviews.map((review, index) => <Review key={index}>
                                    <img alt="person" src={review.picture} />
                                    <Stars>
                                        {Array.from({length: review.score}).map((v, i) => <img alt="full star" key={i} src="/img/star_fill.svg" />)}
                                        {Array.from({length: 5 - review.score}).map((v, i) => <img alt="empty star" key={i} src="/img/star_outline.svg" />)}
                                    </Stars>
                                    <p><b>Reviewed by {review.name}</b>, {new Date(review.date).toLocaleDateString("en-US")}</p>
                                    <p className="copy">{review.review}</p>
                                </Review>)}
                            </Carousel>
                        </FixedWidth>
                    </TealRect>

                    <Section className="white paddingTop association">
                        <FixedWidth>
                            <h2>In association <Underline>with</Underline>.</h2>

                            <Associations className="links">
                                <a href="https://mrbruff.com/" target="_blank"><img alt="social media guy logo" src="/img/smguy.webp" /></a>
                                <a href="https://thequotationbank.co.uk/" target="_blank"><img alt="quotation bank logo" src="/img/quotationbank.webp" /></a>
                                <a href="https://www.linkythinks.com/" target="_blank"><img alt="linky thinks logo" src="/img/linkythinks.webp" /></a>
                                <a href="https://flipscocards.com/" target="_blank"><img alt="flipsco logo" src="/img/flipsco.webp" /></a>
                            </Associations>
                        </FixedWidth>
                    </Section>

                    {/*
                    <Section className="subjects">
                        <FixedWidth>
                            <h2>Explore by sub<Underline>ject</Underline>.</h2>
                            
                            <Subjects className="subjectContainer">
                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                                <Subject>
                                    <img src="/img/subject_fr.png" />
                                    <h3>French</h3>
                                    <Link primary small btn>VIEW</Link>
                                </Subject>

                            </Subjects>
                        </FixedWidth>
                    </Section>
                    */}
                </Container>
            }
            
        </SubjectContext.Consumer>
    </>)
}

export default Home
