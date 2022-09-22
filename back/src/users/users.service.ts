import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../entities/user.entity"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) { }

	create(user: User) {
        const newUser = this.usersRepository.save(user)
		return newUser
	}

	update() {
		return "update"
	}

	edit() {
		return "edit"
	}

	delete() {
		return "delete"
	}

	get(): Promise<User[]> {
		const users = this.usersRepository.find();
        return users
	}
}
