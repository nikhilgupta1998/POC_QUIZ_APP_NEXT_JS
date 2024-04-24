"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
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

    fetch(`${process.env.API_BASE_URL}/questions/quiz`, requestOptions)
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

  return (
    <div className="relative">
      {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center backdrop-brightness-75">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}
      <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {"Quizes"}
          </h2>
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
