import { config } from "dotenv";
import mssql from "mssql";
import bcrypt from "bcrypt";
import dbConfig from "../config/db.js";

config(); // Cargar variables de entorno

//Usuarios de prueba
const seedUsers = [
  { email: "emma.thompson@example.com", fullName: "Emma Thompson", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/1.jpg" },
  { email: "olivia.miller@example.com", fullName: "Olivia Miller", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/2.jpg" },
  { email: "sophia.davis@example.com", fullName: "Sophia Davis", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/3.jpg" },
  { email: "ava.wilson@example.com", fullName: "Ava Wilson", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/4.jpg" },
  { email: "isabella.brown@example.com", fullName: "Isabella Brown", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/5.jpg" },
  { email: "mia.johnson@example.com", fullName: "Mia Johnson", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/6.jpg" },
  { email: "charlotte.williams@example.com", fullName: "Charlotte Williams", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/7.jpg" },
  { email: "amelia.garcia@example.com", fullName: "Amelia Garcia", password: "123456", profilePic: "https://randomuser.me/api/portraits/women/8.jpg" },

  // Male Users
  { email: "james.anderson@example.com", fullName: "James Anderson", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/1.jpg" },
  { email: "william.clark@example.com", fullName: "William Clark", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/2.jpg" },
  { email: "benjamin.taylor@example.com", fullName: "Benjamin Taylor", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/3.jpg" },
  { email: "lucas.moore@example.com", fullName: "Lucas Moore", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/4.jpg" },
  { email: "henry.jackson@example.com", fullName: "Henry Jackson", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/5.jpg" },
  { email: "alexander.martin@example.com", fullName: "Alexander Martin", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/6.jpg" },
  { email: "daniel.rodriguez@example.com", fullName: "Daniel Rodriguez", password: "123456", profilePic: "https://randomuser.me/api/portraits/men/7.jpg" },
];

const seedDatabase = async () =>{
    try{
        //Me conecto a la base de datos
        let pool = await mssql.connect(dbConfig);
        console.log("Conectado a la base de datos");

        //For para guardar los usuarios
        for(const user of seedUsers){
            const hashedPassword = await bcrypt.hash(user.password,10);

            await pool.request() //para guardar los usuarios en la base de datos
            .input("Name", mssql.NVarChar(100), user.fullName)
            .input("Email", mssql.NVarChar(255), user.email)
            .input("PasswordHash", mssql.NVarChar(255), hashedPassword)
            .input("ProfilePic", mssql.NVarChar(255), user.profilePic)
            .input("CreatedAt", mssql.DateTime, new Date())
            .query(`
            INSERT INTO Users (Name, Email, PasswordHash, CreatedAt) 
            VALUES (@Name, @Email, @PasswordHash, @CreatedAt)
            `);
        }
        console.log("Se guardaron los datos en la base de datos");
    }catch(error){
        console.error("❌ Error al poblar la base de datos:", error);
    }finally {
        mssql.close();
    }
};

// Ejecutar el seeding
seedDatabase();
