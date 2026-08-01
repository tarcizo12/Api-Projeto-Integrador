import { PsicologoServiceInterface } from "../interfaces/PsicologoServiceInterface";
import { PacienteModel } from "../model/PacienteModel";
import { PsicologoModel } from "../model/PsicologoModel";


/**
 * Classe de implementação dos contratos
 */
export class PsicologoService implements PsicologoServiceInterface{

    async criarVinculoComContaPaciente(idPaciente: number, idPsicologoLogado: number): Promise<boolean> {
        try {
        const [linhasAfetadas] = await PacienteModel.update(
            { fk_idProfissional: idPsicologoLogado },
            { where: { idPaciente } }
        );

        console.log(`Paciente com idPaciente = ${idPaciente} atualizado com sucesso. Linhas afetadas: ${linhasAfetadas}`);
        return true
        } catch (error) {
            console.error('Erro ao atualizar fk_idProfissional do paciente:', error);

            throw new Error("Não foi possível criar vinculo entre perfil do Psicologo com paciente informado");
        }
    }


    async buscarPsicologoById(idPsicologo: number): Promise<PsicologoModel> {
        try {
            const psicologo: PsicologoModel | null = await PsicologoModel.findByPk(idPsicologo);

            if (!psicologo) {
                throw new Error("Psicologo não encontrado");
            }

            return psicologo;
        } catch (error) {
            const errorMessage = (error as { message?: string }).message || 'erro desconhecido';
            throw new Error("Não foi possível obter psicologo por ID: " + errorMessage);
        }
    }

    listarTodosPsicologos(): Promise<PsicologoModel[]> {
        return PsicologoModel.findAll();
    }

    async atualizarPerfil(
        idPsicologo: number,
        dados: { nome?: string; email?: string; crp?: string }
    ): Promise<PsicologoModel> {
        const psicologo = await PsicologoModel.findByPk(idPsicologo);
        if (!psicologo) {
            throw new Error('Psicólogo não encontrado');
        }

        const payload: Record<string, unknown> = {};
        if (typeof dados.nome === 'string' && dados.nome.trim()) {
            payload.nome = dados.nome.trim();
        }
        if (typeof dados.email === 'string' && dados.email.trim()) {
            const email = dados.email.trim().toLowerCase();
            const [pacienteEmail, psicologoEmail] = await Promise.all([
                PacienteModel.findOne({ where: { email } }),
                PsicologoModel.findOne({ where: { email } }),
            ]);
            if (
                pacienteEmail ||
                (psicologoEmail && psicologoEmail.idProfissional !== idPsicologo)
            ) {
                throw new Error('Já existe um usuário com este e-mail.');
            }
            payload.email = email;
        }
        if (typeof dados.crp === 'string' && dados.crp.trim()) {
            payload.crp = dados.crp.trim();
        }

        await psicologo.update(payload);
        return psicologo.reload();
    }

    async deletarConta(idPsicologo: number): Promise<PsicologoModel> {
        const psicologo = await PsicologoModel.findByPk(idPsicologo);
        if (!psicologo) {
            throw new Error('Psicólogo não encontrado');
        }

        await PacienteModel.update(
            { fk_idProfissional: null },
            { where: { fk_idProfissional: idPsicologo } }
        );
        await PsicologoModel.destroy({ where: { idProfissional: idPsicologo } });
        return psicologo;
    }
}
