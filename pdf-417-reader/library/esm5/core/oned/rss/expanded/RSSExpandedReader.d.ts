import DecodeHintType from '../../../DecodeHintType';
import Result from '../../../Result';
import BitArray from '../../../common/BitArray';
import AbstractRSSReader from '../../rss/AbstractRSSReader';
import DataCharacter from '../../rss/DataCharacter';
import FinderPattern from '../../rss/FinderPattern';
import ExpandedPair from './ExpandedPair';
export default class RSSExpandedReader extends AbstractRSSReader {
    private static readonly SYMBOL_WIDEST;
    private static readonly EVEN_TOTAL_SUBSET;
    private static readonly GSUM;
    private static readonly FINDER_PATTERNS;
    private static readonly WEIGHTS;
    private static readonly FINDER_PAT_A;
    private static readonly FINDER_PAT_B;
    private static readonly FINDER_PAT_C;
    private static readonly FINDER_PAT_D;
    private static readonly FINDER_PAT_E;
    private static readonly FINDER_PAT_F;
    private static readonly FINDER_PATTERN_SEQUENCES;
    private static readonly MAX_PAIRS;
    private pairs;
    private rows;
    private readonly startEnd;
    private startFromEven;
    decodeRow(rowNumber: number, row: BitArray, hints: Map<DecodeHintType, any>): Result;
    reset(): void;
    decodeRow2pairs(rowNumber: number, row: BitArray): Array<ExpandedPair>;
    private checkRowsBoolean;
    private checkRows;
    private static isValidSequence;
    private storeRow;
    private removePartialRows;
    private static isPartialRow;
    getRows(): any;
    static constructResult(pairs: Array<ExpandedPair>): Result;
    private checkChecksum;
    private static getNextSecondBar;
    retrieveNextPair(row: BitArray, previousPairs: Array<ExpandedPair>, rowNumber: number): ExpandedPair;
    isEmptyPair(pairs: any): boolean;
    private findNextPair;
    private static reverseCounters;
    private parseFoundFinderPattern;
    decodeDataCharacter(row: BitArray, pattern: FinderPattern, isOddPattern: boolean, leftChar: boolean): DataCharacter;
    private static isNotA1left;
    private adjustOddEvenCounts;
}
