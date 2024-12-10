import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components/layout';

import Home from '../pages/home';
import { Login } from '../pages/login';
import { UsersAdd, UsersList } from '../pages/users';
import { CountriesList } from '../pages/countries';
import { AbsenceRequestTypesList } from '../pages/absence-request-types';
import { CitiesList } from '../pages/cities';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users">
            <Route index element={<UsersList />} />
            <Route path="add" element={<UsersAdd />} />
          </Route>
          <Route path="/absenceRequestTypes" element={<AbsenceRequestTypesList />} />
          <Route path="/countries" element={<CountriesList />} />
          <Route path="/cities" element={<CitiesList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;