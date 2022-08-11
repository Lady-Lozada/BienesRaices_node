import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'

const storage = multer.diskStorage({
    destination: function(req, file, callBack) {
        console.log("1: "+ file)
        callBack(null, './public/uploads/')
    },
    filename: function(req, file, callBack) {
        console.log("2: "+ file)
        callBack(null, generarId() + path.extname(file.originalname) )
    }
})

const upload = multer({ storage })

export default upload;