import React, {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Button, Row, Col, ListGroup, Card, Image} from "react-bootstrap"
import {useSelector} from "react-redux"
import CheckoutSteps from "../components/CheckoutSteps"
import {toast} from "react-toastify"
import Loader from "../components/Loader"
import Message from "../components/Message"
import {useCreateOrderMutation} from "../slices/ordersApiSlice"
import {clearCartItems} from "../slices/cartSlice"
import { useDispatch } from 'react-redux'
import Meta from "../components/Meta";

const PlaceOrderScreen = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart)

    const [ createOrder , {isLoading, error}] = useCreateOrderMutation()

    useEffect(()=>{
        if(!cart.shippingAddress.address){
            navigate("/shipping")
        }else if(!cart.paymentMethod){
            navigate("/payment")
        }
    },[cart.shippingAddress.address, cart.paymentMethod, navigate])

    const placeOrderHandler = async () => {
       try {
        const res = await createOrder({
            orderItems : cart.cartItems,
            shippingAddress : cart.shippingAddress,
            paymentMethod : cart.paymentMethod,
            itemsPrice : cart.itemsPrice,
            shippingPrice : cart.shippingPrice,
            taxPrice : cart.taxPrice,
            totalPrice : cart.totalPrice
        }).unwrap()
        dispatch(clearCartItems())
        navigate(`/order/${res._id}`)
       } catch (error) {
        toast.error(error)
       }
    }
  return (
    <>
    <Meta title="Place Order" />
    <CheckoutSteps step1 step2 step3 step4/>
    <Row>
        <Col md={8}>
            <ListGroup varinat="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                    <strong>Address:</strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {" "}{cart.shippingAddress.country}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Item</h2>
                {cart.cartItems.length === 0 ? (
                    <Message>Your cart is empty</Message>
                ) : (
                    <ListGroup variant='fluid'>
                        {cart.cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image
                                        src={item.image}
                                        alt={item.name}
                                        rounded
                                        fluid
                                        />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} × {item.price} = Rs {item.qty * item.price}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items:</Col>
                            <Col>Rs {cart.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping:</Col>
                            <Col>Rs {cart.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax:</Col>
                            <Col>Rs {cart.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total:</Col>
                            <Col>Rs {cart.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        {error && <Message variant="danger">{error}</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button
                        type="button"
                        className='btn-block'
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                        >Place Order
                        </Button>
                        {isLoading && <Loader/>}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
    </>
  )
}

export default PlaceOrderScreen