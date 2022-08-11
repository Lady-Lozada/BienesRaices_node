import jwt from'jsonwebtoken'

const generarJWT = datos => {
    return jwt.sign({
        nombre: datos.name,
        id: datos.id
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarJWT,
    generarId
}