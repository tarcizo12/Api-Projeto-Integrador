import { PacienteServiceInterface } from "../interfaces/PacienteServiceInterface";
import { PacienteModel } from "../model/PacienteModel";


/**
 * Classe de implementação dos contratos
 */
export class PacienteService implements PacienteServiceInterface{

    listarTodosPacientes(): Promise<PacienteModel[]> {
        return PacienteModel.findAll()
    }

    async buscarPacienteById(idPaciente: number): Promise<PacienteModel> {
        try {
            const paciente: PacienteModel | null = await PacienteModel.findByPk(idPaciente);

            if (!paciente) {
                throw new Error("Paciente não encontrado");
            }

            return paciente;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter paciente por ID: " + errorMessage);
        }
    }
    
    
    buscarPacientesByIdPsicologo(fk_idProfissional: number): Promise<PacienteModel[]> {
        try {
            return PacienteModel.findAll({where: {fk_idProfissional} });
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter pacientes relacionados á esse id de profissional " + errorMessage);
        }
    }
 
}
