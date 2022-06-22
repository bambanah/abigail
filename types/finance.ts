import { Expenses } from "./expenses";

export interface Finance {
	salary: number;
	bonus?: number;
	monthlyExpenses?: Expenses;
	desiredFunMoney: number;

	utiliseFHSS?: boolean;
	hecs?: boolean;
}
