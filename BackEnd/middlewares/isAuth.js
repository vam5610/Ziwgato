import jwt from "jsonwebtoken";

const isAuth= async(req,res,next)=>{
  
  try {
    const token= req.cookies?.token
    if(!token){
      return res.status(401).json({message:"Unauthorized"});
    }
    const decode= jwt.verify(token, process.env.JWT_SCRET); 
    if(!decode){
      return res.status(401).json({message:"Unauthorized"});
    }
    req.userId= decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({message:"Unauthorized", error: error.message})
  }
}

export default isAuth;