import React, { useEffect, useMemo, useRef, useState } from "react";
import { productionCalendarService, WorkingMonth } from "@/services/API/WorkingMonthAPI";
import LoadDataExceptionComponent from "@/components/CommonComponents/ExceptionComponent";
import { PricingTariff } from "@/services/Objects/Reports/PricingTariff";
import { FundsAllocation } from "@/services/Objects/Reports/FundsAllocation";
import {
    createPricingTariffFromServ,
} from "@/utils/ReportUtils";
import { TimelineContextProviderBase } from "./context";
import { reportsService } from "@/services/API/Reports/ReportsAPI";
import { useEmployeesPage } from "../employeesPage/context";

interface ReportTablesProps {
    children: React.ReactNode;
    mode?: "single" | "all";
}

// Провайдер контекста
export const TimelineProvider: React.FC<ReportTablesProps> = ({ children,  mode }) => {
    const [pricingPlan, setPricingPlan] = useState<PricingTariff[]>([])
    const fundsAllocations = useRef<FundsAllocation[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { positions, departments, allUserProfiles } = useEmployeesPage();

    const userProfilesMap = useMemo(() => {
        return new Map(allUserProfiles.map(p => [p.personal_data.profile_id, p]));
    }, [allUserProfiles]);

    useEffect(() => {
        
        const fetchDataForAllMonths = async () => {
            try {
                setIsLoading(true);
                //Для всех месяцев нужно получить все вхождения по входным данным. 
                const response =
                    mode === "single"
                    ? await reportsService.getTariffsAndFunds(undefined, "single")
                    : await reportsService.getTariffsAndFunds();
                
                const months = await productionCalendarService.getAllUniqueDays();
                const monthMap = new Map<number, WorkingMonth>();
                for (const m of months) {
                    monthMap.set(m.id, m);
                }
                const newPricingPlan: PricingTariff[] = [];

                for (const respPricingTariff of response.pricing_plan) {
                    const workMonth = monthMap.get(respPricingTariff.working_month);
                    if (!workMonth) continue;

                    const bossProfile = userProfilesMap.get(respPricingTariff.boss_profile);
                    if (!bossProfile) continue;

                    const userData = respPricingTariff.user_profile
                        ? userProfilesMap.get(respPricingTariff.user_profile)
                        : undefined;

                    const department = departments.current.find(d => d.id === respPricingTariff.department);
                    const position = positions.current.find(p => p.id === respPricingTariff.position);

                    if (!department || !position) continue;

                    const pricingTariff = createPricingTariffFromServ(
                        workMonth.month,
                        workMonth.year,
                        respPricingTariff,
                        bossProfile,
                        position,
                        department,
                        userData
                    );

                    newPricingPlan.push(pricingTariff);
                }

                // сортировка по году и месяцу
                newPricingPlan.sort((a, b) => {
                    if (a.working_year !== b.working_year)
                        return a.working_year - b.working_year;
                    return a.working_month - b.working_month;
                });

                setPricingPlan(newPricingPlan);
                fundsAllocations.current = [];
                setIsLoading(false);

            } catch (err) {
                console.error('Failed to load data:', err);
                if (err instanceof Error)
                    setError(err);
            }
        };
        
        fetchDataForAllMonths();
    }, [ mode]);

    if (error) {
        return <LoadDataExceptionComponent message={error.message} />
    }

    return (<TimelineContextProviderBase value={
        {
            pricingPlan,
            setPricingPlan,
            isLoading,
            error,
        }
    }>
        {children}
    </TimelineContextProviderBase >);
};