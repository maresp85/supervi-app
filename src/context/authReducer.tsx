import { Usuario } from "../interfaces/appInterfaces";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    errorMessage: string;
    route: string | null;
    token: string | null;
    user: Usuario | null;
}

type AuthAction = 
    | { type: 'signUp', payload: { route: string, token: string, user: Usuario } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                route: null,
                token: null,
                user: null,
                status: 'not-authenticated',
                errorMessage: action.payload
            };

        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            };

        case 'signUp':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                route: action.payload.route,
                token: action.payload.token,
                user: action.payload.user,
            };

        case 'logout':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                route: null,
                token: null,
                user: null,
            };
            
        default:
            return state;
    }
}