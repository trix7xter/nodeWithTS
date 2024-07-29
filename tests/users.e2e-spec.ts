import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users E2E', () => {
	it('Register-error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test', password: 'test' });
		expect(res.status).toBe(422);
	});

	it('Register-success', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@mail.ru', password: 'test', name: 'test' });
		expect(res.status).toBe(201);
	});

	it('Login-success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@mail.ru', password: 'test' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login-error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@mail.ru', password: '1234' });
		expect(res.status).toBe(401);
	});

	it('Info-success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@mail.ru', password: 'test' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', 'Bearer ' + login.body.jwt);
		expect(res.body.email).toBe('test@mail.ru');
	});

	it('Info-error', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', 'Bearer ' + '1234');
		expect(res.status).toBe(401);
	});
});

afterAll(async () => {
	application.close();
});
