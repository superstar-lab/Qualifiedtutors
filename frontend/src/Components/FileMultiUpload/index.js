import styled from 'styled-components'
import Colours from '../../Config/Colours.js'
import Button from '../Button'
import { useRef, useState, useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import useWindowSize from '../../Hooks/UseWindowSize/index.js'
import InputRange from 'react-input-range'
import AvatarEditor from 'react-avatar-editor'
import { Card, Modal } from '../index.js'

const Remove = styled.div`
    display: none;
    position: absolute;
    top: -16px;

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

    &:after {
        font-size: 24px;
        position: relative;
        top: -16px;
        content: "Remove";
        text-shadow:
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000;
    }
`

const Container = styled.div`
    position: relative;
    border: 1px dashed ${props => props.error ? Colours.r400 : Colours.b500};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding: 32px 0;
    & input[type='file'] {
        display: none;
    }

    img {
        width: 96px;
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

    label {
        color: ${Colours.n500};
    }

    & .crop {
        color: ${Colours.n500};
        transition: color .25s;
        &:hover {
            font-weight: bold;
            color: black;
        }
    }

    & .modal {
        & label {
            color: ${Colours.b500};
            font-weight: bold;
            
            &:first-of-type {
                margin-top: 16px;
            }
        }
    }
    
    ${props => props.previews ? `
        
    ` : ''}

    ${props => props.background ? `
        background: url("${props.background}") no-repeat center center;
        background-size: cover;
    ` : ''}

    ${props => props.circle ? `
        border-radius: 50%;
        width: 282px;
        height: 282px;
    ` : ''}
`

const Tagline = styled.div`
    margin-top: 16px;
    color: ${Colours.b500};
    font-size: 14px;

    & img {
        position: relative;
        top: 1.5px;
        width: 14px;
    }
    
`

const Errors = styled.div` 
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
`

const Error = styled.div`
    color: ${Colours.r400};
    font-size: 14px;

    & img {
        position: relative;
        top: 2.5px;
        width: 15px;
    }
`

const Previews = styled.div`
    top: 12px;
    left: 8px;
    width: calc(100% - 16px);
    display: flex;
    flex-wrap: wrap;

    & > div {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 16px;

        & img {
            object-fit: contain;
            height: 96px;
            width: 100%;
            margin-bottom: 8px;
        }

        & label {
            width: 128px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 8px;
        }

        &:hover ${Remove} {
            display: flex;
            cursor: pointer;
        }
    }
`

const Wrapper = styled.div`
    margin-bottom: 48px;
`

/**
 * Multiple file upload
 * 
 * Displays a component letting users upload and preview files.
 * 
 * @param maxFiles          Integer         Max # of files users can upload
 * @param maxSize           Integer         Max size of an individual file in MB
 * @param accept            String          Comma separated list of file types to accept
 * @param tagline           String          If present used as a label displayed under the upload area
 * @param private           Boolean         If present file previews for remote assets will use a filetype image
 * @param onFileRefChange   Function(Ref)   Can be used to capture a ref to the <input> node
 * @param onPreviewChange   Function(Array) Called whenever a file is uploaded or an image is modified
 * @param existingFiles     Array           Can be used to set the initial previews state
 *
 * @example
 *  <FileMultiUpload
 *      accept=".jpg,.jpeg,.png"
 *      onPreviewChange={previews => {  
 *          // Do something with the uploaded/modified files
 *      }}
 *  />
 * 
 * @example
 *  const [files, setFiles] = useState([])
 *  
 *  ...
 * 
 *  <FileMultiUpload
 *      accept=".doc,.docx,.pdf"
 *      maxFiles={3}
 *      maxSize={10}
 *      tagline="3 DOC or PDF, up to 10MB"
 *      private
 *      existingFiles={files}
 *      onPreviewChange={previews => setFiles(previews)}
 *  />
 */
function FileMultiUpload(props) {
   
    const fileInput = useRef()
    const [imgSrc, setImgSrc] = useState(null)
    const [imgErrors, setImgErrors] = useState([])
    const [filePreviews, setFilePreviews] = useState([])

    const cropperRef = useRef()
    const [editorVisible, setEditorVisible] = useState(false)
    const [croppingImageIndex, setCroppingImageIndex] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [cropperSize, setCropperSize] = useState({
        width: 450,
        height: 450
    })

    const windowSize = useWindowSize()


    useEffect(() => {
        props.onFileRefChange && props.onFileRefChange(fileInput.current)
    }, [fileInput.current])

    useEffect(() => {
        props.onPreviewChange && props.onPreviewChange(filePreviews)
    }, [filePreviews])
    
    useEffect(() => {
        setFilePreviews(props.existingFiles)
    }, [props.existingFiles])

    const triggerUpload = event => {
        fileInput.current.click()
    }

    const removeItem = index => {
        const items = [...filePreviews]
        const files = fileInput.current.files
        const fileBuffer = new DataTransfer()

        items.splice(index, 1)
    
        for (let i = 0; i < files.length; i++) {
            if (i != index) {
                fileBuffer.items.add(files[i])
            }
        }

        fileInput.current.files = fileBuffer.files
        setFilePreviews(items)
        setImgErrors([])
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })

    const onFile = async event => {
        setImgErrors([])
        let errors = []
        let previews = []

        const files = event.target.files
        const fileBuffer = new DataTransfer()

        for(let i = 0; i < files.length; i++) {
            const file = files[i]
           
            if (props.maxFiles && (previews.length + filePreviews.length ) >= props.maxFiles) {
                errors.push(`Max file limit reached, can not accept ${file.name}`)
                continue
            }

            if (props.maxSize) {
                const sizeLimit = props.maxSize * (1024 * 1024)
                if (file.size > sizeLimit) {
                    errors.push(`Filesize of ${file.name} exceedes max filesize (${props.maxSize} MB)`)
                    continue
                }
            }

            fileBuffer.items.add(file)
            if (file.type.split('/')[0] == 'image') { 
                const imgUrl = URL.createObjectURL(file)
                previews.push({
                    name: file.name,
                    url: imgUrl,
                    type: 'image',
                    uploaded: false,
                    base64: await toBase64(file),
                    mime: file.type,
                    lastModified: file.lastModified
                })
            } else {
                previews.push({
                    name: file.name,
                    url: file.name.endsWith('.pdf') ? "/img/file-pdf.svg" : "/img/file-doc.svg",
                    type: 'document',
                    uploaded: false,
                    base64: await toBase64(file),
                    mime: file.type,
                    lastModified: file.lastModified
                })
            }
        }

        fileInput.current.files = fileBuffer.files
        setFilePreviews([...filePreviews, ...previews])
        setImgErrors(errors) 
    }

    const dropHandler = event => {

        event.preventDefault()

        const e = {
            value: "",
            target: { files: event.dataTransfer.files }
        }

        fileInput.current.files = event.dataTransfer.files

        onFile(e)
    }

    const dragOverHandler = event => {
        event.preventDefault()
    }

    const cancel = event => {
        setCroppingImageIndex(null)
        setEditorVisible(false)
        setRotate(0)
        setZoom(1)
    }

    const crop = async event => {
        const img = {...filePreviews[croppingImageIndex]}
        
        cropperRef.current.getImage().toBlob(async blob => {
            img.url = URL.createObjectURL(blob)
            img.base64 = await toBase64(blob)
            img.uploaded = false

            filePreviews[croppingImageIndex] = img
            setFilePreviews(filePreviews)
            cancel()
        })
    }

    const openCropper = index => {
        
        setCroppingImageIndex(index)
        setEditorVisible(true)
    }

    const getPlaceholderForFile = url => {
        const ext = url.substring(url.lastIndexOf('.') + 1)
        
        if (ext == 'jpg' || ext == 'jpeg') { return '/img/file-jpg.svg' }
        if (ext == 'png') { return '/img/file-png.svg' }
        if (ext == 'doc' || ext == 'docx') { return '/img/file-doc.svg' }
        if (ext == 'pdf') { return '/img/file-pdf.svg' }

        return '/img/doc_unknown.webp'
    }

    return (<Wrapper>
        <Container {...props} previews={filePreviews.length > 0} onDrop={dropHandler} onDragOver={dragOverHandler}>
            <input 
                type="file" 
                multiple
                ref={fileInput} 
                accept={props.accept ? props.accept : '*'} 
                onChange={onFile}
            />
    
            {filePreviews.length > 0 ? 
                <Previews>
                    {filePreviews.map((file, i) => <div>
                        <img crossOrigin='anonymous' alt="file preview" src={props.private && file.url && file.url.startsWith('http') ? getPlaceholderForFile(file.url) : file.url} /> 
                        <label>{file.name}</label> 
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '96%'}}>
                            <div onClick={e => removeItem(i)} style={{cursor: 'pointer'}}><img style={{width: '16px', height: '16px'}} src="/img/delete_red.webp" /></div>
                            {file.type == 'image' && !(props.private && file.url.startsWith('http')) ? <div className='crop' style={{display: 'flex', cursor: 'pointer'}} onClick={e => openCropper(i)}><img alt="crop image" src="/img/crop_green.webp" style={{width: '16px', height: '16px'}} />&nbsp; Crop</div> : null}
                        </div>
                    </div>)}
                </Previews>
            : null}

            {filePreviews.length < (props.maxFiles ? props.maxFiles : 1) ? 
                <>
                    {filePreviews.length == 0 ? <img alt="upload" src="/img/upload.webp" /> : null}
                    <h1 style={filePreviews.length ? {marginTop: '40px'} : {}}>Drag &amp; Drop your file</h1>
                    <Button onClick={triggerUpload}>Browse to Upload</Button>
                </>
            : null}
            
            

            <Modal visible={editorVisible} dismiss={cancel} style={{display: 'flex', flexDirection: 'column'}}>
                <Card style={{overflow: 'hidden', flex: 1, overflowY: windowSize.height < 860 ? 'scroll' : 'hidden'}}>
                    <AvatarEditor 
                        crossOrigin='anonymous'
                        ref={cropperRef}
                        image={filePreviews.length > 0 && filePreviews[croppingImageIndex] ? filePreviews[croppingImageIndex].url : null}
                        width={cropperSize.width}
                        height={cropperSize.height}
                        border={cropperSize.width == 190 ? 16 : 48}
                        scale={zoom}
                        rotate={rotate}
                    />

                    <label style={{marginBottom: windowSize.height < 860 ? '8px' : '0'}}>Zoom</label>
                    <InputRange 
                        value={zoom}
                        onChange={value => setZoom(value)}
                        step={0.1}
                        minValue={.5}
                        maxValue={10}
                        formatLabel={value => ``}
                    />

                    <label style={{marginBottom: windowSize.height < 860 ? '8px' : '0'}}>Rotate</label>
                    <InputRange 
                        value={rotate}
                        onChange={value => setRotate(value)}
                        step={1}
                        minValue={0}
                        maxValue={360}
                        formatLabel={value => ``}
                    />

                    <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative', top: '16px'}}>
                        <Button outline onClick={cancel}>Cancel</Button>
                        <Button primary onClick={crop}>Save</Button>
                    </div>
                </Card>
            </Modal>
        </Container>
        
        {props.tagline ? <Tagline><img alt="alert" src="/img/alert_18.webp" />&nbsp; {props.tagline}</Tagline> : null}
        {imgErrors ? <Errors>{imgErrors.map(imgError => <Error><img alt="danger" src="/img/danger.webp" />&nbsp; {imgError}</Error>)}</Errors> : null}
    </Wrapper>)
}

export default FileMultiUpload
