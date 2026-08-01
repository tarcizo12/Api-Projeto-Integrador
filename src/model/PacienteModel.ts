import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize";

export class PacienteModel extends Model {
    public idPaciente!: number;
    public nome!: string;
    public Data_Nascimento!: Date;
    public cpf!: string;
    public email!: string;
    public senha!: string;
    public nomeDoResponsavel!: string;
    public telefone!: string;
    public fk_idProfissional!: number | null;
}

PacienteModel.init({
    idPaciente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Data_Nascimento: {
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
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nomeDoResponsavel: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    telefone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'Telefone',
        get() {
            const value = this.getDataValue('telefone');
            return value === null || value === undefined ? null : String(value);
        },
    },
    fk_idProfissional: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'Paciente',
    timestamps: false,  
    freezeTableName: true 
});
