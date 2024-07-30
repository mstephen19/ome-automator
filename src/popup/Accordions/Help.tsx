import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    CardHeader,
    Link,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { memo, type ReactNode } from 'react';

const InfoCard = ({
    title,
    subheader,
    content,
}: {
    title: string | ReactNode;
    subheader?: string | ReactNode;
    content?: string | ReactNode;
}) => {
    return (
        <Card variant='outlined'>
            <CardHeader title={title} subheader={subheader} titleTypographyProps={{ fontSize: '16px' }} />

            {content && (
                <CardContent>
                    <Accordion variant='outlined' disableGutters>
                        <AccordionSummary>Read more</AccordionSummary>

                        <AccordionDetails sx={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>{content}</AccordionDetails>
                    </Accordion>
                </CardContent>
            )}
        </Card>
    );
};

export const Help = memo(() => {
    return (
        <Box sx={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
            <InfoCard
                title='What is the message sequence?'
                subheader='A list of messages created by you. Sent one-by-one to each connection.'
                content={<Typography>Tip: Double-click a message in the sequence to edit it.</Typography>}
            />

            <InfoCard title='How many tabs can run simultaneously?' subheader='One.' />

            <InfoCard
                title='Is there spintax support?'
                subheader='Yes - and more.'
                content={
                    <>
                        <Typography>
                            Anything between an opening {'{tag}'} and closing {'{/tag}'} will be transformed accordingly.
                        </Typography>

                        <Typography fontWeight='bold'>Examples:</Typography>

                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={<code>{'{spin}hello | hi | hey{/spin}!'}</code>}
                                    secondary='Result will be one of "hello!", "hi!", "hey!" at random.'
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText
                                    primary={<code>{'I want some {rev}apple pie{/rev}.'}</code>}
                                    secondary='Result: "I want some eip elppa."'
                                />
                            </ListItem>

                            <ListItem>
                                <ListItemText primary={<code>{'{happy}Yay!!{/happy}'}</code>} secondary='Try it out!' />
                            </ListItem>

                            <ListItem>
                                <ListItemText primary={<code>{'{angry}not happy{/angry}'}</code>} secondary='Try it out!' />
                            </ListItem>
                        </List>
                    </>
                }
            />

            <InfoCard
                title='Can I get banned?'
                subheader='Yes, perhaps even permanently banned.'
                content={
                    <>
                        <Typography variant='h6'>Legal Disclaimer</Typography>

                        <Typography>
                            The use of the Ome.tv Automator browser extension is subject to the following terms and conditions. By using
                            this tool, you agree to the terms outlined below.
                        </Typography>

                        <List sx={{ listStyle: 'decimal', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary='No Warranty: Ome.tv Automator is provided "as is," without any guarantees or warranty of any kind, whether express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. The entire risk as to the quality and performance of the tool is with you.' />
                            </ListItem>

                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary='Assumption of Risk: The use of this tool may violate the Ome.tv terms of service. By using Ome.tv Automator, you acknowledge that you understand the risks involved and assume all responsibility for any consequences that may result from its use, including but not limited to account suspensions, permanent bans, or any other actions taken by third parties.' />
                            </ListItem>

                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary='Limitation of Liability: In no event shall the creator(s), developer(s), or distributor(s) of Ome.tv Automator, or any associated parties, be liable for any claims, damages, or other liabilities, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the tool or the use or other dealings in the tool.' />
                            </ListItem>

                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary='Changes and Updates: The creator(s), developer(s), and distributor(s) of this tool reserve the right to modify or update this disclaimer at any time without prior notice. Continued use of the tool constitutes acceptance of any such modifications or updates.' />
                            </ListItem>
                        </List>

                        <Typography>
                            By using Ome.tv Automator, you default in agreeing to these terms. Additionally, by using Ome.tv Automator, you
                            agree to indemnify, defend, and hold harmless the creator(s), developer(s), distributor(s), and any associated
                            parties from any claims, liabilities, damages, and expenses (including reasonable attorneys' fees) arising from
                            your use of the tool.
                        </Typography>
                    </>
                }
            />

            <InfoCard
                title='I found an issue, where do I go?'
                subheader='Github is the place!'
                content={
                    <Typography>
                        Submit any bug reports or feature requests <Link href='https://github.com/mstephen19/ome-automator'>on Github</Link>
                        .
                    </Typography>
                }
            />
        </Box>
    );
});
