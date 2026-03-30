import User from "../models/user.model.js"

export const socketHandler=(io)=>{
  io.on('connection',(socket)=>{
    console.log("✅ Connected:", socket.id);
    socket.on('identity',async({userId})=>{
      console.log("🆔 Identity received:", userId, socket.id);
      try {
        const user= await User.findByIdAndUpdate(userId,{
          socketId:socket.id,isOnline:true 
        },{new:true})
      } catch (error) {
        console.log(error)
      }
    })

    socket.on("updateLocation",async ({latitude,longitude,userId})=>{
      try {
        const user =await User.findByIdAndUpdate(userId,{
          location:{
            type:"Point",
            coordinates:[longitude,latitude]
          },
          isOnline:true,
          socketId:socket.id
        })
        if(user){
          io.emit("locationUpdated",{
            deliveryBoyId: userId,
            latitude,
            longitude
          })
        }
      } catch (error) {
        return console.log("Error updating location",error)
      }
    })

    socket.on("disconnect",async()=>{
      try {
        await User.findOneAndUpdate({socketId:socket.id},{
        socketId:null,isOnline:false
      })
      } catch (error) {
        console.log(error)
      }
    })
  })
}