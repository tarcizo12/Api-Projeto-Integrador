import { Request, Response } from 'express';
import  HttpStatus  from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage';
import { StringUtil } from '../utils/StringUtil';
import { PacienteService } from '../service/PacienteService';
import { Parametros } from '../enums/Parametros';
import { PacienteServiceInterface } from '../interfaces/PacienteServiceInterface';
import { sanitizeUser } from '../utils/sanitizeUser';

/**
 * Classe de controlle de aplicacao
 */
export class PacienteController {
    private pacienteService: PacienteServiceInterface = new PacienteService;

    public async desvincularPsicologo(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json(
                    ErroBodyMensage.createErrorBody(
                        'Apenas pacientes podem desvincular o psicólogo.',
                        HttpStatus.FORBIDDEN.description
                    )
                );
            }

            const idPaciente = req.user.userId;
            const paciente = await this.pacienteService.desvincularPsicologo(idPaciente);

            return res.status(HttpStatus.OK.code).json({
                message: 'Vínculo com o psicólogo removido com sucesso.',
                data: sanitizeUser(paciente),
            });
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;
            console.error('Erro ao desvincular psicólogo:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody('Erro ao desvincular psicólogo', statusReturn.description)
            );
        }
    }

    public async vincularPsicologo(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json(
                    ErroBodyMensage.createErrorBody(
                        'Apenas pacientes podem vincular um psicólogo.',
                        HttpStatus.FORBIDDEN.description
                    )
                );
            }

            const idPsicologo = Number(req.body?.idPsicologo);
            if (!idPsicologo || Number.isNaN(idPsicologo)) {
                return res.status(HttpStatus.BAD_REQUEST.code).json(
                    ErroBodyMensage.createErrorBody(
                        "O campo 'idPsicologo' é obrigatório e deve ser um número.",
                        HttpStatus.BAD_REQUEST.description
                    )
                );
            }

            const idPaciente = req.user.userId;
            const paciente = await this.pacienteService.vincularPsicologo(idPaciente, idPsicologo);

            return res.status(HttpStatus.OK.code).json({
                message: 'Vínculo com o psicólogo criado com sucesso.',
                data: sanitizeUser(paciente),
            });
        } catch (error) {
            const message = (error as { message?: string }).message || 'Erro ao vincular psicólogo';
            const isNotFound = message.toLowerCase().includes('não encontrado');
            const statusReturn = isNotFound ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao vincular psicólogo:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody(message, statusReturn.description)
            );
        }
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.pacienteService.listarTodosPacientes()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes", statusReturn.description)); 
        }
    }

    public async deletePacienteById(req: Request, res: Response): Promise<Response> {
        try {
            const idPacienteParam = req.query.idPaciente;
    
            if (!idPacienteParam) {
                return res.status(HttpStatus.BAD_REQUEST.code).json(
                    ErroBodyMensage.createErrorBody("O parâmetro 'idPaciente' é obrigatório.", HttpStatus.BAD_REQUEST.description)
                );
            }
    
            const idPaciente = Number(idPacienteParam);
    
            if (isNaN(idPaciente)) {
                return res.status(HttpStatus.BAD_REQUEST.code).json(
                    ErroBodyMensage.createErrorBody("O parâmetro 'idPaciente' deve ser um número.", HttpStatus.BAD_REQUEST.description)
                );
            }
    
            const pacienteDeletado = await this.pacienteService.deletarPacienteById(idPaciente);
    
            return res.status(HttpStatus.OK.code).json({mensagem : `Paciente ${pacienteDeletado.nome} deletado com sucesso`});
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;
    
            console.error('Erro ao deletar paciente:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody("Erro ao deletar paciente", statusReturn.description)
            );
        }
    }
    

    public async getPacienteById(req: Request, res: Response): Promise<Response> {
        try {
            const idPaciente: string = StringUtil.getQueryString(req.query, Parametros.ID_PACIENTE);
     
            if (!idPaciente) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do paciente é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.pacienteService.buscarPacienteById(Number(idPaciente)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }

    public async getPacientesPorProfssional(req: Request, res: Response): Promise<Response> {
        try {
            const fkIdProfissional: string = StringUtil.getQueryString(req.query, Parametros.ID_PSICOLOGO);
   
            if (!fkIdProfissional) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do profissional é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.pacienteService.buscarPacientesByIdPsicologo(Number(fkIdProfissional)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar pacientes relacionados a esse psicologo:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar pacientes desse profissional" , statusReturn.description));
        }
    }

    public async atualizarPerfil(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json(
                    ErroBodyMensage.createErrorBody(
                        'Apenas pacientes podem atualizar este perfil.',
                        HttpStatus.FORBIDDEN.description
                    )
                );
            }

            const paciente = await this.pacienteService.atualizarPerfil(req.user.userId, {
                nome: req.body?.nome,
                email: req.body?.email,
                telefone: req.body?.telefone,
            });

            return res.status(HttpStatus.OK.code).json({
                message: 'Perfil atualizado com sucesso.',
                data: sanitizeUser(paciente),
            });
        } catch (error) {
            const message = (error as { message?: string }).message || 'Erro ao atualizar perfil';
            const isClientError =
                message.toLowerCase().includes('não encontrado') ||
                message.toLowerCase().includes('e-mail');
            const statusReturn = isClientError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao atualizar perfil do paciente:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody(message, statusReturn.description)
            );
        }
    }

    public async deletarContaPropria(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user?.isPaciente) {
                return res.status(HttpStatus.FORBIDDEN.code).json(
                    ErroBodyMensage.createErrorBody(
                        'Apenas pacientes podem excluir esta conta.',
                        HttpStatus.FORBIDDEN.description
                    )
                );
            }

            const paciente = await this.pacienteService.deletarPacienteById(req.user.userId);
            return res.status(HttpStatus.OK.code).json({
                message: `Conta de ${paciente.nome} excluída com sucesso.`,
            });
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;
            console.error('Erro ao excluir conta do paciente:', error);
            return res.status(statusReturn.code).json(
                ErroBodyMensage.createErrorBody('Erro ao excluir conta', statusReturn.description)
            );
        }
    }
}
