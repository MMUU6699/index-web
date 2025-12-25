"use client";

import TvShowHomeCard from "@/components/sections/TV/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { QueryList } from "@/types";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import { TV } from "tmdb-ts/dist/types";
import { tmdb } from "@/api/tmdb";

interface TvShowHomeListProps extends QueryList<TV> {
  language?: string;
}

const TvShowHomeList: React.FC<TvShowHomeListProps> = ({ query, name, param, language = "en-US" }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const lang = language as "en-US" | "ar-SA";
  
  const { data, isPending } = useQuery({
    queryFn: async () => {
      if (param === "todayTrending") {
        return tmdb.trending.trending("tv", "day", { language: lang });
      } else if (param === "thisWeekTrending") {
        return tmdb.trending.trending("tv", "week", { language: lang });
      } else if (param === "popular") {
        return tmdb.tvShows.popular({ language: lang });
      } else if (param === "onTheAir") {
        return tmdb.tvShows.onTheAir({ language: lang });
      } else if (param === "topRated") {
        return tmdb.tvShows.topRated({ language: lang });
      }
      return query();
    },
    queryKey: [key, language],
    enabled: inViewport,
  });

  return (
    <section id={key} className="min-h-[250px] md:min-h-[300px]" ref={ref}>
      {isPending ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex grow items-center justify-between">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
        </div>
      ) : (
        <div className="z-3 flex flex-col gap-2">
          <div className="flex grow items-center justify-between">
            <SectionTitle color="warning">{name}</SectionTitle>
            <Link
              size="sm"
              href={`/discover?type=${param}&content=tv`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel>
            {data?.results.map((tv) => (
              <div
                key={tv.id}
                className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
              >
                <TvShowHomeCard tv={tv as TV} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default TvShowHomeList;
