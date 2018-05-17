import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default (props) => {
  const { index, filteredReservation, currency, totalCancellationFees, minPrice, maxPrice } = props.location.state;
  const arrivalDateString = filteredReservation.reservation.arrivalDate;
  const arrivalDate = moment(arrivalDateString, 'DD/MM/YYYY').toDate();
  const currentDate = new Date();
  const timeDiff = Math.abs(arrivalDate.getTime() - currentDate.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <div className="container">
      <Row>
        <Col sm={2} />
        <Col sm={8}>
          <h1>Reservation details</h1>
          <section className={`details reservation-details-${index}`}>
            <div className="details-background" />
            <div className="details-content">
              <div className="total-price">{`Total price of all rooms: ${filteredReservation.total} ${currency }`}</div>
              <div>
                <h3>Cancellation Policy</h3>                    
                <ul className="fees">
                  {diffDays >= 30 ? <li>{`30 days before ${arrivalDateString}: ${totalCancellationFees[0]} ${currency} cancellation fee`}</li> : null}
                  {diffDays >= 10 ? <li>{`10 days before ${arrivalDateString}: ${totalCancellationFees[1]} ${currency} cancellation fee`}</li> : null}
                  {diffDays >= 6 ? <li>{`6 days before ${arrivalDateString}: ${totalCancellationFees[2]} ${currency} cancellation fee`}</li> : null}
                  {diffDays >= 1 ? <li>{`1 days before ${arrivalDateString}: ${totalCancellationFees[3]} ${currency} cancellation fee`}</li> : null}
                </ul>
              </div>
            </div>
          </section>
          <Button className="back-button" bsStyle="primary">
            <Link to={{
              pathname: '/reservations/search',
              state: {
                currency,
                minPrice,
                maxPrice,
              }
            }}>Back to list</Link>
          </Button>
        </Col>
        <Col sm={2} />
      </Row>
    </div>
  );
}