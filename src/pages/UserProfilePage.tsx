import { UserRound } from "lucide-react";
import { EmployeesPageProvider } from "@/context/providers";
import Personalisation from '@/components/UserProfilePageComponents/Personalisation';
import Safety from '@/components/UserProfilePageComponents/Safety';
import PersonalData from '@/components/UserProfilePageComponents/PersonalData';
import Timeline from '@/components/UserProfilePageComponents/Timeline';
import { TimelineProvider } from "@/context/timeline/provider";


const UserProfilePage = () => {

  // const handleSaveProfile = () => {
  //   // In a real application, you would make an API call to update the user's profile
  //   toast({
  //     variant: "success",
  //     title: "Данные сохранены"
  //   });
  // };

  return (
    <div className="container w-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <div className="container w-full animate-fade-in space-y-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <UserRound className="h-8 w-8" />
              Профиль пользователя
            </h1>
            <PersonalData/>
            <Safety/>
            <Personalisation/>
          </div>
        </div>
        <div className="lg:col-span-1">
          <EmployeesPageProvider>
            <TimelineProvider mode="single">
              <Timeline/>
            </TimelineProvider>
          </EmployeesPageProvider>
        </div>

      </div>
    </div>

  );
};

export default UserProfilePage;