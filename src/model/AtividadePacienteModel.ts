import { Model, DataTypes } from 'sequelize';
import sequelize from "../db/sequelize"; 

export class AtividadePacienteModel extends Model {
    public idAtividade!: number;
    public descricao!: string;
    public nivelDificuldade!: number;
    public observacaoAtividade!: string;
    public dhFim!: Date;
    public fk_idPaciente!: number;
}

AtividadePacienteModel.init({
    idAtividade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nivelDificuldade: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
    },
    observacaoAtividade: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    dhFim: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'DH_Fim',
    },
    fk_idPaciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Atividade_Paciente',
    timestamps: false,  
    freezeTableName: true 
});
