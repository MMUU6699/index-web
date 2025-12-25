import { siteConfig } from "@/config/site";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const NewYearContent = dynamic(() => import("@/components/sections/NewYear/NewYearContent"));

export const metadata: Metadata = {
  title: `New Year | ${siteConfig.name}`,
  description: "Celebrate the New Year with a special movie gift from Santa!",
};

const NewYearPage: NextPage = () => {
  return <NewYearContent />;
};

export default NewYearPage;
