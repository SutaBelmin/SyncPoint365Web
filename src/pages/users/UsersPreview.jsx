import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatPhoneNumber } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import './UsersList.css';
import { usersService } from "../../services";
import { defaultUserImage } from "../../assets/images";
import { toast } from "react-toastify";

export const UsersPreview = ({ user, closeModal }) => {
	const [profilePicture, setProfilePicture] = useState(null);
	const [, setUser] = useState(null);
	const { t } = useTranslation();

	const fetchUser = useCallback(async () => {
		try {
			const response = await usersService.getById(user.id);
			setUser(response.data);

			const userImage = response.data.imageContent
				? `data:image/jpeg;base64,${response.data.imageContent}`
				: defaultUserImage;
			setProfilePicture(userImage);

		} catch (error) {
			toast.error(t('ERROR_LOADING_USER'));
		}
	}, [user.id, t]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);


	return (
		<div className="p-6">
			<h1 className="flex justify-center items-center mb-4 text-3xl font-semibold text-gray-900">{t('USER_PREVIEW')}</h1>
			<div className="flex flex-col gap-8">
				<div className="grid grid-cols-2 border-b border-gray-300 gap-y-2">
					<div className="flex justify-center mb-4 mt-4">
						<div className="w-[150px] h-[150px] rounded-full mb-4 mt-4 border-4 border-gray-300 overflow-hidden">
							<img
								src={profilePicture}
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-3 pb-4">
						<div className="flex gap-4 pt-16  ml-auto">
							<span className="text-gray-900 font-semibold text-2xl ml:auto">{`${user.firstName} ${user.lastName}`}</span>
						</div>
						<div className="flex gap-4 ml-auto">
							<span className="text-gray-600"><FontAwesomeIcon icon={faEnvelope} className="pr-1" /> {user.email}</span>
						</div>
						<div className="flex gap-4 ml-auto">
							<span className="text-gray-600"><FontAwesomeIcon icon={faPhone} className="pr-2" />
								{formatPhoneNumber(user.phone)}</span>
						</div>
					</div>
				</div>
				<div>
					<div className="grid grid-cols-2 gap-2">
						<div className="flex flex-col">
							<span className="font-medium text-gray-600">{t('BIRTH_DATE')}:</span>
							<span className="text-gray-800 tabular-nums">{format(new Date(user.birthDate), t('DATE_FORMAT'))}</span>
						</div>
						<div className="flex flex-col ml-auto">
							<span className="font-medium text-gray-600 ml-auto">{t('ADDRESS')}:</span>
							<span className="text-gray-600">{`${user.address}, ${user.cityName}`}</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="pt-4">
							<span className="font-medium text-gray-600 pr-1">{t('ROLE')}:</span>
							<span className="text-gray-600">{user.role}</span>
						</div>
						<div className="pt-4 ml-auto">
							<span className="font-medium text-gray-600 pr-1">{t('STATUS')}:</span>
							<span className="text-gray-600">{user.isActive ? t('ACTIVE') : t('INACTIVE')}</span>
						</div>
					</div>
				</div>
			</div>
			<button
				type="button"
				onClick={closeModal}
				className="mt-8 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200"
			>
				{t('CLOSE')}
			</button>
		</div >
	);

};  
