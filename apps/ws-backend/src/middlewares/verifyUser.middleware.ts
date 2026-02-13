import jwt from "jsonwebtoken"

function verifyUser(token: string) : string | null  {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "123123")
        if(typeof decoded == "string") {
            return null;
        }

        if(!decoded || (!decoded.userId && !decoded.id)) {
            return null
        }

        return decoded.userId || decoded.id;
    } catch (error) {
        return null
    }
}

export {verifyUser}