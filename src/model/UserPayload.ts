type UserPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthDate: string;
    isPsychologist: boolean;
    crp?: string;
    codigoPsicologoIndicador?: number;
};

export default UserPayload;