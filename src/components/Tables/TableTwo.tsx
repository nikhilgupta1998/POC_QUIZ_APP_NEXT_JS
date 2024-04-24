import Image from "next/image";
import { Product } from "@/types/product";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

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

type question = {
  question: string;
  answer: string;
  hint: string;
  questionId: string | number;
  ContestId: string | number;
  image: File | string | null;
};

interface TableTwoProps {
  questionList: QuestionList[];
  setQuestion: React.Dispatch<React.SetStateAction<question>>;
  question: question;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const productData: Product[] = [
  {
    image: "/images/product/product-01.png",
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    image: "/images/product/product-02.png",
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    image: "/images/product/product-03.png",
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const TableTwo: React.FC<TableTwoProps> = ({
  questionList,
  setQuestion,
  question,
  setOpenDeleteModal,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Question List
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Question</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Answer</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Hint</p>
        </div>
      </div>

      {questionList.map((product, key) => (
        <div key={key}>
          <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-6 md:px-6 2xl:px-7.5">
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={product.imageUrl}
                    width={60}
                    height={50}
                    unoptimized={true}
                    alt="Product"
                  />
                </div>
                <p className="line-clamp-3 text-sm text-black dark:text-white">
                  {product.question}
                </p>
              </div>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="line-clamp-3 text-sm text-black dark:text-white">
                {product.answer}
              </p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="line-clamp-3 text-sm text-black dark:text-white">
                {product.hint}
              </p>
            </div>
          </div>
          <div className="mb-2 px-4 md:px-6 2xl:px-7.5">
            <span className="flex gap-2.5">
              <button
                onClick={() => {
                  setOpenDeleteModal(true);
                  setQuestion({
                    ...question,
                    questionId: product.id,
                  });
                }}
                type="button"
                className="flex items-center gap-1 text-sm hover:text-primary"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() =>
                  setQuestion({
                    ...question,
                    question: product.question,
                    answer: product.answer,
                    hint: product.hint,
                    questionId: product.id,
                    image: product.imageUrl,
                  })
                }
                type="button"
                className="flex items-center gap-1 text-sm hover:text-primary"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit
              </button>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
