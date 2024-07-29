export enum PageEvent {
    PeerChange = 'peer_change',
}

export type PageEventDataMap = {
    [PageEvent.PeerChange]: { address: string };
};
