"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TableTwo from "@/components/Tables/TableTwo";
import { useAuth } from "@/hooks/AuthContext";
import DeleteModal from "@/components/Modals/DeleteModal";

// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

interface Contest {
  title: string;
  description: string;
  isLive: boolean;
}

interface Question {
  question: string;
  answer: string;
  hint: string;
  questionId: string | number;
  ContestId: string | number;
  image: File | string | null;
}

interface QuestionList {
  id: string | number;
  imageUrl: string;
  question: string;
  answer: string;
  hint: string;
  ContestId: string | number;
  createdAt: string;
  updatedAt: string;
}

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const FormLayout = (context: {
  params: {
    contestId: string;
  };
  searchParams: {};
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contest, setContest] = useState<Contest>({
    title: "",
    description: "",
    isLive: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const [question, setQuestion] = useState<Question>({
    question: "",
    answer: "",
    hint: "",
    questionId: "",
    ContestId: "",
    image: null,
  });

  const [questionList, setQuestionList] = useState<QuestionList[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    handleGetContestDetailById();
  }, []);

  const handleGetContestDetailById = (): void => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/questions/contest/${context.params.contestId}`,
      requestOptions,
    )
      .then((response: Response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200 && result.statusText === "OK") {
          setContest({
            title: result.data.data.contest.title,
            description: result.data.data.contest.description,
            isLive: result.data.data.contest.isLive,
          });
          setQuestion({
            question: "",
            answer: "",
            hint: "",
            questionId: "",
            image: null,
            ContestId: result.data.data.contest.id,
          });
          setQuestionList(result.data.data.questions);
        }
        setOpenDeleteModal(false);
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleUpdateContest = () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const raw = JSON.stringify(contest);

    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/questions/contest/${question.ContestId}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status == 200 && result.statusText === "OK") {
          handleGetContestDetailById();
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleCreateQuestion = () => {
    setLoading(true);
    const myHeaders: HeadersInit = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const formdata = new FormData();
    formdata.append("image", question.image || "");
    formdata.append("answer", question.answer);
    formdata.append("question", question.question);
    formdata.append("ContestId", String(question.ContestId));
    formdata.append("hint", question.hint);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.API_BASE_URL}/questions/add`, requestOptions)
      .then((response: Response) => response.json())
      .then((result: any) => {
        console.log(result);
        if (result.status == 200 && result.statusText === "OK") {
          setQuestion({
            ...question,
            question: "",
            answer: "",
            hint: "",
            questionId: "",
            image: null,
          });
          handleGetContestDetailById();
        }
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleUpdateQuestion = () => {
    setLoading(true);
    const myHeaders: HeadersInit = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const formdata = new FormData();
    formdata.append("image", question.image || "");
    formdata.append("answer", question.answer);
    formdata.append("question", question.question);
    formdata.append("ContestId", String(question.ContestId));
    formdata.append("hint", question.hint);

    const requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/questions/add/${question.questionId}`,
      requestOptions,
    )
      .then((response: Response) => response.json())
      .then((result: any) => {
        console.log(result);
        if (result.status == 200 && result.statusText === "OK") {
          setQuestion({
            ...question,
            question: "",
            answer: "",
            hint: "",
            questionId: "",
            image: null,
          });
          handleGetContestDetailById();
        }
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleDeleteQuestion = () => {
    setLoading(true);
    const myHeaders: HeadersInit = new Headers();
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/questions/add/${question.questionId}`,
      requestOptions,
    )
      .then((response: Response) => response.json())
      .then((result: any) => {
        console.log(result);
        if (result.status == 200 && result.statusText === "OK") {
          setQuestion({
            ...question,
            question: "",
            answer: "",
            hint: "",
            questionId: "",
            image: null,
          });
          handleGetContestDetailById();
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
        <Breadcrumb pageName="Contest" />
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onSubmit={handleDeleteQuestion}
          title="Delete Question"
          description="Are you sure you want to delete this question? All of your data will be permanently removed from our servers forever. This action cannot be undone."
          buttonText="Delete"
        />
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            {/* <!-- Sign In Form --> */}
            <div
              className={classNames(
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              )}
            >
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Create Details
                </h3>
              </div>
              <div>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={contest.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContest({ ...contest, title: e.target.value })
                      }
                      placeholder="Enter contest title"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      name="description"
                      value={contest.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setContest({
                          ...contest,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter contest description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                  <div className="mb-2 mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={contest.isLive}
                        onChange={() =>
                          setContest({ ...contest, isLive: !contest.isLive })
                        }
                        className="border-gray-300 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="text-gray-900 ml-3 block text-sm leading-6"
                      >
                        Publish this quiz
                      </label>
                    </div>

                    {/* <div className="text-sm leading-6">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div> */}
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateContest}
                    className="mt-5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Update Contest
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Sign Up Form --> */}
            {questionList?.length > 0 && (
              <TableTwo
                setQuestion={setQuestion}
                setOpenDeleteModal={setOpenDeleteModal}
                question={question}
                questionList={questionList}
              />
            )}
          </div>
          <div className="flex flex-col gap-9">
            {/* <!-- Contact Form --> */}
            <div
              className={classNames(
                "rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
              )}
            >
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Questions Details
                </h3>
              </div>
              <div>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Question
                    </label>
                    <input
                      type="text"
                      name="question"
                      value={question.question}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQuestion({ ...question, question: e.target.value })
                      }
                      placeholder="Enter question here..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Answer
                    </label>
                    <input
                      type="text"
                      name="answer"
                      value={question.answer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setQuestion({ ...question, answer: e.target.value })
                      }
                      placeholder="Enter question here..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Hint
                    </label>
                    <textarea
                      rows={4}
                      name="hint"
                      value={question.hint}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setQuestion({ ...question, hint: e.target.value })
                      }
                      placeholder="Enter hint here..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                  </div>
                  <div className="mb-5.5">
                    <div>
                      {question.image && (
                        <div className="mb-4 flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full">
                            {question.image instanceof File ? (
                              <Image
                                src={URL.createObjectURL(question.image)}
                                width={55}
                                height={55}
                                alt="User"
                              />
                            ) : (
                              <Image
                                unoptimized={true}
                                src={question.image}
                                width={55}
                                height={55}
                                alt="User"
                              />
                            )}
                          </div>
                          <div>
                            <span className="mb-1.5 text-black dark:text-white">
                              Edit photo
                            </span>
                            <span className="flex gap-2.5">
                              <button
                                type="button"
                                onChange={() =>
                                  setQuestion({ ...question, image: null })
                                }
                                className="text-sm hover:text-primary"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (fileInputRef.current) {
                                    fileInputRef.current.click();
                                  }
                                }}
                                className="text-sm hover:text-primary"
                              >
                                Update
                              </button>
                            </span>
                          </div>
                        </div>
                      )}

                      <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              setQuestion({
                                ...question,
                                image: files[0],
                              });
                            }
                          }}
                          accept="image/*"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                fill="#3C50E0"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                fill="#3C50E0"
                              />
                            </svg>
                          </span>
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                          {/* <p>(max, 800 X 800px)</p> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      question.questionId
                        ? handleUpdateQuestion
                        : handleCreateQuestion
                    }
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    {question.questionId
                      ? "Update Question"
                      : "Create Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
};

export default FormLayout;
