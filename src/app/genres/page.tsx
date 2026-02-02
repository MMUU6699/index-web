import { NextPage } from "next";
import dynamic from "next/dynamic";

const GenresByType = dynamic(() => import("@/components/sections/Home/GenresByType"));

const GenresPage: NextPage = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <GenresByType />
    </div>
  );
};

export default GenresPage;
