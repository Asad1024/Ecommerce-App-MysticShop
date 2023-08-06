import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams, Link } from "react-router-dom";
import Paginate from "../components/Paginate";
import { BiArrowBack } from "react-icons/bi";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta"

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? <ProductCarousel/> : (
        <Link className="btn btn-dark mb-4" to="/">
          <BiArrowBack style={{color : 'white'}} />
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title="MysticShop"/>
          <h1>Latest Products</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
