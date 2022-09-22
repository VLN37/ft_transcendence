import { Controller, Get, Patch, Post, Put, Delete } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	create() {
		return this.usersService.create()
	}

	@Put()
	update() {
		return this.usersService.update()
	}

	@Patch()
	edit() {
		return this.usersService.edit()
	}

	@Delete()
	delete() {
		return this.usersService.delete()
	}

	@Get()
	get() {
		return this.usersService.get()
	}
}
