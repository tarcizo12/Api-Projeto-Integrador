import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize"; // Importe sua conexão com o banco

export class PsicologoModel extends Model {
    public idProfissional!: number;
    public nome!: string;
    public cpf!: string;
    public crp!: string;
    public email!: string;
    public senha!: string;
}

PsicologoModel.init({
    idProfissional: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
    },
    crp: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Psicologo',
    timestamps: false,  
    freezeTableName: true
});
