import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <div className="image-container">
          <div className="image-wrapper">
            <Card.Img src={product.image} alt={product.name}  className="product-image" /> 
          </div>
        </div>
      </Link>

      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} Reviews`}
          />
        </Card.Text>

        <Card.Text as="h3">Rs {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
