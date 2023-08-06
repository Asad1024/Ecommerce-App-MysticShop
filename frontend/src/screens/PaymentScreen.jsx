import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";
import Meta from "../components/Meta";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if(!shippingAddress){
        navigate("/shipping")
    }
  }, [shippingAddress, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate("/placeOrder")
  }

  return (
    <>
    <Meta title="Payment" />
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Form.Check
            type="radio"
            className="my-2"
            label="Paypal or Credit Card"
            id="Paypal"
            checked
            name="paymentMethod"
            value="Paypal"
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
    </>
  );
};

export default PaymentScreen;
