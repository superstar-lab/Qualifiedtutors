import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { FileMultiUpload, Input, RingLoader, Button, Toast, API } from '../../../../../Components'
import Colours from '../../../../../Config/Colours'
import {Helmet} from 'react-helmet'

const Container = styled.div`

`

const Label = styled.label`
    display: block;
    color: ${Colours.b500};
    font-weight: bold;
    font-size: 18px;
    line-height: 32px;
    white-space: nowrap;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`

function Photos(props) {

    const [videoUrl, setVideoUrl] = useState("")
    const [videoUrlError, setVideoUrlError] = useState("")
    const [uploading, setUploading] = useState(false)
    const [fileRef, setFileRef] = useState(null)
    const [filePreviews, setFilePreviews] = useState([])
    const [profilePics, setProfilePics] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (props.user && props.user.profile_additional_images) {
            const docUrlToObj = d => ({
                name: d.split('\\').pop().split('/').pop(),
                url: d,
                type: 'image',
                uploaded: true
            })

            const docs = JSON.parse(props.user.profile_additional_images)
            setProfilePics(docs.map(docUrlToObj))
        }

        if (props.user && props.user.profile_video_link) {
            setVideoUrl(props.user.profile_video_link)
        }
    }, [props.user])

    useEffect(() => {
        const match = videoUrl.match(/https:\/\/www.youtube.com\/embed\/[^"]*/gm)
        if (match && match.length > 0) {
            setVideoUrlError("")
            if (videoUrl != match[0]) {
                setVideoUrl(match[0])
            }
        } else {
            if (videoUrl != "") {
                setVideoUrlError("Video link must be in Youtube embed format")
            } else {
                setVideoUrlError("")
            }
        }
    }, [videoUrl])

    const save = async event => {
        setSaving(true)

        const previews = filePreviews.map(p => ({...p}))
        for(let i = 0; i < previews.length; i++) {
            const file = previews[i]

            if (!file.uploaded || file.url.startsWith('blob:')) {
                const formdata = new FormData()

                const blob = await (await fetch(file.base64)).blob()
                const f = new File([blob], file.name, { type: file.mime, lastModified: file.lastModified })
                if (f) {
                    formdata.append("file", f)
                    try {
                        const response = await API.post('upload/public', formdata, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        file.url = response.data.url
                        file.uploaded = true
                        file.type = 'image'
                        previews[i] = file
                    } catch(error) {
                        Toast.error("Unexpected error uploading images, please try again.")
                    }
                }
            }
        }
        setFilePreviews(previews)

        try {
            const response = await API.post('tutor/profile/photos', {
                profile_video_link: videoUrl,
                profile_additional_images: previews.map(p => p.url)
            })

            if (response && response.data && response.data.user) {
                props.setUser({
                    ...props.user,
                    profile_video_link: response.data.user.profile_video_link,
                    profile_additional_images: response.data.user.profile_additional_images
                })
                Toast.success("Successfully saved your photos and video link.")
            } else {
                throw new Error("Unexpected API error")
            }
        } catch (error) {
            Toast.error("Unexpected error saving your photos & video, please try again.")
        }

        setSaving(false)
    }

    return <>
    <Helmet>
        <title>Photos &amp; video - Qualified Tutors</title>
    </Helmet>

    <Container>
        <Label style={{marginTop: '24px', marginBottom: '16px'}}>Upload your profile photos</Label>
        <FileMultiUpload 
            preview
            accept=".jpg,.jpeg,.png"
            tagline="Up to 3 PNG or JPG images, up to 10 MB each"
            maxSize={10}
            maxFiles={30}
            onFileRefChange={ref => setFileRef(ref)}
            onPreviewChange={previews => setFilePreviews(previews)}
            existingFiles={profilePics}
        />
        
        <Input label="Paste in video link" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} error={videoUrlError} /> 

        <Row style={{marginTop: '32px', paddingTop: '32px', borderTop: '1px solid ' + Colours.n300}}>
            <div></div>
            <Button primary large disabled={saving} onClick={save}>{saving ? <RingLoader small /> : 'SAVE'}</Button>
        </Row>
    </Container>
    </>
}

export default Photos