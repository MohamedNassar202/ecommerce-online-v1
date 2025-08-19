import { appError } from "../utils/appErrorClass.js"
import { catchError } from "../utils/catchError.js"

export const deleteOne = (model, name) => {
    return catchError(
        async (req, res, next) => {
            const { id } = req.params
            const document = await model.findByIdAndDelete(id)
            let response = {};
            response[name] = document
            return document ? res.status(200).json({ message: "Done", ...response })
                : next(new appError(`${name} Not Found`, 404))

            // !document && res.status(404).json({ message: "document Not Found" })
            // document && res.status(200).json({ message: "Done", document })
        })
}