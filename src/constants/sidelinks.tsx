import {
  Building,
  Building2,
  HomeIcon,
  UserCheck,
  UserCog,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

const mainLinks: SideLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "/dashboard",
    icon: <HomeIcon size={18} />,
  },
  {
    title: "Manage Users",
    label: "",
    href: "/",
    icon: <UserCog size={18} />,
  },
  {
    title: "Manage University",
    label: "",
    href: "/manage-university",
    icon: <UserCheck size={18} />,
  },
];

const getUniversityLinks = (universityId: string): SideLink[] => [
  {
    title: "Organization",
    label: "",
    href: `/dashboard`,
    icon: <HomeIcon size={18} />,
  },
  {
    title: "Manage-Organization",
    label: "",
    href: `/dashboard/${universityId}/manage-organization/`,
    icon: <Building2 size={18} />,
  },
  {
    title: "Manage Gate",
    label: "",
    href: `/dashboard/${universityId}/manage-gate/`,
    icon: <Building size={18} />,
  },
  {
    title: "Manage Guard",
    label: "",
    href: `/dashboard/${universityId}/manage-guard/`,
    icon: <Building2 size={18} />,
  },
];

const getOrganizationLinks = (
  universityId: string,
  orgnizationId: string,
): SideLink[] => [
  {
    title: "Manage Branch",
    label: "",
    href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-branch`,
    icon: <HomeIcon size={18} />,
  },
  {
    title: "Hod",
    label: "",
    href: ``,
    icon: <HomeIcon size={18} />,
    sub: [
      {
        title: "Manage",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-hod`,
        icon: <HomeIcon size={18} />,
      },
      {
        title: "Approvelist",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-approvelist-hod`,
        icon: <HomeIcon size={18} />,
      },
    ],
  },
  {
    title: "Faculty",
    label: "",
    href: ``,
    icon: <HomeIcon size={18} />,
    sub: [
      {
        title: "Manege ",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-faculty`,
        icon: <HomeIcon size={18} />,
      },
      {
        title: "Approvelist",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-approvelist-faculty`,
        icon: <HomeIcon size={18} />,
      },
    ],
  },
  {
    title: "Student",
    label: "",
    href: ``,
    icon: <HomeIcon size={18} />,
    sub: [
      {
        title: "Manage",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-student`,
        icon: <HomeIcon size={18} />,
      },
      {
        title: "Approvelist",
        label: "",
        href: `/dashboard/${universityId}/organization/${orgnizationId}/manage-approvelist-student`,
        icon: <HomeIcon size={18} />,
      },
    ],
  },
];

export const getNavigationLinks = (
  isUnivertyPage: boolean,
  universityId: string | null,
  isOrgnizationPage: boolean,
  orgnizationId: string | null,
): SideLink[] => {
  if (isOrgnizationPage && orgnizationId) {
    return getOrganizationLinks(universityId!, orgnizationId);
  }

  if (isUnivertyPage && universityId) {
    return getUniversityLinks(universityId);
  }
  return mainLinks;
};
