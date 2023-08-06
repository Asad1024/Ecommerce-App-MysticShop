import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import products from "./data/product.js";
import users from "./data/user.js";
import User from "./models/userModels.js";
import Product from "./models/productModels.js";
import Order from "./models/orderModels.js";
import connectDB from "./config/db.js";

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUser = await User.insertMany(users)
        const adminUser = createdUser[0]._id

        const sample = products.map((product)=> {
            return { ...product , user: adminUser}
        })

        await Product.insertMany(sample)

        console.log("Data imported".green.inverse);
        process.exit()
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Product.deleteMany()
        await Order.deleteMany()
        await User.deleteMany()

        console.log("Data Destroyed".red.inverse);
        process.exit()
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}

