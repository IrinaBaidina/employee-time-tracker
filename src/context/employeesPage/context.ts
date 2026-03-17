import { createSafeContext } from '@/utils/contexts/createSafeContext';
import { IEmployeesPageContext } from './interfaces';

export const [EmployeesPageContextProviderBase, useEmployeesPage] =
  createSafeContext<IEmployeesPageContext>('EmployeesPageContext');