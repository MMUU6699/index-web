"use client";

import MoviePosterCard from "@/components/sections/Movie/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { QueryList } from "@/types";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import { Movie } from "tmdb-ts/dist/types";
import { tmdb } from "@/api/tmdb";

interface MovieHomeListProps extends QueryList<Movie> {
  language?: string;
}

const MovieHomeList: React.FC<MovieHomeListProps> = ({ query, name, param, language = "en-US" }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const lang = language as "en-US" | "ar-SA";
  
  const { data, isPending } = useQuery({
    queryFn: async () => {
      if (param === "todayTrending") {
        return tmdb.trending.trending("movie", "day", { language: lang });
      } else if (param === "thisWeekTrending") {
        return tmdb.trending.trending("movie", "week", { language: lang });
      } else if (param === "popular") {
        return tmdb.movies.popular({ language: lang });
      } else if (param === "nowPlaying") {
        return tmdb.movies.nowPlaying({ language: lang });
      } else if (param === "upcoming") {
        return tmdb.movies.upcoming({ language: lang });
      } else if (param === "topRated") {
        return tmdb.movies.topRated({ language: lang });
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
            <SectionTitle>{name}</SectionTitle>
            <Link
              size="sm"
              href={`/discover?type=${param}`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel>
            {data?.results.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
                >
                  <MoviePosterCard movie={movie} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default MovieHomeList;
