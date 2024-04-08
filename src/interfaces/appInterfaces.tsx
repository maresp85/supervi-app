export interface LoginData {
    username: string;
    password: string;
}

export interface LoginResponse {
    errorMessage: string;
    user: Usuario;
    token: string;
    route: string;
}

export interface Usuario {
    rol: string;
    estado: boolean;
    nombre: string;
    email: string;
    username: string;
    uid: string;
    img?: string;
}

export interface Credit {
    id: number;
    amount: number;
    amount_installment: number,
    current_balance: number;
    today_payment: boolean,
}

export interface CreditResponse {
    credit: Credit;
}