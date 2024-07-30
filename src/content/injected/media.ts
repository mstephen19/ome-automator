import { PageCommand, PageCommandDataMap } from './types';

const applyConfigToStream = (stream: MediaStream, config: PageCommandDataMap[PageCommand.SetAddOnConfig]) => {
    if (!stream || !config) return;

    stream.getVideoTracks().forEach((track) => (track.enabled = !config.hideCamera));
    stream.getAudioTracks().forEach((track) => (track.enabled = !config.muteAudio));
};

const _getUserMedia = navigator.mediaDevices.getUserMedia;

const streamController = () => {
    const config = { muteAudio: false, hideCamera: false };
    let activeStream: MediaStream | null = null;

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        if (!event.data || event.data.type !== PageCommand.SetAddOnConfig) return;

        const latestConfig = event.data.data as PageCommandDataMap[PageCommand.SetAddOnConfig];
        for (const key in latestConfig) {
            const configKey = key as keyof typeof config;
            config[configKey] = latestConfig[configKey];
        }

        // When config is updated, reapply
        if (activeStream) applyConfigToStream(activeStream, config);
    });

    navigator.mediaDevices.getUserMedia = async (constraints?: MediaStreamConstraints | undefined) => {
        const stream = await _getUserMedia(constraints);

        applyConfigToStream(stream, config);
        activeStream = stream;

        return stream;
    };
};

streamController();
