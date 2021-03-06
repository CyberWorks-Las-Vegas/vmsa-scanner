import BitArray from '../common/BitArray';
import Result from '../Result';
import ResultMetadataType from '../ResultMetadataType';
/**
 * @see UPCEANExtension5Support
 */
export default class UPCEANExtension2Support {
    private decodeMiddleCounters;
    private decodeRowStringBuffer;
    decodeRow(rowNumber: number, row: BitArray, extensionStartRange: number[]): Result;
    decodeMiddle(row: BitArray, startRange: number[], resultString: string): number;
    static parseExtensionString(raw: string): Map<ResultMetadataType, number>;
}
