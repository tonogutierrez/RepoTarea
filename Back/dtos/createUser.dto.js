class CreateUserDTO {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async validate() {
        const errors = {}; // Cambia array a objeto

        if (!this.name || this.name.trim() === '') {
            errors.name = "El nombre es obligatorio";
        } else if (this.name.length < 3 || this.name.length > 50) {
            errors.name = "El nombre debe tener entre 3 y 50 caracteres";
        }

        if (!this.email || this.email.trim() === '') {
            errors.email = "El email es obligatorio";
        } else if (!this.email.includes('@')) {
            errors.email = "El email no es válido";
        }

        if (!this.password || this.password.length < 4) {
            errors.password = "La contraseña debe tener al menos 4 caracteres";
        }

        return Object.keys(errors).length > 0 ? errors : null; // Retorna null si no hay errores
    }
}

module.exports = CreateUserDTO;
