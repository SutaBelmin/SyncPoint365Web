import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { LiaUserCheckSolid, LiaUserTimesSolid } from "react-icons/lia";
import { usersService } from "../../services";
import { toast } from 'react-toastify';
import { Formik, Form } from "formik";

import './UsersList.css';

export const UsersStatusChange = ({ title, user, fetchData, closeModal }) => {
	const { t } = useTranslation();

	const changeStatus = async () => {
		try {
			await usersService.updateUserStatus(user.id);
			fetchData();
			toast.success(t('UPDATED'));
			closeModal();
		} catch (error) {
			toast.error(t('FAIL_UPDATE'));
		}
	}
	return (
		<Formik
			initialValues={{ id: user.id }}
			onSubmit={changeStatus}
			on
		>
			<Form>

				<div className="user_status p-6">

					{user.isActive !== true && (
						<h1 className="flex justify-center items-center text-5xl font-bold"><LiaUserCheckSolid className="text-green-600" /></h1>
					)}
					{user.isActive === true && (
						<h1 className="flex justify-center items-center text-5xl font-bold"><LiaUserTimesSolid className="text-red-600" /></h1>
					)}
					<div>
						<h1 className="flex justify-center items-center text-3xl font-semibold text-gray-900 text-center">
							{title}
						</h1>					
					</div>
					<div className="flex justify-center gap-8">
						<div>
							<div className="flex justify-center items-center gap-4 pt-6 pb-6">
								<span className="text-gray-900 font-bold text-2xl">{`${user.firstName} ${user.lastName}`}</span>
							</div>
							<div className="flex flex-row items-center">
							<span className="text-gray-600 pr-3"><FontAwesomeIcon icon={faEnvelope} className="pr-1" /> {user.email}</span>
							<span className="text-gray-600 pr-3"><FontAwesomeIcon icon={faBriefcase} className="pr-1" /> {user.role}</span>
							</div>
						</div>
					</div>
					<div className="flex justify-end pt-8 space-x-2">
						<button
							type="button"
							onClick={closeModal}
							className="btn-cancel"
						>
							{t('CANCEL')}
						</button>
						<button
							type="submit"
							className="btn-save"
						>
							{t('SAVE')}
						</button>
					</div>
				</div >
			</Form>
		</Formik>
	);

};  
