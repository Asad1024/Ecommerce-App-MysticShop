import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModels.js";

const addOrderItems = asyncHandler( async (req,res) => {
   const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
   } = req.body

   if(orderItems && orderItems.length === 0){
    res.status(400)
    throw new Error('No order items')
   }else{
    const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product : x._id,
            _id : undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    })
    const createOrder = await order.save()
    res.status(201).json(createOrder)
   }
})

const getMyOrders = asyncHandler( async (req,res) => {
    const orders = await Order.find({user : req.user._id})
    res.status(200).json(orders)
})

const getOrderById = asyncHandler( async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(order){
        res.status(200).json(order)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
})

const updateOrderToPaid = asyncHandler( async (req,res) => {
    const order = await Order.findById(req.params.id)
    if(order){
        order.isPaid = true,
        order.paidAt = Date.now(),
        order.paymentResult = {
            id : req.body.id,
            status : req.body.status,
            update_time : req.body.update_time,
            email_address : req.body.email_address
        }
        const updateOrder = await order.save()
        res.status(200).json(updateOrder)
    }else{
        res,status(404)
        throw new Error('Order not found')
    }
})

const updateOrderToDelivered = asyncHandler( async (req,res) => {
    const order = await Order.findById(req.params.id)
    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updateOrder = await order.save()
        res.status(200).json(updateOrder)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
})

const getOrders = asyncHandler( async (req,res) => {
   const orders = await Order.find({}).populate('user', 'id name')
   res.status(200).json(orders)
})

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrders
}
