import 'reflect-metadata';
import { Container } from 'inversify';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IConfigService } from '../config/config.service.interface';
import { UsersService } from './users.service';
import { TYPES } from '../types';
import { User } from './users.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUsersService>(TYPES.UsersService);
});

describe('UserService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		const createdUser = await usersService.createUser({
			email: 'test@mail.ru',
			name: 'test',
			password: 'test',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		const createdUser = await usersService.createUser({
			email: 'test@mail.ru',
			name: 'test',
			password: 'test',
		});

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'test@mail.ru',
			password: 'test',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		const createdUser = await usersService.createUser({
			email: 'test@mail.ru',
			name: 'test',
			password: 'test',
		});

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'test@mail.ru',
			password: '1234',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'test@mail.ru',
			password: '1234',
		});

		expect(res).toBeFalsy();
	});
});
