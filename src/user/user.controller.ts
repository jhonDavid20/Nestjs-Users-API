import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'shared/validation.pipe';

@Controller()
export class UserController {
    constructor(private userService: UserService){}


    @Get('api/users')
    showAllUsers(){
        return this.userService.showAll();
    }
  
    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDTO){
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDTO){
        return this.userService.register(data);
    }
}
