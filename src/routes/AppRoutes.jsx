import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import Home from '../pages/home';
import { Login } from '../pages/login';
import { UsersAdd, UsersEdit, UsersList } from '../pages/users';
import { CountriesList } from '../pages/countries';
import { AbsenceRequestTypesList } from '../pages/absence-request-types';
import { CitiesList } from '../pages/cities';
import { NotFound } from '../pages/errors';
import { AbsenceRequestsList, AbsenceRequestsListEmployeeView } from '../pages/absence-requests';
import PrivateRoutes from '../routes/PrivateRoutes';
import { useAuth } from '../context/AuthProvider';
import { roleConstant } from '../constants';
import { CompanyDocumentsList } from '../pages/company-documents';

const AppRoutes = () => {
	const { userHasRole } = useAuth();
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route element={<PrivateRoutes><MainLayout /></PrivateRoutes>}>
				<Route path="/home" element={<Home />} />
				<Route path="/absence-requests-user" element={<AbsenceRequestsListEmployeeView />} />
				<Route path="/company-documents" element={<CompanyDocumentsList />} />
				{!userHasRole(roleConstant.employee) && (
					<>
						<Route path="/users">
							<Route index element={<UsersList />} />
							<Route path="add" element={<UsersAdd />} />
						</Route>
						<Route path="/absence-request-types" element={<AbsenceRequestTypesList />} />
						<Route path="/absence-requests" element={<AbsenceRequestsList />} />
						<Route path="/countries" element={<CountriesList />} />
						<Route path="/cities" element={<CitiesList />} />
						<Route path="/users/update/:userId" element={<UsersEdit />} />
					</>
				)}
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;