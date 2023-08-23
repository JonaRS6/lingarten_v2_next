interface Client {
	address: {
		colony: string;
		street: string;
		no: string;
	};
	registerDate: {
		seconds: number;
		nanoseconds: number;
	};
	service: {
		period: string;
		day: "1"| "2" | "3" | "4" | "5" | "6" | "7";
		type: string;
		cost: number;
	};
	printq: boolean;
	name: string;
	lastname: string;
	email: string;
	tel1: number;
	tel2: number;
	status: "pagado" | "pendiente" | "cancelado" | "atrasado";
	position: number;
	active: boolean;
}

export interface ClientTable extends Client {
	clientName: string;
	phone: string;
	fullAddress: string;
}

export default Client;