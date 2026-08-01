import { Request, Response } from 'express';
import HttpStatus from '../enums/HttpStatus';
import { ErroBodyMensage } from '../model/ErroBodyMensage'
import { PsicologoService } from '../service/PsicologoService';
import { StringUtil } from '../utils/StringUtil';
import { Parametros } from '../enums/Parametros';
import { PsicologoServiceInterface } from '../interfaces/PsicologoServiceInterface';


/**
 * Classe de controlle de aplicacao
 */
export class PsicologoController{

    private psicologoService: PsicologoServiceInterface = new PsicologoService;


    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK.code).json(await this.psicologoService.listarTodosPsicologos()); 
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar psicólogos:', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar psicólogos", statusReturn.description)); 
        }
    }

    
    public async getPsicologoById(req: Request, res: Response): Promise<Response> {
        try {
            const idPsicologo: string = StringUtil.getQueryString(req.query, Parametros.ID_PSICOLOGO);
     
            if (!idPsicologo) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'O ID do psicologo é obrigatório' });
            }

            return res.status(HttpStatus.OK.code).json(await this.psicologoService.buscarPsicologoById(Number(idPsicologo)));
        } catch (error) {
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar profissionall', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao buscar profissionall" , statusReturn.description));
        }
    }

    public async postVincularClienteById(req: Request, res: Response): Promise<Response> {
        try {
            const idPacienteParaVincular: number = req.body.idPaciente
            const idPsicologoLogado: number = req.body.idPsicologoLogado

            if (!idPacienteParaVincular || !idPacienteParaVincular) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({ message: 'Os IDS para vinculacao devem ser informados' });
            }
            const result = await this.psicologoService.criarVinculoComContaPaciente(idPacienteParaVincular, idPsicologoLogado)
    
            if(result){
                return res.status(HttpStatus.OK.code).json({ message: "Vinculo com paciente criado com sucesso!"});
            }else{
                throw new Error("Falha ao gerar vinculo com paciente");
            }

        }catch(error){
            const statusReturn = HttpStatus.INTERNAL_SERVER_ERROR;

            console.error('Erro ao buscar profissionall', error);
            return res.status(statusReturn.code).json(ErroBodyMensage.createErrorBody("Erro ao criar vinculo de contas entre Psicologo e Paciente" , statusReturn.description));
        }
    }
}