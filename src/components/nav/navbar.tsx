import { Button } from "@/components/ui/button";
import { Logo } from "@/components/nav/logo";
import { NavMenu } from "@/components/nav/nav-menu";
import { NavigationSheet } from "@/components/nav/navigation-sheet";
import { ArrowUpRight } from "lucide-react";
import { ModeToggle } from "@/components/react/ModeToggle";

const Navbar = () => {
  return (
    <nav className="sticky header top-0 z-50 h-16 border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-lg) mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
        <a href="/">
            <Logo />
          </a> 
         

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-3">
          <Button variant={"ghost"}>
          <a href="/login">
          Login
        </a>
        <ArrowUpRight />
          </Button>
          <Button variant={"ghost"}>
          <a href="/admin">
            Admin Acess
          </a> <ArrowUpRight />
          </Button>
          <ModeToggle />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;