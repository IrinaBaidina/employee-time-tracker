import { WorkingMonth } from '@/services/API/WorkingMonthAPI';
import { PricingTariff } from '@/services/Objects/Reports/PricingTariff';

export interface TimelineContext {
    currentMonth?: WorkingMonth;
    pricingPlan: PricingTariff[];
    setPricingPlan: (pricingPlan: PricingTariff[]) => void;
    isLoading: boolean;
    error: Error | null;
}