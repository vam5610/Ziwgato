import Shop from "../models/shop.model.js";
import uploadCloudinaryImage from "../utils/cloudinary.js";
import Item from "../models/item.model.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType } = req.body;

    const price = Array.isArray(req.body.price)
      ? Number(req.body.price[0])
      : Number(req.body.price);

    let image;
    if (req.file) {
      image = await uploadCloudinaryImage(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items owner");

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const editItem=async()=>{
  try {
    const {itemId}= req.params.itemId;
    const {name,category,foodType,price}= req.body;
    let image;
    if(req.file){
      image= await uploadCloudinaryImage(req.file.path);
    }
    const item= await Item.findByIdAndUpdate(itemId,{
      name,category,foodType,price,image
    },{new:true})

    if(!item){
      return res.status(400).json({message:"Item not found"})
    }
    return res.status(200).json(item)

  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}


export const getItemById= async(req,res)=>{
  try {
    const {itemId}= req.params.itemId;
    const  item= await Item.findById(itemId);
    if(!item){
      return res.status(400).json({message:"Item not found"})
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}