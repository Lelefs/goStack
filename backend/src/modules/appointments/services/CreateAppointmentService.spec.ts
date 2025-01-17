import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeNotificationsRepository = new FakeNotificationsRepository();
		fakeCacheProvider = new FakeCacheProvider();
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		createAppointmentService = new CreateAppointmentService(
			fakeAppointmentsRepository,
			fakeNotificationsRepository,
			fakeCacheProvider
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appointment = await createAppointmentService.execute({
			date: new Date(2020, 4, 10, 13),
			user_id: '123123',
			provider_id: '123123123',
		});

		expect(appointment).toHaveProperty('id');
		expect(appointment.provider_id).toBe('123123123');
	});

	it('should not be able to create two appointments on the same time', async () => {
		const appointmentDate = new Date(2020, 5, 10, 11);

		await createAppointmentService.execute({
			date: appointmentDate,
			user_id: '123123',
			provider_id: '123123123',
		});

		await expect(
			createAppointmentService.execute({
				date: appointmentDate,
				user_id: '123123',
				provider_id: '123123123',
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 10, 11),
				user_id: '123123',
				provider_id: '123123123',
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 10, 13),
				user_id: 'user-id',
				provider_id: 'user-id',
			})
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment befor 8am and after 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 11, 7),
				user_id: 'user-id',
				provider_id: 'provider-id',
			})
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointmentService.execute({
				date: new Date(2020, 4, 11, 18),
				user_id: 'user-id',
				provider_id: 'provider-id',
			})
		).rejects.toBeInstanceOf(AppError);
	});
});
