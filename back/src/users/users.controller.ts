import { Controller, Param, Body, Get, Patch, Post, Put, Delete } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Post()
	create(@Body() user: any) {
		return this.usersService.create(user)
	}

	@Patch(':id')
	edit(@Param('id') id: any, @Body() user: any) {
		return this.usersService.edit(id, user)
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
