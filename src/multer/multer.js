import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';
import { appError } from '../utils/appErrorClass.js';

function refactorMulter(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + '-' + file.originalname)
        }
    })
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        }
        else {
            cb(new appError('images only', 401), false)
        }

    }
    const upload = multer({ storage, fileFilter })
    return upload
}
export const uploadSingleFile = (fieldName, folderName) => refactorMulter(folderName).single(fieldName)


export const uploadMixOfFiles = (arrayOfFields, folderName) => refactorMulter(folderName).fields(arrayOfFields)

