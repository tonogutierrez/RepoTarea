class UpdateUserDTO {
    constructor({ id, name, email }) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    async validate() {
        const errors = {};

        // Validar ID
        if (!this.id) {
            errors.id = "El ID es obligatorio";
        } else if (isNaN(this.id)) {
            errors.id = "El ID debe ser un número válido";
        }

        // Validar nombre
        if (!this.name || this.name.trim() === "") {
            errors.name = "El nombre es obligatorio";
        } else if (this.name.length < 3 || this.name.length > 50) {
            errors.name = "El nombre debe tener entre 3 y 50 caracteres";
        }

        // Validar Email
        if (this.email && !this.email.includes("@")) {
            errors.email = "El email no es válido";
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }
}

module.exports = UpdateUserDTO;
