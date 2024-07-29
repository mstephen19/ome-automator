import { PageEvent, type PageEventDataMap } from './types';

const handleIceCandidate = (init?: RTCIceCandidate) => {
    if (!init) return;
    if (init?.type !== 'srflx') return;

    window.postMessage({ type: PageEvent.PeerChange, data: { address: init.address } as PageEventDataMap[PageEvent.PeerChange] }, '*');
};

class SniffedRTCPeerConnection extends window.RTCPeerConnection {
    constructor(config?: RTCConfiguration) {
        super(config);
    }

    addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void>;
    addIceCandidate(
        candidate: RTCIceCandidateInit,
        successCallback: VoidFunction,
        failureCallback: RTCPeerConnectionErrorCallback
    ): Promise<void>;
    addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void> {
        handleIceCandidate(candidate as RTCIceCandidate);

        return super.addIceCandidate(candidate);
    }
}

window.RTCPeerConnection = SniffedRTCPeerConnection;
