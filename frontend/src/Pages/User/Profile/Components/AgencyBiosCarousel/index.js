import { useState } from "react"
import styled from "styled-components"
import Colours from "../../../../../Config/Colours"

const Container = styled.div`
    background: ${Colours.b300};
    border-radius: 4px;
    overflow: hidden;
    
`

const Carousel = styled.div`
    display: flex;
    position: relative;
    left: calc(${props => props.offset} * -100%);
`

const Bio = styled.div`

    width: 100%;
    flex-shrink: 0;

    @media screen and (max-width: 1300px) and (min-width: 640px) {
        display: flex;
    }

    & img {
        width: 100%;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        object-fit: cover;

        @media screen and (max-width: 1300px) and (min-width: 640px) {
            width: 40%;
            height: 100%;
        }
    }
`

const Content = styled.div`
    padding: 18px 48px;
    flex: 1;

    @media screen and (max-width: 460px) {
        padding: 18px 16px;
    }
`

const Row = styled.div`
    display: flex;
`

function AgencyBiosCarousel({bios, ...props}) {

    const [offset, setOffset] = useState(0)

    return <Container>
        <Carousel offset={offset}>
            {bios.map(bio => <Bio>
                <img alt="profile picture" src={bio.imageUrl} />

                <Row style={{flex: 1}}>
                    <img 
                        alt="previous"
                        style={{width: '29px', height: '48px', padding: '18px 0 0 4px', cursor: 'pointer'}}
                        src="/img/left_arrow.svg" 
                        onClick={e => setOffset(offset - 1 >= 0 ? offset - 1 : bios.length - 1)} 
                    />
                    <Content>
                        <h1>Our tutors</h1>
                        <h2>{bio.name}</h2>
                        <p>{bio.blurb}</p>
                    </Content>
                    <img 
                        alt="next"
                        src="/img/left_arrow.svg" 
                        style={{transform: 'rotate(180deg)', width: '29px', height: '48px', padding: '0 0 18px 4px', cursor: 'pointer'}} 
                        onClick={e => setOffset(offset + 1 < bios.length ? offset + 1 : 0)} 
                    />
                </Row>
            </Bio>)}
        </Carousel>
    </Container>
}

export default AgencyBiosCarousel