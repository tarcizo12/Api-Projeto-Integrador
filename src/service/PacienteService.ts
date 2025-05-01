import { AnotacaoPacienteInterface } from "../interfaces/AnotacaoPacienteInterface";
import { AtividadesPacienteInterface } from "../interfaces/AtividadesPacienteInterface";
import { PacienteServiceInterface } from "../interfaces/PacienteServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { AnotacaoPacienteService } from "./AnotacaoPacienteService";
import { AtividadePacienteService } from "./AtividadePacienteService";


/**
 * Classe de implementação dos contratos
 */
export class PacienteService implements PacienteServiceInterface{
    private anotacaoPacienteService: AnotacaoPacienteInterface = new AnotacaoPacienteService; 
    private atividadePacienteService: AtividadesPacienteInterface = new AtividadePacienteService; 


    async deletarPacienteById(idPaciente: number): Promise<PacienteModel> {
        try {
            const paciente: PacienteModel | null = await PacienteModel.findByPk(idPaciente);
            const qntdAnotacoesDeletadas = await this.anotacaoPacienteService.deletarAnotacoesByIdPaciente(idPaciente)
            const qntdAtividadesDeletadas = await  this.atividadePacienteService.deletarAtividadesByIdPaciente(idPaciente)

            if (!paciente) {
                throw new Error("Paciente não encontrado para exclusao");
            }
    
            await PacienteModel.destroy({  where: { idPaciente }});
            
            console.log(`Conta de paciente ${paciente.nome} deletada, registros relacionados deletados: \n`)
            console.log(`Quantidade de anotacoes deletadas : ${qntdAnotacoesDeletadas}`)
            console.log(`Quantidade de atividades deletadas : ${qntdAtividadesDeletadas}`)
            return paciente; 
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível deletar paciente por ID: " + errorMessage);
        }
    }    

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
