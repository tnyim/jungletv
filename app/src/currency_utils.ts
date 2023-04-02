// this file is imported by the main application bundle and also by the appbridge
// this file is exceptionally included in the paths for typescript to process when compiling appbridge

export const formatBANPrice = function (raw: string): string {
    return getAmountPartsAsDecimal(getAmountPartsFromRaw(raw, "ban_"), 29, 2);
}

export const formatPrice = function (raw: string, currency: "BAN" | "XNO"): string {
    let p: {
        [currency: string]: [string, number, number];
    } = {
        "BAN": ["ban_", 29, 2],
        "XNO": ["nano_", 30, 6],
    };
    return getAmountPartsAsDecimal(getAmountPartsFromRaw(raw, p[currency][0]), p[currency][1], p[currency][2]);
}

export const formatBANPriceFixed = function (raw: string): string {
    return getAmountPartsAsDecimal(getAmountPartsFromRaw(raw, "ban_"), 29, 2, true).match(/[0-9]+\.[0-9]{2}/)[0];
}

export const isPriceZero = function (raw: string): boolean {
    return /^0*$/.test(raw);
}

function getAmountPartsAsDecimal(parts: any, currencyDecimalPlaces: number, centPlaces: number, forceIncludeCents: boolean = false) {
    let nanoDecimal = '';
    const nano = parts[parts.majorName];
    if (nano !== undefined) {
        nanoDecimal += nano;
    } else {
        nanoDecimal += '0';
    }

    const nanoshi = parts[parts.minorName];
    const includeCents = forceIncludeCents || (nanoshi !== undefined && nanoshi !== "0")
    if (includeCents || (parts.raw !== undefined && parts.raw !== "0")) {
        nanoDecimal += '.';
    }

    if (includeCents) {
        nanoDecimal += '0'.repeat(centPlaces - nanoshi.length);
        nanoDecimal += nanoshi;
    }

    if (parts.raw !== undefined && parts.raw !== "0") {
        if (nanoDecimal.endsWith(".")) {
            nanoDecimal += '0'.repeat(centPlaces);
        }
        const count = (currencyDecimalPlaces - centPlaces) - parts.raw.length;
        if (count < 0) {
            throw Error(`too many numbers in parts.raw '${parts.raw}', remove ${-count} of them.`);
        }
        nanoDecimal += '0'.repeat(count);
        nanoDecimal += parts.raw;
    }

    return nanoDecimal;
};


/**
* Get the banano parts (banano, banoshi, raw) for a given raw value.
*
* @param {string} amountRawStr the raw amount, as a string.
* @param {string} amountPrefix the amount prefix, as a string.
* @return {BananoParts} the banano parts.
*/
function getAmountPartsFromRaw(amountRawStr, amountPrefix) {
    /* istanbul ignore if */
    if (amountPrefix == undefined) {
        throw Error('amountPrefix is a required parameter.');
    }

    const amountRaw = BigInt(amountRawStr);
    const prefixDivisor = prefixDivisors[amountPrefix];
    const majorDivisor = prefixDivisor.majorDivisor;
    const minorDivisor = prefixDivisor.minorDivisor;
    const major = amountRaw / majorDivisor;
    const majorRawRemainder = amountRaw - (major * majorDivisor);
    const minor = majorRawRemainder / minorDivisor;
    const amountRawRemainder = majorRawRemainder - (minor * minorDivisor);

    const bananoParts = {
        majorName: prefixDivisor.majorName,
        minorName: prefixDivisor.minorName,
        raw: amountRawRemainder.toString()
    };
    bananoParts[prefixDivisor.majorName] = major.toString();
    bananoParts[prefixDivisor.minorName] = minor.toString();
    return bananoParts;
};

const prefixDivisors = {
    'ban_': {
        minorDivisor: BigInt('1000000000000000000000000000'),
        majorDivisor: BigInt('100000000000000000000000000000'),
        majorName: 'banano',
        minorName: 'banoshi',
    },
    'nano_': {
        minorDivisor: BigInt('1000000000000000000000000'),
        majorDivisor: BigInt('1000000000000000000000000000000'),
        majorName: 'nano',
        minorName: 'nanoshi',
    },
};
