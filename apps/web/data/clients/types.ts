export type ClientRecord = {
    id: string;
    numeroCliente: string;  // Número do cliente ENEL
    nome?: string;
    instalacao?: string;    // Nº de instalação (opcional)
    endereco?: string;
    usina: "I" | "II" | "III" | "IV"; // a qual usina pertence
};