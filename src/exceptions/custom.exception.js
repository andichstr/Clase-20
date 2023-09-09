//@ts-check
export class CustomException extends Error {
    constructor(message, status, classNameException, errorType) {
        super(message);
        this.status = status;
        this.name = classNameException;
        this.errorType = errorType;
    }
}