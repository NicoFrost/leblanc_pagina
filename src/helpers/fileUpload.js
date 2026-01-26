
export const fileUpload = async (file) => {
    if (file.length === 0) return;

    const cloudUrl = 'https://api.cloudinary.com/v1_1/du7nakzdh/upload'

    const formData = new FormData();

    formData.append('upload_preset','leblanc_sys')
    formData.append('file',file)

    try {
        const resp = await fetch(cloudUrl,{
            method: 'POST',
            body: formData
        });
        
        if(!resp.ok) throw new Error('no se pudo subir la imagen',resp)
        
        const cloudResp = await resp.json()
        console.log(cloudResp);
        
        return cloudResp
    } catch (error) {
       console.log(error.message,error.resp);
       return undefined
    }
}