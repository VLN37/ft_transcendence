import { Injectable } from "@nestjs/common"

@Injectable()
export class UsersService {
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

	get() {
		return "get"
	}
}
