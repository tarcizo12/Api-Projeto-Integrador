import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize";

export class PacienteModel extends Model {
    public idPaciente!: number;
    public nome!: string;
    public dataNascimento!: Date;
    public cpf!: string;
    public email!: string;
    public nomeDoResponsavel!: string;
    public telefone!: string;
    public fkIdProfissional!: number;
}

PacienteModel.init({
    idPaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    dataNascimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    nomeDoResponsavel: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    fkIdProfissional: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Paciente',
});
