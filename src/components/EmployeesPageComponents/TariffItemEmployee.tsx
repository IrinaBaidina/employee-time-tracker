import { PricingTariff } from "@/services/Objects/Reports/PricingTariff"
import { useMemo } from "react"

interface TariffItemProps {
    tariff: PricingTariff
    changes?: {
        department: boolean
        position: boolean
        tariff: boolean
        group: boolean
    }
}

export const TariffItem: React.FC<TariffItemProps> = ({
    tariff,
    changes
}) => {

    const dateLabel = useMemo(() => {
        return `${tariff.working_month}.${tariff.working_year}`
    }, [tariff])

    return (
        <div className="pb-4">

            <div className="flex justify-between text-xs text-muted-foreground">
                <span className={changes?.department ? "text-signature font-medium" : ""}>
                    {tariff.department?.abbreviation ?? ""}
                </span>
                <span>{dateLabel}</span>
            </div>

            <div className={`font-medium ${changes?.position ? "text-signature" : ""}`}>
                {tariff.position?.name ?? ""}
            </div>

            <div className="flex gap-6 text-xs text-muted-foreground">
                <span className={changes?.tariff ? "text-signature font-medium" : ""}>
                    <span className="opacity-60">тариф:</span>{" "}
                    {tariff.fixed_payment_tariff}
                </span>

                <span className={changes?.group ? "text-signature font-medium" : ""}>
                    <span className="opacity-60">группа выплат:</span>{" "}
                    {tariff.fixed_payment_group}
                </span>
            </div>

        </div>
    )
}
