import { AddOns } from '../../types';

export enum PageEvent {
    PeerChange = 'peer_change',
}

export type PageEventDataMap = {
    [PageEvent.PeerChange]: { address: string };
};

export enum PageCommand {
    SetAddOnConfig = 'set_addon_config',
}

export type PageCommandDataMap = {
    [PageCommand.SetAddOnConfig]: Pick<AddOns, 'muteAudio' | 'hideCamera'>;
};
