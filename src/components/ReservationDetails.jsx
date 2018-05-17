import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Helpers from './Helpers';

export default class ReservationDetails extends React.Component {

  componentDidMount() {
    const heightString = window.getComputedStyle(document.getElementsByClassName('details-content')[0]).height;
    const height = Number(heightString.replace('px', ''));
    document.getElementsByClassName('details-background')[0].style.height = height + 40 + 'px';
  }

  getFees() {
    const { filteredReservation, currency, totalCancellationFees } =
      this.props.location.state;
    const arrivalDateString = filteredReservation.reservation.arrivalDate;
    const arrivalDate = moment(arrivalDateString, 'DD/MM/YYYY').toDate();
    const currentDate = new Date();
    const diffDays = Helpers.dateDiffInDays(arrivalDate, currentDate)

    let hasValidCancellationFee = false;
    const cancellationFees = Object.keys(totalCancellationFees).map((cancellationFeeDays, index) => {
      if (diffDays >= cancellationFeeDays) {
        hasValidCancellationFee = true;
        return (
          <li key={index}>{`${cancellationFeeDays} days before ${arrivalDateString}: ${totalCancellationFees[cancellationFeeDays]} ${currency} cancellation fee`}</li>
        )
      }
      return null;
    })

    if (!hasValidCancellationFee || Object.keys(totalCancellationFees).length === 0) {
      return <div>No available cancelations fees</div>;
    }

    return cancellationFees;
  }

  render() {
    const { index, filteredReservation, currency, minPrice, maxPrice } = this.props.location.state;

    return (
      <div className="container">
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <h1>Reservation details</h1>
            <section className={`details reservation-details-${index}`}>
              <div className="details-background" />
              <div className="details-content">
                <div className="total-price">{`Total price of all rooms: ${filteredReservation.total} ${currency}`}</div>
                <div>
                  <h3>Cancellation Policy</h3>
                  <ul className="fees">
                    {this.getFees()}
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
}