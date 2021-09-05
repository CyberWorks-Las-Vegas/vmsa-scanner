import Exception from './Exception';
/**
 * Custom Error class of type Exception.
 */
export default class NotFoundException extends Exception {
    static getNotFoundInstance() {
        return new NotFoundException();
    }
}
//# sourceMappingURL=NotFoundException.js.map