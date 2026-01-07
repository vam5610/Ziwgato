import jwt from 'jsonwebtoken';


const genToken= async(userId)=>{
  try {
    const token= jwt.sign({userId},process.env.JWT_SCRET,{expiresIn:'7d'})
    return token;
  } catch (error) {
    console.log("Error while generating token",error);
  }
}

export default genToken;