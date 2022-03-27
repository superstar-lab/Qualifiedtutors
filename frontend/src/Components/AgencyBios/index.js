import styled from "styled-components"
import FileUpload from '../FileUpload'
import Input from '../Input'
import Button from '../Button'
import Colours from '../../Config/Colours'

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`

const Bio = styled.div`
   margin-top: 48px;

   &:first-of-type {
       margin-top: 0;
   }
`

const BioControls = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    ${props => props.disabled ? `
        display: none;
    ` : ''}
`

const MoveBio = styled.div`
    cursor: pointer;
    color: ${Colours.n500};
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    transition: color .25s;

    &:hover {
        color: black;
    }

    ${props => props.disabled ? `
        opacity: .33;
        cursor: not-allowed;
    ` : ''}
`

const RemoveBio = styled.div`
    border-top: 1px solid #e0e0e0;
    padding-top: 8px;
   cursor: pointer;
   color: ${Colours.n500};
   display: flex;
   align-items: center;
   justify-content: flex-end;
   gap: 8px;
   transition: color .25s;

   &:hover {
       color: black;
   }
   
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

/**
 * Agency bios
 * 
 * Exposes UI elements necessary for collecting a list of bios for an agencies tutors. 
 * A stateful array parameter and its setter must be provided, and from there the component will handle state management.
 * 
 * @param bios      Array       Array of bio objects [{name, blurb, imageUrl}]
 * @param setBios   Function    Setter for the bios param
 * @example 
 *  const [bios, setBios] = useState([])
 *  ...
 *  <AgencyBios bios={bios} setBios={setBios} />
 */
function AgencyBios({bios, setBios, ...props}) {

    const addBio = () => {
        setBios([
            ...bios,
            {
                name: "",
                blurb: "",
                imageUrl: ""
            }
        ])
    }

    const removeBio = index => {
        const b = bios.map(bio => ({...bio}))
        b.splice(index, 1)
        setBios(b)
    }

    const updateBio = (index, field, value) => {
        const b = bios.map(bio => ({...bio}))
        b[index][field] = value 
        setBios(b)
    }

    const moveBioUp = index => {
        const b = bios.map(bio => ({...bio}))
        const bio = b[index]
        b.splice(index, 1)
        b.splice(index - 1, 0, bio)
        setBios(b)
    }

    const moveBioDown = index => {
        const b = bios.map(bio => ({...bio}))
        const bio = b[index]
        b.splice(index, 1)
        b.splice(index + 1, 0, bio)
        setBios(b)
    }

    return <>
        {bios.map((bio, index) => <Bio>
            <Label>Upload a photo</Label>

            <Row style={{alignItems: 'flex-start'}}>
                <FileUpload
                    square
                    preview 
                    accept=".jpg,.jpeg,.png" 
                    tagline="PNG or JPEG image, up to 10 mb" 
                    maxSize={10}
                    canonImgSrc={bio.imageUrl}
                    onImgSrcUpdate={src => src && updateBio(index, 'imageUrl', src)}
                />
                <BioControls disabled={bios.length == 1}>
                    <MoveBio onClick={e => index != 0 && moveBioUp(index)} disabled={index == 0}>Move bio up <img alt="move bio up" src="/img/back-icon.svg" style={{width: '14px', height: '14px', transform: 'rotate(90deg)'}} /></MoveBio>
                    <MoveBio onClick={e => index != bios.length - 1 && moveBioDown(index)} disabled={index == bios.length - 1}>Move bio down <img alt="move bio down" src="/img/back-icon.svg" style={{width: '14px', height: '14px', transform: 'rotate(-90deg)'}} /></MoveBio>
                    <RemoveBio onClick={e => removeBio(index)}>Remove bio <img alt="remove bio" style={{width: '18px'}} src="/img/delete_red_18.webp" /></RemoveBio>
                </BioControls>
            </Row>
            <Input label="Name" value={bio.name} onChange={e => updateBio(index, 'name', e.target.value)} />
            <Input text label="Blurb" value={bio.blurb} onChange={e => updateBio(index, 'blurb', e.target.value)} style={{height: '128px'}} />
        </Bio>)}

        <Row style={{display: 'flex', marginTop: '32px'}}> 
            <div></div>
            <Button danger onClick={addBio}>Add another bio</Button>
        </Row>
    </>
}

export default AgencyBios