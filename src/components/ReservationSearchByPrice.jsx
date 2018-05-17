import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import reservations from '../reservations.json';
import Helpers from './Helpers';

export default class ReservationSearchByPrice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minPrice: (props.location.state && props.location.state.minPrice) || '',
      maxPrice: (props.location.state && props.location.state.maxPrice) || '',
      currency: (props.location.state && props.location.state.currency) || 'LOC',
      reservations: '',
      filteredReservations: '',
    }

    this.filterReservations = this.filterReservations.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      reservations,
    }, () => {
      const { minPrice, maxPrice, currency } = this.state;
      if (minPrice && maxPrice && currency) {
        document.getElementById('filter_button').click();
      }
    });
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {}
      });
    }
  }

  filterReservations(e) {
    if (e) {
      e.preventDefault();
    }

    let { reservations, filteredReservations, currency, minPrice, maxPrice } = this.state;
    filteredReservations = [];
    reservations.forEach((reservation) => {
      const arrivalDateString = reservation.arrivalDate;
      const arrivalDate = moment(arrivalDateString, 'DD/MM/YYYY').toDate();
      const currentDate = new Date();
      if (arrivalDate >= currentDate) {
        const priceName = 'price' + currency;
        const total = reservation.rooms.map(r => r[priceName]).reduce((accumulator, currentValue) => accumulator + currentValue);
        if (total >= minPrice && total <= maxPrice) {
          filteredReservations.push({ total, reservation });
        }
      }
    });

    this.setState({
      filteredReservations,
    })
  }

  handleChange(e) {
    let { minPrice, maxPrice, currency } = this.state;
    if (e.target.className.includes('min-price')) {
      minPrice = e.target.value;
    } else if (e.target.className.includes('max-price')) {
      maxPrice = e.target.value;
    } else if (e.target.className.includes('currency')) {
      currency = e.target.value;
    }
    this.setState({
      minPrice,
      maxPrice,
      currency,
    });
  }

  getReservations() {
    const { filteredReservations } = this.state;
    if (!filteredReservations) {
      return null;
    }

    const { currency, minPrice, maxPrice } = this.state;
    const priceName = 'price' + currency;

    return filteredReservations.map((filteredReservation, index) => {
      let totalCancellationFees = {};
      const reservation = filteredReservation.reservation;
      const arrivalDate = moment(reservation.arrivalDate, 'DD/MM/YYYY').toDate();
      let dates = [];
      reservation.rooms.forEach((room) => {
        room.cancellationFees.forEach((cancellationFee) => {
          dates.push(moment(cancellationFee.fromDate, 'DD/MM/YYYY').toDate());
        })
      });

      dates.sort((date1, date2) => {
        return date1 - date2;
      });
      dates = Helpers.uniqueArr(dates);
      for (let i = 0; i < dates.length; i++) {
        const currentDate = dates[i];
        reservation.rooms.forEach((room) => {
          const minDate = new Date(-8640000000000000);

          let hasSameDate = false;
          let closestDate = minDate;
          let currentFee;
          const daysDiff = Helpers.dateDiffInDays(arrivalDate, currentDate);

          for (let i = 0; i < room.cancellationFees.length; i++) {
            const fee = room.cancellationFees[i];
            const fromDate = moment(fee.fromDate, 'DD/MM/YYYY').toDate();
            if (currentDate.getTime() === fromDate.getTime()) {
              if (!totalCancellationFees[daysDiff]) {
                totalCancellationFees[daysDiff] = 0;
              }
              hasSameDate = true;
              totalCancellationFees[daysDiff] += fee[priceName];
              break;
            }
            if (fromDate.getTime() < currentDate.getTime() && closestDate.getTime() < fromDate.getTime()) {
              closestDate = fromDate;
              currentFee = fee;
            }
          }

          if (!hasSameDate && closestDate.getTime() - minDate.getTime() !== 0) {
            if (!totalCancellationFees[daysDiff]) {
              totalCancellationFees[daysDiff] = 0;
            }
            totalCancellationFees[daysDiff] += currentFee[priceName];
          }
        });
      }
      return (
        <div className={`reservation reservation-${index}`} key={index}>
          <div className="text">Reservation</div>
          <Button>
            <Link to={{
              pathname: `/reservations/details/${index}`,
              state: {
                priceName,
                filteredReservation,
                index,
                currency,
                totalCancellationFees,
                minPrice,
                maxPrice,
              }
            }}>Details</Link>
          </Button>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Filter reservations by prices</h1>
        <Row>
          <Col sm={3} />
          <Col sm={6}>
            <form>
              <FormGroup
                controlId="formBasicText"
              >
                <FormControl
                  type="number"
                  className="min-price"
                  value={this.state.minPrice}
                  placeholder="Min price"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup
                controlId="formBasicText"
              >
                <FormControl
                  type="number"
                  className="max-price"
                  value={this.state.maxPrice}
                  placeholder="Max price"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button className="back-button" bsStyle="primary" type="submit" id="filter_button" onClick={this.filterReservations}>Filter Button</Button>
            </form>
            <Row>
              <Col sm={3} />
              <Col sm={6}>
                <FormGroup controlId="formControlsSelect" className="currency-dropdown">
                  <ControlLabel className="select-label">Select currency</ControlLabel>
                  <FormControl
                    componentClass="select"
                    className="currency"
                    onChange={this.handleChange}
                    value={this.state.currency}
                  >
                    <option value="LOC">LOC</option>
                    <option value="EUR">EUR</option>
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={3} />
            </Row>
          </Col>
          <Col sm={3} />
        </Row>
        <section className="filtered-reservations">
          {this.getReservations()}
        </section>
      </div>
    )
  }
}