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

const getProjectLinks = (projectId: string): SideLink[] => [
  {
    title: "Organization",
    label: "",
    href: `/dashboard`,
    icon: <HomeIcon size={18} />,
  },
  {
    title: "Manage-Organization",
    label: "",
    href: `/dashboard/${projectId}/manage-organization/`,
    icon: <Building2 size={18} />,
  },
  {
    title: "Manage Gate",
    label: "",
    href: `/dashboard/${projectId}/manage-gate/`,
    icon: <Building size={18} />,
  },
  {
    title: "Manage Guard",
    label: "",
    href: `/dashboard/${projectId}/manage-guard/`,
    icon: <Building2 size={18} />,
  },

  // {
  //   title: "Manage Flat",
  //   label: "",
  //   href: `/manage-project/${projectId}/manage-flat`,
  //   icon: <HomeIcon size={18} />,
  // },
  // {
  //   title: "Meter Management",
  //   label: "",
  //   href: "",
  //   icon: <GaugeCircle size={18} />,
  //   sub: [
  //     {
  //       title: "Meter",
  //       label: "",
  //       href: `/manage-project/${projectId}/meter`,
  //       icon: <Gauge size={18} />,
  //     },
  //     {
  //       title: "Meter Log",
  //       label: "",
  //       href: `/manage-project/${projectId}/meter-log`,
  //       icon: <ScrollText size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: "Customers",
  //   label: "",
  //   href: "",
  //   icon: <Users2 size={18} />,
  //   sub: [
  //     {
  //       title: "Approve Customers",
  //       label: "",
  //       href: `/manage-project/${projectId}/approve-customers`,
  //       icon: <UserCheck size={18} />,
  //     },
  //     {
  //       title: "Manage Customers",
  //       label: "",
  //       href: `/manage-project/${projectId}/manage-customers`,
  //       icon: <UserCog size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: "Bills (invoice bills)",
  //   label: "",
  //   href: `/manage-project/${projectId}/generate-bill`,
  //   icon: <ScrollText size={18} />,
  // },
  // {
  //   title: "Razorpay Bills",
  //   label: "",
  //   href: "",
  //   icon: <CircleDollarSign size={18} />,
  //   sub: [
  //     {
  //       title: "Billing",
  //       label: "",
  //       href: `/manage-project/${projectId}/billing`,
  //       icon: <ReceiptIndianRupee size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: "Generate Reports",
  //   label: "",
  //   href: `/manage-project/${projectId}/generate-reports`,
  //   icon: <Printer size={18} />,
  // },
  // {
  //   title: "Reports",
  //   label: "",
  //   href: `/manage-project/${projectId}/reports`,
  //   icon: <FileSpreadsheet size={18} />,
  // },
];

export const getNavigationLinks = (
  isProjectPage: boolean,
  projectId: string | null,
): SideLink[] => {
  if (isProjectPage && projectId) {
    return getProjectLinks(projectId);
  }
  return mainLinks;
};
