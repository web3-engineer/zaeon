// data/clients.ts
export type ClientRecord = {
    id: string;
    numeroCliente: string;  // Número do cliente ENEL
    nome?: string;
    instalacao?: string;    // Nº de instalação (opcional)
    endereco?: string;
    usina: "I" | "II" | "III" | "IV"; // a qual usina pertence
};

export const CLIENTS: ClientRecord[] = [
    // === Novos clientes confirmados (Agosto) ===
    {
        id: "c_62363341",
        numeroCliente: "62363341",
        nome: "Cliente 62363341",
        usina: "IV", //
    },
    {
        id: "c_64286102",
        numeroCliente: "64286102",
        nome: "ABILIO MARTINS", //
        usina: "IV",
    },
    {
        id: "c_59398290",
        numeroCliente: "59398290",
        nome: "Cliente 59398290",
        usina: "IV", //
    },
];

//
