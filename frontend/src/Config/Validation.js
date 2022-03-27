const MobileNumberRegex = /^(?:(?:00)?44|0)7(?:[45789]\d{2}|624)\d{6}$/

const PostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i

const LoosePostcodeRegex = /[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}/i

const EmailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i 

const YoutubeEmbedFormatRegex = /https:\/\/www.youtube.com\/embed\/[^"]*/gm

export {
    MobileNumberRegex,
    PostcodeRegex,
    LoosePostcodeRegex,
    EmailRegex,
    YoutubeEmbedFormatRegex
}
