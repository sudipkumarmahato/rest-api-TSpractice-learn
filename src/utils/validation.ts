
interface validParams {
    email: string,
    password: string,
    username: string,
    name: string
}


export const validateEmail = (params: validParams) => {
    const { email } = params;
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
}

export const validatePassword = (params: validParams) => {
    const { password } = params;
    return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/)
}

export const validateUsername = (params: validParams) => {
    const { username } = params;

    return String(username).match(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/)
}

export const validateName = (params: validParams) => {
    const { name } = params;
    return String(name).match(/^[A-Z][a-zA-Z]{3,}(?: [A-Z][a-zA-Z]*){0,2}$/)
}