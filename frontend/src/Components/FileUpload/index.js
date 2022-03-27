import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import Button from '../Button'
import { useRef, useState, useEffect } from 'react'
import Modal from '../Modal'
import Card from '../Card'
import AvatarEditor from 'react-avatar-editor'
import InputRange from 'react-input-range'
import useWindowSize from '../../Hooks/UseWindowSize'
import { Scrollbars } from 'react-custom-scrollbars'

const Remove = styled.div`
    display: none;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 96px;
    text-shadow:
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
`

const Container = styled.div`
    position: relative;
    border: 1px dashed ${props => props.error ? Colours.r400 : Colours.b500};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 48px;

    & input[type='file'] {
        display: none;
    }

    img {
        width: 48px;
    }

    h1 {
        color: ${Colours.n200};
        font-size: 16px;
        margin: 16px;
    }
    
    & .input-range {
        margin: 0 0 16px 0;
    }

    & .input-range__slider {
        background: ${Colours.b500};
        border-color: ${Colours.b500};
    }

    & .input-range__track--active {
        background: ${Colours.b500};
    }

    & label {
        color: ${Colours.b500};
        font-weight: bold;
        
        &:first-of-type {
            margin-top: 16px;
        }
    }

    ${props => props.background ? `
        background: url("${props.background}") no-repeat center center;
        background-size: cover;
    ` : ''}

    ${props => props.circle ? `
        border-radius: 50%;
        width: 282px;
        height: 282px;
    ` : ''}

    ${props => props.rectangle ? `
        padding: 24px 0;
    ` : ''}

    ${props => props.square ? `
        width: 320px;
        height: 188px;
    ` : ''}
`

const Tagline = styled.div`
    position: absolute;
    bottom: -24px;
    white-space: nowrap;
    color: ${Colours.b500};
    font-size: 14px;

    & img {
        position: relative;
        top: 1.5px;
        width: 14px;
    }
    
`

const Error = styled.div`
    position: absolute;
    bottom: -40px;
    white-space: nowrap;
    color: ${Colours.r400};
    font-size: 14px;

    & img {
        position: relative;
        top: 1.5px;
        width: 14px;
    }
`

/**
 * Single file upload
 * 
 * Displays a component letting users upload and preview a file.
 * 
 * @param accept            String          Comma separated list of file types to accept
 * @param tagline           String          If present used as a label displayed under the upload area
 * @param onFileRefChange   Function(Ref)   Can be used to capture a ref to the <input> node
 * @param onPreviewChange   Function(Array) Called whenever a file is uploaded or an image is modified
 * @param existingFiles     Array           Can be used to set the initial previews state
 *
 * @example
 *  <FileUpload
 *      accept=".jpg,.jpeg,.png"
 *      onPreviewChange={previews => {  
 *          // Do something with the uploaded/modified files
 *      }}
 *  />
 */
function FileUpload(props) {
   
    const fileInput = useRef()
    const [imgSrc, setImgSrc] = useState(null)
    const [filename, setFilename] = useState("")
    const [tmpImgSrc, setTmpImgSrc] = useState(null) // used to store og img src while cropping in case user cancels crop
    const [imgError, setImgError] = useState(null)
    const [editorVisible, setEditorVisible] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [rotate, setRotate] = useState(0)
    const cropperRef = useRef()
    const [cropperSize, setCropperSize] = useState(props.rectangle ? {
        width: 450,
        height: 102
    } : props.square ? {
        width: 364,
        height: 214
    } : {
        width: 450,
        height: 450
    })
    
    const windowSize = useWindowSize()

    useEffect(() => {
        props.onImgSrcUpdate && props.onImgSrcUpdate(imgSrc)
    }, [imgSrc])

    useEffect(() => {
        props.filenameChange && props.filenameChange(filename)
    }, [filename])


    useEffect(() => {
        props.onFileRefChange && props.onFileRefChange(fileInput.current)
    }, [fileInput.current])

    useEffect(() => {
        setImgSrc(props.canonImgSrc)
        
        if (props.canonImgSrc) {
            const parts = props.canonImgSrc.replaceAll('%2F', '/').split('/')
            setFilename(parts[parts.length - 1])
        }
        
    }, [props.canonImgSrc])

    const triggerUpload = event => {
        fileInput.current.click()
    }
    const onFile = event => {
        setImgError(null)

        if (props.maxSize) {
            const sizeLimit = props.maxSize * (1024 * 1024)
            if (event.target.files[0].size > sizeLimit) {
                setImgError(`Filesize (${event.target.files[0].size / (1024 * 1024)} MB) exceedes max filesize (${props.maxSize} MB)`)
                event.target.value = ""
                return
            }
        }

        const file = event.target.files[0]
        const imgUrl = URL.createObjectURL(file)

        if (props.maxWidth || props.maxHeight) {
            const img = new Image()
            img.src = imgUrl
            img.onload = () => {
                let error = ""
                if (img.width > props.maxWidth) {
                    error += `Image width exceeds max width (${props.maxWidth} px).`
                }
                if (img.height > props.maxHeight) {
                    error += `Image height exceeds max height (${props.maxHeight} px).`
                }

                if (error) {
                    setTmpImgSrc(null)
                    fileInput.current.value = ""
                    setImgError(error)
                }
            }
        }

        if (props.preview) {            
            setTmpImgSrc(imgUrl)
            setEditorVisible(true)
        }

        setFilename(file.name)

        //props.onFile && props.onFile()
    }

    const dropHandler = event => {

        event.preventDefault()
        const e = {
            value: "",
            target: { files: [event.dataTransfer.items[0].getAsFile()] }
        }

        fileInput.current.files = event.dataTransfer.files

        onFile(e)
    }

    const dragOverHandler = event => {
        event.preventDefault()
    }

    const crop = event => {
        cropperRef.current.getImage().toBlob(blob => {
            setImgSrc(URL.createObjectURL(blob))
            props.onFile && props.onFile()
            setEditorVisible(false)
        })
        
    }

    const cancel = event => {
        setImgSrc(tmpImgSrc)
        props.onFile && props.onFile()
        setEditorVisible(false)
    }

    const removeItem = () => {
        setImgSrc(null)
        fileInput.current.value = ""
    }

    const openCropper = () => {
        setEditorVisible(true)
    }

    useEffect(() => {
        //setImgSrc(null)
    }, [])

    useEffect(() => {
        if (windowSize.width < 940) {
            if (props.rectangle) {
                setCropperSize({
                    width: 190,
                    height: 43
                })
            } else if (props.square) {
                setCropperSize({
                    width: 190,
                    height: 112
                })
            } else {
                setCropperSize({
                    width: 190,
                    height: 190
                })   
            }
        } else {
            if (props.rectangle) {
                setCropperSize({
                    width: 450,
                    height: 102
                })
            } else if (props.square) {
                setCropperSize({
                    width: 364,
                    height: 214
                })
            } else {
                setCropperSize({
                    width: 450,
                    height: 450
                })
            }
        }
    }, [windowSize.width, windowSize.height])

    return (<>
        <Container {...props} background={imgSrc} onDrop={dropHandler} onDragOver={dragOverHandler}>
            <input 
                type="file" 
                ref={fileInput} 
                accept={props.accept ? props.accept : '*'} 
                onChange={onFile}
            />

            {!imgSrc && !props.readonly ? <>
                <img alt="upload" src="/img/upload.webp" />
                <h1>Drag &amp; Drop your file</h1>
                <Button onClick={triggerUpload}>Browse to Upload</Button>
                {props.tagline ? <Tagline><img alt="alert" src="/img/alert_18.webp" />&nbsp; {props.tagline}</Tagline> : null}
                {imgError ? <Error><img alt="danger" src="/img/danger.webp" />&nbsp; {imgError}</Error> : null}
            </> : 
            !props.readonly ? <Remove>
                <img alt="delete" style={{width: '64px'}} src="/img/delete_red.webp" />
            </Remove> : null}
        
            {!props.readonly && imgSrc ? 
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', position: 'absolute', bottom: '-24px'}}>
                    <div onClick={removeItem} style={{cursor: 'pointer'}}><img alt="delete" style={{width: '16px', height: '16px'}} src="/img/delete_red.webp" /></div>
                    <div className='crop' style={{display: 'flex', cursor: 'pointer'}} onClick={openCropper}><img alt="crop" src="/img/crop_green.webp" style={{width: '16px', height: '16px'}} />&nbsp; Crop</div>
                </div>
            : null}
            
            <Modal visible={editorVisible} dismiss={cancel} style={{display: 'flex', flexDirection: 'column'}}>
                <Card style={{overflow: 'hidden', flex: 1, overflowY: windowSize.height < 860 ? 'scroll' : 'hidden'}}>
                    <AvatarEditor 
                        crossOrigin='anonymous'
                        ref={cropperRef}
                        image={ props.canonImgSrc ? props.canonImgSrc : tmpImgSrc  /*fileInput.current && fileInput.current.files.length > 0 ? fileInput.current.files[0] : null*/}
                        width={cropperSize.width}
                        height={cropperSize.height}
                        border={cropperSize.width == 190 ? 16 : 48}
                        borderRadius={props.rectangle || props.square ? 0 : 1000}
                        scale={zoom}
                        rotate={rotate}
                    />

                    <label style={{marginBottom: windowSize.height < 620 ? '8px' : '0'}}>Zoom</label>
                    <InputRange 
                        value={zoom}
                        onChange={value => setZoom(value)}
                        step={0.1}
                        minValue={.5}
                        maxValue={10}
                        formatLabel={value => ``}
                    />
 
                    <label style={{marginBottom: windowSize.height < 620 ? '8px' : '0'}}>Rotate</label>
                    <InputRange 
                        value={rotate}
                        onChange={value => setRotate(value)}
                        step={1}
                        minValue={0}
                        maxValue={360}
                        formatLabel={value => ``}
                    />

                    <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative', top: '16px'}}>
                        <Button outline onClick={cancel}>Don't crop</Button>
                        <Button primary onClick={crop}>Save</Button>
                    </div>
                </Card>
            </Modal>
        </Container>
        
        
    </>)
}

export default FileUpload
