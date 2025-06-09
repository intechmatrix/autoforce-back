import bcrypt from "bcryptjs";

export let hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err){
        return 400;
    }
};

export let comparePassword = async (password, hashedPassword) => {
    try {
        let isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
        
    } catch (err) {
        return false;
    }
};


























