import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components/layout';

import Home from '../pages/home';
import Login from '../pages/login';
import { UsersList } from '../pages/users';
import { CountriesList } from '../pages/countries';
import CitiesList from '../pages/cities/CitiesList';
import { AbsenceRequestTypesList } from '../pages/absence-request-types';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/absenceRequestTypes" element={<AbsenceRequestTypesList />} />
          <Route path="/countries" element={<CountriesList />} />
          <Route path="/cities" element={<CitiesList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;