import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productApiSlice";
import {toast} from "react-toastify"
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import Meta from  "../../components/Meta";

const ProductListScreen = () => {

  const {pageNumber} = useParams()

  const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

  const [ createProduct , {isLoading : loadingCreate}] = useCreateProductMutation()

  const [deleteProduct, {isLoading : loadingDelete}] = useDeleteProductMutation()

  const deleteHandler = async (id) => {
    if(window.confirm('Are you sure?')){
      try {
        await deleteProduct(id)
        refetch()
        toast.success('Product deleted')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const createProductHandler = async() => {
    if(window.confirm('Are you sure you want to create a new product')){
       try {
        await createProduct()
        refetch()
       } catch (err) {
        toast.error(err?.data?.message || err.error)
       }
    }
  }
  
  return (
    <>
       <Meta title="Products List" />
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader/>}
      {loadingDelete && <Loader/>}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>Rs {product.price}</td>
                <td>{product.category}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button className="btn-sm mx-2" variant="light">
                     <FaEdit/>
                    </Button>
                  </LinkContainer>
                  <Button className="btn-sm" variant="danger" onClick={() => deleteHandler(product._id)}>
                     <FaTrash style={{ color : 'white'}}/>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate
        pages={data.pages}
        page={data.page}
        isAdmin={true}
      />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
