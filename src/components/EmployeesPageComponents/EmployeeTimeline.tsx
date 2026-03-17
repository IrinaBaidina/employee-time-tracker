import { useTimeline } from "@/context/exports"
import { ProfessionalUserData } from "@/services/API/UserProfileAPI"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StatusBlock, StatusBoard, StatusContent, StatusLine } from "../ui/statusLine"
import { TariffItem } from "./TariffItemEmployee"

interface Props{
    employee: ProfessionalUserData,
}

const EmployeeTimeline: React.FC<Props> = ({ employee }) => {
    const { pricingPlan } = useTimeline()
    const filteredTariffs = useMemo(() => {
        if (!employee) return []
        
        const sorted = pricingPlan
        .filter(t =>
            t.personal_data?.profile_id ===
            employee.personal_data.profile_id
        )
        .sort((a, b) => {
            if (a.working_year !== b.working_year)
                return a.working_year - b.working_year
            return a.working_month - b.working_month
        })

        if (pricingPlan.length > 0) {
}
        if (!sorted.length) return []

        const result: {
            tariff: typeof sorted[number],
            changes: {
                department: boolean
                position: boolean
                tariff: boolean
                group: boolean
            }
        }[] = []

        result.push({
            tariff: sorted[0],
            changes: {
                department: false,
                position: false,
                tariff: false,
                group: false
            }
        })

        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1]
            const current = sorted[i]

            const departmentChanged =
                prev.department?.id !== current.department?.id

            const positionChanged =
                prev.position?.id !== current.position?.id

            const tariffChanged =
                prev.fixed_payment_tariff !== current.fixed_payment_tariff

            const groupChanged =
                prev.fixed_payment_group !== current.fixed_payment_group

            const changed =
                departmentChanged ||
                positionChanged ||
                tariffChanged ||
                groupChanged

            if (changed || i === sorted.length - 1) {
                result.push({
                    tariff: current,
                    changes: {
                        department: departmentChanged,
                        position: positionChanged,
                        tariff: tariffChanged,
                        group: groupChanged
                    }
                })
            }
        }
        
        return result.reverse()

    }, [pricingPlan, employee])
    return(
        <Card className="h-fit border-signature py-3">
            <CardHeader>
                <CardTitle className="flex flex-col space-y-2">
                    {employee.personal_data.last_name} {employee.personal_data.first_name}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-0">
                <StatusBoard>
                    {filteredTariffs.map((item, index) => (
                        <StatusBlock>
                            <StatusLine status={index === 0 ? 'active' : 'noActive'} statusSize={4}  />
                            <StatusContent>
                                <TariffItem
                                    tariff={item.tariff}
                                    changes={item.changes}
                                />
                            </StatusContent>
                        </StatusBlock>
                    ))}
                </StatusBoard>
            </CardContent>
        </Card>
    )
}
export default EmployeeTimeline