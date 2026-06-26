import { AsyncLocalStorage } from 'async_hooks';
import { TokenBudgetManager } from './token_budget_manager.js';

export const tokenBudgetStorage = new AsyncLocalStorage<TokenBudgetManager>();
