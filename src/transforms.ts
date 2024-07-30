enum Token {
    Spintax = 'spin',
    Reverse = 'rev',
    Happy = 'happy',
    Angry = 'angry',
    Cool = 'cool',
}

type TokenMap = {
    transformBlock: (block: string) => string;
};

const tagChecker = (tokens: string[]) => {
    const findTagRegexStr = tokens.map((token) => `{\\\/?${token}}`).join('|');
    const findTagRegex = new RegExp(findTagRegexStr, 'g');
    const tagRegex = new RegExp(`^(${findTagRegexStr})$`);

    /**
     * Whether or not the parsed segment is purely a relevant tag or not.
     */
    const segmentIsTag = (segment: string) => tagRegex.test(segment);

    return {
        stringHasRelevantTag: (str: string) => findTagRegex.test(str),
        parseTokenFromTag: (str: string) => {
            if (!segmentIsTag(str)) return null;

            const tagType: 'start' | 'end' = str[1] === '/' ? 'end' : 'start';
            const token = str.slice(tagType === 'end' ? 2 : 1, str.length - 1);

            return { tagType, token };
        },
        segmentIsTag,
    };
};

/**
 * Returns a {@link RegExp} that matches for all spaces surrounding start/end tokens in a string.
 *
 * For example: |{span}|hello|{/span}|
 */
const tokenRegex = (tokens: Record<string, TokenMap>) => {
    return new RegExp(
        Object.keys(tokens).reduce(
            // Split on the spaces surrounding {token} and {/token}
            (final, token, index) =>
                final + `${index === 0 ? '' : '|'}(?={${token}})|(?={\\\/${token}})|(?<={${token}})|(?<={\\\/${token}})`,
            ''
        )
    );
};

/**
 * Parse custom {block}blocks{/block} within a string & transform the content between tags.
 *
 * **Token:** E.g. "spin"
 *
 * **Tag:** E.g. "{spin}", "{/spin}"
 *
 * **Input:** E.g. "Hello{spin} there|, friend| my fellow human{/spin}!"
 *
 * **Segment:** E.g. "Hello", "{spin}", " there|, friend| my fellow human", "{/spin}", "!"
 */
export const stringSyntaxBlocks = <Tokens extends Record<string, TokenMap>>(tokens: Tokens) => {
    const tags = tagChecker(Object.keys(tokens));

    const splitRegex = tokenRegex(tokens);

    const run = (input: string) => {
        const { activeToken, ok, result } = input.split(splitRegex).reduce(
            (acc, segment) => {
                const parsedTag = tags.parseTokenFromTag(segment);
                // If it's not a tag, transform (if in an active token) and add to the result.
                if (!parsedTag) {
                    acc.result += acc.activeToken === null ? segment : tokens[acc.activeToken]?.transformBlock(segment) ?? segment;
                    return acc;
                }

                // If it's a tag

                // Token becomes "active" once a start token is reached
                if (parsedTag.tagType === 'start') {
                    if (acc.activeToken === null) acc.activeToken = parsedTag.token;
                    // As long as there isn't already a start token.
                    else acc.ok = false;
                }

                if (parsedTag.tagType === 'end') {
                    // If there is no active token, or the active token isn't the found end token,
                    // unexpected token.
                    if (acc.activeToken === null || acc.activeToken !== parsedTag.token) acc.ok = false;
                    else acc.activeToken = null;
                }

                return acc;
            },
            { activeToken: null as string | null, ok: true, result: '' }
        );

        return { ok: ok && !activeToken, result };
    };

    return { run };
};

export const transforms = stringSyntaxBlocks({
    [Token.Happy]: { transformBlock: (block: string) => `✿🌼 😄 ${block} ☮️🌈 🌼✿` },
    [Token.Angry]: { transformBlock: (block: string) => `😡😡 ${block.toUpperCase()}!!!! 😡` },
    [Token.Cool]: { transformBlock: (block: string) => `😤 Yo, ${block} 😎` },
    [Token.Reverse]: { transformBlock: (block: string) => block.split('').reduceRight((acc, char) => acc + char, '') },
    [Token.Spintax]: {
        transformBlock: (block) => {
            const options = block.split('|');
            return options[Math.floor(Math.random() * options.length)];
        },
    },
});
