type UserPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    birthDate: string;
    isPsychologist: boolean;
    crp?: string;
};

export default UserPayload;