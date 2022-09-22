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

	create() {
		return "create"
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

	get(): Promise<User> {
		return this.usersRepository.findOneBy({ id: 1 });
	}
}
