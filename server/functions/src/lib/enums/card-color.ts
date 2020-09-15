export enum CardColor {
    OROS = 'OROS',
    COPAS = 'COPAS',
    ESPADAS = 'ESPADAS',
    BASTOS = 'BASTOS'
};


export function asList(): Array<CardColor> {
    return [
        CardColor.OROS,
        CardColor.COPAS,
        CardColor.ESPADAS,
        CardColor.BASTOS
    ]
}