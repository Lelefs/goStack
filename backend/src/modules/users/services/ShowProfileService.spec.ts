import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();

		showProfile = new ShowProfileService(fakeUsersRepository);
	});

	it('should be able to show the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Jhon Doe',
			email: 'jhondoe@hotmail.com',
			password: '123456',
		});

		const profile = await showProfile.execute({
			user_id: user.id,
		});

		expect(profile.name).toBe('Jhon Doe');
		expect(profile.email).toBe('jhondoe@hotmail.com');
	});

	it('should not be able to show the profile from non-existing user', async () => {
		expect(
			showProfile.execute({
				user_id: 'non-existing-user-id',
			})
		).rejects.toBeInstanceOf(AppError);
	});
});
