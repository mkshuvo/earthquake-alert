import { atom } from 'recoil';
export interface Earthquake {
    properties: {
        mag: number;
        place: string;
        time: number;
        updated: number;
        tz: string | null;
        url: string;
        detail: string;
        felt: number | null;
        cdi: number | null;
        mmi: number | null;
        alert: string | null;
        status: string;
        tsunami: number;
        sig: number;
        net: string;
        code: string;
        ids: string;
        sources: string;
        types: string;
        nst: number | null;
        dmin: number | null;
        rms: number;
        gap: number | null;
        magType: string;
        type: string;
        title: string;
    };
    geometry: {
        type: string;
        coordinates: [number, number, number];
    };
    id: string;
}
export const earthquakeState = atom<Earthquake[]>({
    key: 'earthquakeState',
    default: [],
});
