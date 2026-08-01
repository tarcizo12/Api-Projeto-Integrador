import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize"; // Importe sua conexão com o banco

export class AnotacaoPacienteModel extends Model {
    public idAnotacao!: number;
    public descricao!: string;
    public dhRegistro!: Date;
    public _fk_idPaciente!: number;
    public fk_idPaciente!: number;
    public titulo!: string;
    public emocaoEstimada!: string;
    public isVisualizada!: boolean;
}

AnotacaoPacienteModel.init({
    idAnotacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'Descricao',
    },
    emocaoEstimada: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dhRegistro: {
        type: DataTypes.DATE,
        allowNull: false,
        field: `DH_Registro`
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: `Titulo`
    },
    isVisualizada: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    fk_idPaciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Anotacao_Paciente',
    timestamps: false,  
    freezeTableName: true 
});
