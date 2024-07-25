enum Token {
    Spintax = 'spin',
    Reverse = 'rev',
    Happy = 'happy',
    Angry = 'angry',
}

type TokenMap = {
    transformBlock: (block: string) => string;
};

const tokenTags = (token: string) => ({ start: `{${token}}`, end: `{/${token}}` });

const stringHasTag = (str: string, tokens: string[]) => {
    const tagRegex = new RegExp(
        tokens.reduce((acc, token, index) => acc + `${index === 0 ? '' : '|'}{\\\/?${token}}`, ''),
        'i'
    );

    return tagRegex.test(str);
};

const tokenFromTag = (str: string, tokens: string[]) => {
    if (!stringHasTag(str, tokens)) return null;

    const tagType = str[1] === '/' ? 'end' : 'start';

    return {
        tagType,
        token: str.slice(tagType === 'end' ? 2 : 1, str.length - 1),
    };
};

/**
 * Number of times a substring appears in a string (case insensitive).
 */
const matchesInString = (key: string, str: string) => {
    const keyRegex = new RegExp(key, 'i');
    return str.match(keyRegex)?.length ?? 0;
};

/**
 * Parse custom {block}blocks{/block} within a string & transform the content between tags..
 */
const stringSyntaxBlocks = <Tokens extends Record<string, TokenMap>>(tokens: Tokens) => {
    const tokenList = Object.keys(tokens);

    const validateAllBlocks = (input: string) => {
        return Object.keys(tokens).reduce(
            (acc, token) => {
                const { start, end } = tokenTags(token);

                const tokenOk = matchesInString(start, input) === matchesInString(end, input);

                acc.byToken[token as keyof Tokens] = tokenOk;
                // If any tokens failed, overall ok status is false
                if (!tokenOk) acc.ok = false;

                return acc;
            },
            { ok: true, byToken: {} } as {
                ok: boolean;
                byToken: { [K in keyof Tokens]: boolean };
            }
        );
    };
    const transformAllBlocks = (input: string) => {
        // Don't transform non-token inputs at all
        if (!stringHasTag(input, tokenList) || !validateAllBlocks(input)) input;

        const splitRegex = new RegExp(
            Object.keys(tokens).reduce(
                // Split on the spaces surrounding {token} and {/token}
                (final, token, index) =>
                    final + `${index === 0 ? '' : '|'}(?={${token}})|(?={\\\/${token}})|(?<={${token}})|(?<={\\\/${token}})`,
                ''
            ),
            'i'
        );

        const matches = input.split(splitRegex);
        if (!matches?.length) {
            return input;
        }

        const { final } = matches.reduce(
            (acc, segment) => {
                const parsedToken = tokenFromTag(segment, tokenList);

                if (parsedToken !== null && parsedToken.token in tokens) {
                    acc.currentToken = parsedToken.tagType === 'start' ? (parsedToken.token as keyof Tokens) : null;
                    return acc;
                }

                const transformed = acc.currentToken === null ? segment : tokens[acc.currentToken].transformBlock(segment);
                acc.final += transformed;

                return acc;
            },
            { final: '', currentToken: null as keyof Tokens | null }
        );

        return final;
    };

    return { validateAllBlocks, transformAllBlocks };
};

export const transforms = stringSyntaxBlocks({
    [Token.Happy]: { transformBlock: (block: string) => `✿🌼 😄 ${block} ☮️🌈 🌼✿` },
    [Token.Angry]: { transformBlock: (block: string) => `😡😡 ${block.toUpperCase()}!!!! 😡` },
    [Token.Reverse]: { transformBlock: (block: string) => block.split('').reduceRight((acc, char) => acc + char, '') },
    [Token.Spintax]: {
        transformBlock: (block) => {
            const options = block.split('|');
            return options[Math.floor(Math.random() * options.length)];
        },
    },
});
