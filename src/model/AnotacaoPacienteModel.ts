import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize"; // Importe sua conexão com o banco

export class AnotacaoPacienteModel extends Model {
    public idAnotacao!: number;
    public descricao!: string;
    public dhRegistro!: Date;
    public fk_idPaciente!: number;
}

AnotacaoPacienteModel.init({
    idAnotacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dhRegistro: {
        type: DataTypes.DATE,
        allowNull: true,
        field: `DH_Registro`
    },
    fk_idPaciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Anotacao_Paciente',
    timestamps: false,  // Adicione esta linha,
});
