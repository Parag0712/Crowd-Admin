"use client";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
// import { useProjects } from "@/hooks/management/manage-project";
import { Separator } from "@/components/ui/separator";
import { useOrganizationContext } from "@/contexts/organizationContext";
import { useUniversityContext } from "@/contexts/universityContext";
import { ArrowRight, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";


export default function DashboardPage({params}:{params:{id:string,orgId:string}}) {
  const router = useRouter();
  const { data: session } = useSession();
  const managementOptions = [
    { name: "Manage Students", icon: Building2, path: "/manage-students" },
    { name: "Manage Faculty", icon: Building2, path: "/manage-faculty" },
    { name: "Manage Courses", icon: Building2, path: "/manage-courses" },
    { name: "Manage Departments", icon: Building2, path: "/manage-departments" },
  ];

  const { university } = useUniversityContext();
  const { organization } = useOrganizationContext();
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-8xl mx-auto">
      <div className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}! 👋
        </h2>
        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          This is the dashboard for {university?.name}
        </p>
        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          Organization {organization?.name}
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {managementOptions.map((option, index) => (
          <Card
            key={index}
            className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-dashed border-2 hover:border-primary hover:bg-primary/5 flex items-center justify-center group relative overflow-hidden"
            onClick={() => router.push(`/dashboard/${params.id}/organization/${params.orgId}/${option.path}`)}
          >
            <div className="text-center relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center transition-colors">
                <option.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-primary flex items-center justify-center gap-2">
                {option.name}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
