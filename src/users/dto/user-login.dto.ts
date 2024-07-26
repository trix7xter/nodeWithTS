import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;

	@IsString()
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}
}
