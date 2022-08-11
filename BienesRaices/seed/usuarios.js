import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Laura',
        apellido: 'Zapata',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios;