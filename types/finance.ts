import { Expenses } from "./expenses";

export interface FinanceConstants {
	salary: number;
	bonus?: number;

	utiliseFHSS?: boolean;
	hecs?: boolean;
}

export interface Finance extends FinanceConstants {
	monthlyExpenses?: Expenses;
	desiredFunMoney?: number;
}
