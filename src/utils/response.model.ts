export const UserResponseExample = {
    message: 'Success',
    data: {
        user: {
            id: 1,
            name: 'George Asiedu',
            email: 'george.asiedu@gmail.com',
            role: 'admin',
            isVerified: false
        }
    }
}

export const RegisterResponseExample = {
    message: 'Success',
    data: {
        user: {
            id: 1,
            name: 'George Asiedu',
            email: 'george.asiedu@gmail.com',
            role: 'admin',
            isVerified: false
        },
        token: 'block token'
    }
}

export const LoginResponseExample = {
    message: 'Success',
    data: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
            email: 'george.asiedu@gmail.com',
            name: 'George Asiedu',
            role: 'Admin',
            isVerified: true
        }
    }
}

export const GetAllUsersResponseExample = {
    message: 'Success',
    data: [
        {
            id: 1,
            name: 'George Asiedu',
            email: 'george.asiedu@gmail.com',
            role: 'admin',
            refreshToken: null,
            isVerified: true
        }
    ]
}

export const BadRequestExample = [
    'name should not be empty',
    'email must be an email',
    'password must be at least 8 characters long'
]

export const LoginBadRequestExample = [
    'email must be an email',
    'password must be at least 8 characters long'
]