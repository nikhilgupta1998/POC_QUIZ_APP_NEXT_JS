"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
// import TableTwo from "@/components/Tables/TableTwo";

// import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import DeleteModal from "@/components/Modals/DeleteModal";
import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

// export const metadata: Metadata = {
//   title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

interface ContestList {
  id: string | number;
  title: string;
  isLive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const TablesPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ContestList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [contestId, setContestId] = useState<string | number>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    handleContestList();
  }, []);

  const handleContestList = (): void => {
    setLoading(true);
    const myHeaders: HeadersInit = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.API_BASE_URL}/questions/contest`, requestOptions)
      .then((response: Response) => response.json())
      .then((result: any) => {
        console.log(result);
        if (result.status == 200 && result.statusText === "OK") {
          setData(result.data.data);
          setOpenDeleteModal(false);
        }
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleDeleteContest = () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/questions/contest/${contestId}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        handleContestList();
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center backdrop-brightness-75">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}
      <DefaultLayout>
        <Breadcrumb pageName="Contest List" />
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onSubmit={handleDeleteContest}
          title="Delete Contest"
          description="Are you sure you want to delete this contest? All of your data will be permanently removed from our servers forever. This action cannot be undone."
          buttonText="Delete"
        />
        <div className="flex justify-end">
          <Link
            type="button"
            href={"/contest/create"}
            className="mb-4 mt-2 inline-flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 md:w-fit"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Create Contest
          </Link>
        </div>
        <div className="flex flex-col gap-10">
          {/* <TableOne /> */}
          {/* <TableTwo /> */}
          <TableThree
            setContestId={setContestId}
            setOpenDeleteModal={setOpenDeleteModal}
            data={data}
          />
        </div>
      </DefaultLayout>
    </div>
  );
};

export default TablesPage;
