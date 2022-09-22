import { Controller, Body, Get, Patch, Post, Put, Delete } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	create(@Body() user: any) {
		return this.usersService.create(user)
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
