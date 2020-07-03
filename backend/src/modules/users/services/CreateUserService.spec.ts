import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
	beforeEach(() => {
		fakeCacheProvider = new FakeCacheProvider();
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUserService = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
			fakeCacheProvider
		);
	});

	it('should be able to create a new user', async () => {
		const user = await createUserService.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@hotmail.com',
			password: '123456',
		});

		expect(user).toHaveProperty('id');
	});

	it('should not be able to create a new user with same email from another user', async () => {
		await createUserService.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@hotmail.com',
			password: '123456',
		});

		await expect(
			createUserService.execute({
				name: 'Jhon Doe',
				email: 'jhondoe@hotmail.com',
				password: '123456',
			})
		).rejects.toBeInstanceOf(AppError);
	});
});
