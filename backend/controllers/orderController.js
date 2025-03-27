import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//placing user order from frontend

const placeOrder =async(req,res)=>{
    const frontend_url="http://localhost:5174";
try{
  const newOrder=new orderModel({
    userId:req.body.userId,
    items:req.body.items,
    amount:req.body.amount,
    address:req.body.address

  })
  await newOrder.save();
  await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});


  const line_items=req.body.items.map((item)=>({
    price_data:{
        currency:"aud",
        product_data:{
            name:item.name
        },
        unit_amount:item.price*100
    },
    quantity:item.quantity

  }))


  line_items.push({
    price_data:{
        currency:"aud",
        product_data:{
            name:"Delivery Charges"
        },
        unit_amount:200
    },
    quantity:1
  })

  const session=await stripe.checkout.sessions.create({
    line_items:line_items,
    mode:"payment",
    success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
  })

  res.json({success:true,session_url:session.url})
}
catch(error){
console.log(error);
res.json({success:false,message:"Error"})

}
}

const verifyOrder= async (req,res)=>{
const {orderId,success}=req.body;
try{
  if(success=="true") {
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,message:"Paid"})
  }
  else {
    await orderModel.findByIdAndDelete(orderId);
    res.json({success:false,message:"Not paid"})
  }

} catch(error) {
  console.log(error);
  res.json({success:false,message:"Error"})
  
}
}

// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;

//   try {
//       console.log("Received Order ID:", orderId);
//       console.log("Payment Success:", success);

//       if (!orderId) {
//           return res.status(400).json({ success: false, message: "Order ID is missing" });
//       }

//       if (success === "true") {
//           const updatedOrder = await orderModel.findByIdAndUpdate(
//               orderId,
//               { payment: true, status: "Payment Successful" },
//               { new: true }
//           );

//           if (!updatedOrder) {
//               return res.status(404).json({ success: false, message: "Order not found" });
//           }

//           return res.status(200).json({ success: true, message: "Payment verified", order: updatedOrder });
//       } else {
//           await orderModel.findByIdAndDelete(orderId);
//           return res.status(400).json({ success: false, message: "Payment failed, order deleted" });
//       }
//   } catch (error) {
//       console.error("Error verifying payment:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//   }
// };

//user orders for fronted
 const userOrders =async(req,res)=>{
try{
const orders =await orderModel.find({userId:req.body.userId});
res.json({success:true,data:orders})
}catch(error) {
console.log(error);
res.json({success:false,message:"error"})

}
 }

 //listing orders for admin panel

 const listOrders=async(req,res)=>{
try{
  const orders=await orderModel.find({});
  res.json({success:true,data:orders})

}catch(error){
  console.log(error);
  res.json({success:false,message:"error"})
  

}
 }

 //api for updating order status
 const updateStatus=async(req,res)=>{
try{
await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
res.json({success:true,message:"status updated"})
}catch(error){
  console.log(error);
  res.json({success:false,message:"Error"})
  
}
 }
export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}