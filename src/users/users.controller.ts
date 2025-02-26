import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Req, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {BaseController} from "../utils/baseController";
import { UsersService } from './users.service';
import { Roles } from 'src/guards/roles/roles.decorator';
import { UserRole } from 'src/model/role.enum';
import { GetAllUsersResponseExample, UserResponseExample } from 'src/utils/response.model';
import { User } from 'src/entities/users.entity';
import { RequestInterface } from 'src/model/auth.model';
import { UpdateBioDataDto } from './dto/bio-data.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController extends BaseController {
    constructor(private usersService: UsersService) {
        super();
    }

    @Get('all-users')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Displays all users in the system.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: GetAllUsersResponseExample
    })
    async getAllUsers(): Promise<User[]> {
        return await this.usersService.getAllUsers();
    }

    @Get('profile')
    @ApiOperation({ summary: 'Retrieves the profile of the logged-in user.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: UserResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'User ID not valid' }
    })
    async getProfile(@Req() req: RequestInterface): Promise<User | null> {
        return await this.usersService.getUserProfile(req.user);
    }

    @Patch('bio-data/:id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @ApiOperation({ summary: 'Updates the bio-data info of a user.' })
    @ApiBody({ type: UpdateBioDataDto, description: 'Update bio data' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: UserResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'User ID not valid' }
    })
    async updateBioData(
        @Param('id') id: string,
        @Body() updateBioDataDto: UpdateBioDataDto
    ): Promise<User> {
        return this.usersService.updateBioData(id, updateBioDataDto);
    }

    @Get('profile/:id')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Retrieves a user by ID.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: UserResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'Invalid user ID format.' }
    })
    async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
        return await this.usersService.getUserById(id);
    }

    @Delete(':id')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Deletes a user by ID' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 400, description: 'Bad Request', example: { message: 'Invalid user ID format.' } })
    async deleteUser(@Param('id') id: number) {
        return this.usersService.deleteUser(id);
    }
}
