import mongoose from 'mongoose';

const connection = async() => {
    return await mongoose.connect(process.env.URL_ONLINE_CONNECT_DATABASE).then(() => {
        console.log("Database Connected Successfully");

    }).catch((err) => {
        console.log("Database Error", err);
    });

}

export default connection 