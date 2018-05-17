import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import ReservationSearchByPrice from './components/ReservationSearchByPrice';
import ReservationDetails from './components/ReservationDetails';

const Routes = () => (
  <main>
    <Switch>
      <Route exact path="/" component={ReservationSearchByPrice} />
      <Route path="/reservations/search" component={ReservationSearchByPrice} />
      <Route path="/reservations/details/:index" component={ReservationDetails} />
      <Route path="*" component={NotFound} />
    </Switch>
  </main>
);

export default Routes;
