import axios from 'axios'

const uploadFile = (file, signedRequest, url) => {
  const p = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signedRequest)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Success!!! url', url)
          resolve({ imageUrl: url })
        } else {
          reject('Could not upload file.')
        }
      }
    }
    xhr.send(file)
  })
  return p
}

export function getS3SingedUploadUrlAndUpload ({ imageFile, endpointUrl }) {
  const fileType = imageFile.type
  return axios.post(endpointUrl, { fileType })
    .then((result) => {
      const { signedRequest, url } = result.data
      console.log('signedRequest', signedRequest)
      return uploadFile(imageFile, signedRequest, url)
    })
}
