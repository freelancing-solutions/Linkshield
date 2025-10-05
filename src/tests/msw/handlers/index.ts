import { dashboardHandlers } from './dashboardHandlers';
import { socialProtectionHandlers } from './socialProtectionHandlers';

export const handlers = [
  ...dashboardHandlers,
  ...socialProtectionHandlers,
];