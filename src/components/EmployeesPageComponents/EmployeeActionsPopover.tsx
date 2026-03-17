import { ProfessionalUserData } from "@/services/API/UserProfileAPI";
import { EllipsisVertical, Pencil, UserMinus, ArrowUpToLine, GitPullRequestArrow } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TimelineProvider } from "@/context/timeline/provider";
import EmployeeTimeline from "./EmployeeTimeline";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const EmployeeActionsPopover: React.FC<{
  employee: ProfessionalUserData
  onEdit: (e: ProfessionalUserData) => void
  onDismiss: (e: ProfessionalUserData) => void
  onRestore: (e: ProfessionalUserData) => void
}> = ({ employee, onEdit, onDismiss, onRestore }) => {

  const [open, setOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const isActive = employee.personal_data.is_active

  return (
  <>
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="signature"
          className="h-8 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={4}
        className="w-48 p-1"
      >
        <Button
          variant="ghost"
          className="w-full justify-start h-8 text-xs"
          onClick={() => {
            setIsTimelineOpen(true);
            setOpen(false);
          }}
        >
          <GitPullRequestArrow className="mr-2 h-4 w-4" />
          Путь в компании
        </Button>

        {isActive && (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start h-8 text-xs"
              onClick={() => {
                onEdit(employee)
                setOpen(false)
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Редактировать
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-8 text-xs text-red-600"
              onClick={() => {
                onDismiss(employee)
                setOpen(false)
              }}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Уволить
            </Button>
          </>
        )}

        {!isActive && (
          <Button
            variant="ghost"
            className="w-full justify-start h-8 text-xs text-green-600"
            onClick={() => {
              onRestore(employee)
              setOpen(false)
            }}
          >
            <ArrowUpToLine className="mr-2 h-4 w-4" />
            Восстановить
          </Button>
        )}
      </PopoverContent>
    </Popover>
    <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen} >
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
          <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  <GitPullRequestArrow className="mr-2 h-4 w-4" />
                  <span>Путь в компании</span>
                </div>
              </DialogTitle>
          </DialogHeader>
              <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <TimelineProvider mode="all">
                  <EmployeeTimeline employee={employee} />
                </TimelineProvider>
              </div>
      </DialogContent>
  </Dialog>
  </>
  )
}
export default EmployeeActionsPopover
