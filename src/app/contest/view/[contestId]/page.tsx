"use client";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/AuthContext";
import DynamicInput from "@/components/Input/DynamicInput";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

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

interface QuestionType {
  id: string | number;
  imageUrl: string;
  question: string;
  answer: string;
  hint: string;
  UserAnswer: {
    id: string | number;
    UserId: string | number;
    QuestionId: string | number;
    answer: string;
    isCorrect: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface QuizResultType {
  id: string | number;
  email: string;
  username: string;
  Questions: QuestionType[];
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
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const [questionList, setQuestionList] = useState<QuestionList[]>([]);
  const [questionStep, setQuestionStep] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<QuizResultType[]>([]);

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
          setQuestionList(result.data.data.questions);
        }
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleGetQuizResult = () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const raw = JSON.stringify({
      contestId: context.params.contestId,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.API_BASE_URL}/admin/users-quiz-results`,
      requestOptions,
    )
      .then((response: Response) => response.json())
      .then((result) => {
        if (result.status === 200 && result.statusText === "OK") {
          setQuizResult(result.data.data);
        }
      })
      .catch((error: Error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleSubmitAnswer = (answer: string, questionId: string | number) => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user?.token}`);

    const raw = JSON.stringify({
      UserId: user?.id,
      QuestionId: questionId,
      answer: answer,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.API_BASE_URL}/questions/answer`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // if (result.status === 200 && result.statusText === "OK") {
        if (questionStep < questionList.length - 1) {
          setQuestionStep(questionStep + 1);
        } else {
          setQuestionStep(questionStep + 1);
          handleGetQuizResult();
        }
        // }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center backdrop-brightness-75">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      )}
      <DefaultLayout>
        <div className="mx-auto max-w-242.5">
          {/* <Breadcrumb pageName="Profile" /> */}

          {questionStep < questionList?.length ? (
            <div className="relative overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="top-0 z-20 mt-4 flex w-full justify-center">
                <div className="rounded-full border border-primary p-1">
                  <div className="rounded-full border-4 border-primary p-3 font-semibold">
                    {questionStep + 1 + "/" + questionList?.length}
                  </div>
                </div>
              </div>
              <div className="relative z-20 h-35 md:h-65">
                <Image
                  src={questionList[questionStep]?.imageUrl}
                  alt="profile cover"
                  unoptimized={true}
                  className="h-full w-full rounded-tl-sm rounded-tr-sm object-contain object-center p-4"
                  fill
                />
              </div>
              <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                <div className="mt-4">
                  <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                    {questionList[questionStep]?.question}
                  </h3>

                  <div className="mx-auto max-w-180">
                    <h4 className="mt-4 font-semibold text-black dark:text-white">
                      Hint
                    </h4>
                    <p className="mt-4.5">{questionList[questionStep]?.hint}</p>
                    <span className="mt-4.5 inline-flex items-center rounded-full bg-green-50 px-2 py-1 font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <span className="mr-2 font-semibold">Correct Aswer:</span>{" "}
                      {questionList[questionStep]?.answer}
                    </span>
                  </div>

                  <div className="mt-6.5">
                    <div>
                      {!loading && (
                        <div className="flex items-center justify-center p-6.5">
                          {questionList[questionStep]?.answer?.split("")
                            ?.length && (
                            <DynamicInput
                              questionId={questionList[questionStep]?.id}
                              length={
                                questionList[questionStep]?.answer?.split("")
                                  ?.length
                              }
                              onSubmit={handleSubmitAnswer}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="bg-white">
                <div className="mx-auto max-w-7xl space-y-8 px-6 py-16 lg:px-8">
                  <div className="flex items-center gap-4">
                    <h3 className="text-gray-900 text-2xl font-bold leading-10 tracking-tight">
                      Quiz Result
                    </h3>
                    <Image
                      width={32}
                      height={32}
                      src={"/images/logo/logo-icon.svg"}
                      alt="Logo"
                    />
                  </div>
                  {quizResult.map((userResults) => (
                    <div
                      key={userResults.id}
                      className="divide-gray-900/10 mx-auto max-w-4xl divide-y"
                    >
                      <div className="flex items-center gap-4">
                        <span className="h-8 w-8 rounded-full">
                          <Image
                            width={32}
                            height={32}
                            src={"/images/user/user-placeholder.png"}
                            style={{
                              width: "auto",
                              height: "auto",
                              borderRadius: "50%",
                            }}
                            alt="User"
                          />
                        </span>
                        <div>
                          <div className="text-gray-900 text-lg font-semibold tracking-tight">
                            {userResults.username}
                          </div>
                          <span>{userResults.email}</span>
                        </div>
                      </div>
                      <dl className="divide-gray-900/10 mt-10 space-y-6 divide-y">
                        {userResults?.Questions?.map((faq) => (
                          <Disclosure
                            as="div"
                            key={faq.id}
                            className="pt-6"
                          >
                            {({ open }) => (
                              <>
                                <dt>
                                  <Disclosure.Button className="text-gray-900 flex w-full items-start justify-between text-left">
                                    <span className="flex items-center gap-4 text-base font-semibold leading-7">
                                      {faq.question}
                                      <>
                                        {faq.UserAnswer.isCorrect ? (
                                          <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon
                                              className="h-5 w-5 text-green-600"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : (
                                          <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-pink-100">
                                            <XMarkIcon
                                              className="h-5 w-5 text-danger"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    </span>
                                    <span className="ml-6 flex h-7 items-center">
                                      {open ? (
                                        <MinusSmallIcon
                                          className="h-6 w-6"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <PlusSmallIcon
                                          className="h-6 w-6"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </span>
                                  </Disclosure.Button>
                                </dt>
                                <Disclosure.Panel
                                  as="dd"
                                  className="mt-2 pr-12"
                                >
                                  <p className="text-gray-600 text-base leading-7">
                                    {faq.hint}
                                  </p>
                                  <div className="mt-3 space-x-4">
                                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                      Your Answer: {faq.UserAnswer.answer}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                      Correct Answer: {faq.answer}
                                    </span>
                                  </div>
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default FormLayout;
