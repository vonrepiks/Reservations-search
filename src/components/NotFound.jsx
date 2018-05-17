import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Button, } from 'react-bootstrap';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="container">
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <section className="not-found">
              <div className="not-found-page-image" />
              <Button className="back-button" bsStyle="primary">
                <Link to={'/reservations/search'}>Go to home page</Link>
              </Button>
            </section>
          </Col>
          <Col sm={2} />
        </Row>
      </div>
    )
  }
}