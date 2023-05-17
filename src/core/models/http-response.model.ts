import { HttpStatusCode } from 'axios';

export interface ErrorResponse {
    code?: number;
    message?: string;
}

export class HttpErrorResponse {
    public name: string;
    public message: string;
    public error: any | null;
    public statusCode: HttpStatusCode;
    public ok: boolean;

    constructor(_name = 'HttpErrorResponse', _message = '', _error = {}, _statusCode: HttpStatusCode, _ok = false) {
        this.name = _name;
        this.message = _message;
        this.error = _error;
        this.statusCode = _statusCode;
        this.ok = _ok;
    }
}
