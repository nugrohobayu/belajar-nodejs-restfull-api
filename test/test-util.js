import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt";

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test"
        }
    })
}
const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}


export {
    createTestUser,
    removeTestUser
}