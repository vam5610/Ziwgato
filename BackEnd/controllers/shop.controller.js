import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, address, city, state } = req.body;
    let image;
    if (req.file) {
      console.log("images files",req.file)
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      shop = Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      shop = Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: req.userId,
        },
        { new: true }
      );
    }
    
    await shop.populate("owner items");
    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyShop=async(req,res)=>{
  try {
    const shop =await Shop.findOne({owner: req.userId}).populate("owner").populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });
    if(!shop){
      return res.status(404).json({message:"Shop not found"});
    } 
    return res.status(200).json({shop});
  } catch (error) {
    return res.status(500).json({message:`getMyShop error ${error.message}`});
  }
}



export const getShopByCity =async(req,res)=>{
  try {
    const {city}= req.params;
    const shop= await Shop.find({
      city: {$regex: new RegExp(`^${city}$`,"i")}
    }).populate("items")
    if(!shop){
      return res.status(404).json({message:"No shop found in this city"});
    }

    return res.status(200).json({shop});

  } catch (error) {
    return res.status(500).json({message:`getShopByCity error ${error.message}`});
  }
}