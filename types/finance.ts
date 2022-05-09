import { Expenses } from "./expenses";

export interface Finance {
	salary: number;
	bonus?: number;
	expenses: Expenses;
	desiredFunMoney: number;

	utiliseFHSS?: boolean;
	hecs?: boolean;
}
