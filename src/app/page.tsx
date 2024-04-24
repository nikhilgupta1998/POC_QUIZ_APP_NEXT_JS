import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const FormLayout = () => {
  return (
    <div className="relative">
      {/* {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center backdrop-brightness-75">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )} */}
      <DefaultLayout>
        {/* <Breadcrumb pageName="Contest" /> */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2"></div>
      </DefaultLayout>
    </div>
  );
};

export default FormLayout;
