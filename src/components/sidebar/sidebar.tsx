import { getNavigationLinks } from "@/constants/sidelinks";
import { useUniversityContext } from "@/contexts/universityContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, LogOut, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./custom/button";
import { Layout } from "./custom/layout";
import Nav from "./nav";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ className, isCollapsed, setIsCollapsed }: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { university } = useUniversityContext();
  const pathname = usePathname();
  const isUniversityPage =
    pathname.startsWith("/dashboard/") && Boolean(university?.id);
  const organizationMatch = pathname.match(
    /\/dashboard\/(\w+)\/organization\/(\w+)/,
  );
  const isOrganizationPage = !!organizationMatch;
  const universityId = String(university?.id);
  const organizationId = isOrganizationPage ? organizationMatch[2] : null;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/sign-in",
      redirect: true,
    });
  };

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  const navigationLinks = getNavigationLinks(
    isUniversityPage,
    universityId,
    isOrganizationPage,
    organizationId,
  );
  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
          isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className,
      )}
    >
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        <Layout.Header
          sticky
          className="z-50 flex items-center justify-between px-4 py-3 shadow-sm md:px-4 h-16"
        >
          <div className="flex items-center gap-2">
            <Link
              prefetch={false}
              href="/dashboard"
              className="flex items-center"
            >
              <Image
                src={isCollapsed ? "/icon.png" : "/logo.png"}
                alt="9 Sign Logo"
                width={isCollapsed ? 50 : 150}
                height={isCollapsed ? 50 : 100}
                className={
                  isCollapsed ? " h-6 scale-150" : "h-12 w-auto object-contain"
                }
              />
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </Layout.Header>

        <Nav
          id="sidebar-menu"
          className={cn(
            "z-40 h-full flex-1 overflow-auto",
            navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2",
          )}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={navigationLinks}
        />

        {/* Logout Button */}
        <div
          className={cn(
            "border-t border-border p-4",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          <Button
            onClick={() => setShowLogoutPopup(true)}
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 hover:bg-primary/15 hover:text-primary",
              isCollapsed
                ? "h-11 w-11 rounded-lg p-0"
                : "h-11 justify-start gap-3 rounded-lg px-4",
            )}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </Button>
        </div>

        {showLogoutPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-96">
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
              <p className="mt-2 text-sm">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutPopup(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="rounded-lg bg-primary"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {!showLogoutPopup && (
          <Button
            onClick={() => setIsCollapsed((prev) => !prev)}
            size="icon"
            variant="outline"
            className="absolute -right-5 bottom-4 z-50 hidden rounded-full md:inline-flex hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isCollapsed && "rotate-180",
              )}
            />
          </Button>
        )}
      </Layout>
    </aside>
  );
}

export default Sidebar;
