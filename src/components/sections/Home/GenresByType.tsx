"use client";

import MoviePosterCard from "@/components/sections/Movie/Cards/Poster";
import TvShowPosterCard from "@/components/sections/TV/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { tmdb } from "@/api/tmdb";
import useLanguage from "@/hooks/useLanguage";
import { Spinner } from "@heroui/react";
import { UseQueryResult, useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Genre } from "tmdb-ts";

const preferredGenreOrder = [
  "Action",
  "Action & Adventure",
  "Comedy",
  "Horror",
  "Drama",
  "Thriller",
  "Romance",
  "Crime",
  "Adventure",
  "Animation",
  "Family",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Documentary",
];

const sortGenres = (genres: Genre[]) => {
  const orderMap = new Map(preferredGenreOrder.map((name, index) => [name.toLowerCase(), index]));
  return [...genres].sort((a, b) => {
    const orderA = orderMap.get(a.name.toLowerCase()) ?? Number.POSITIVE_INFINITY;
    const orderB = orderMap.get(b.name.toLowerCase()) ?? Number.POSITIVE_INFINITY;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });
};

const GenresByType: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as "en-US" | "ar-SA";

  const movieGenresQuery = useQuery({
    queryKey: ["genre-list-movies", language],
    queryFn: () => tmdb.genres.movies({ language: lang }),
  });

  const tvGenresQuery = useQuery({
    queryKey: ["genre-list-tv", language],
    queryFn: () => tmdb.genres.tvShows({ language: lang }),
  });

  const movieGenres = useMemo(
    () => sortGenres(movieGenresQuery.data?.genres ?? []),
    [movieGenresQuery.data?.genres],
  );
  const tvGenres = useMemo(
    () => sortGenres(tvGenresQuery.data?.genres ?? []),
    [tvGenresQuery.data?.genres],
  );

  // Group movie content by genre so each section mirrors the homepage cards layout.
  const movieGenreQueries = useQueries({
    queries: movieGenres.map((genre) => ({
      queryKey: ["genre-movies", genre.id, language],
      queryFn: () =>
        tmdb.discover.movie({
          with_genres: String(genre.id),
          sort_by: "popularity.desc",
          language: lang,
          page: 1,
        }),
      enabled: movieGenres.length > 0,
    })),
  });

  // Repeat the same grouping pattern for TV shows to keep parity with movies.
  const tvGenreQueries = useQueries({
    queries: tvGenres.map((genre) => ({
      queryKey: ["genre-tv", genre.id, language],
      queryFn: () =>
        tmdb.discover.tvShow({
          with_genres: String(genre.id),
          sort_by: "popularity.desc",
          language: lang,
          page: 1,
        }),
      enabled: tvGenres.length > 0,
    })),
  });

  const renderGenreSection = (genre: Genre, query: UseQueryResult<any>, type: "movie" | "tv") => {
    if (!query.data && query.isPending) {
      return (
        <section key={`${type}-${genre.id}`} className="flex flex-col gap-3">
          <SectionTitle>{genre.name}</SectionTitle>
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" variant="wave" color={type === "movie" ? "primary" : "warning"} />
          </div>
        </section>
      );
    }

    const results = query.data?.results ?? [];
    if (results.length === 0) return null;

    return (
      <section key={`${type}-${genre.id}`} className="flex flex-col gap-3">
        <SectionTitle>{genre.name}</SectionTitle>
        <div className="movie-grid">
          {results.slice(0, 12).map((item) =>
            type === "movie" ? (
              <MoviePosterCard key={`movie-${genre.id}-${item.id}`} movie={item} variant="bordered" />
            ) : (
              <TvShowPosterCard key={`tv-${genre.id}-${item.id}`} tv={item} variant="bordered" />
            ),
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <SectionTitle>Movies by Genre</SectionTitle>
        <div className="flex flex-col gap-8">
          {movieGenres.map((genre, index) =>
            renderGenreSection(genre, movieGenreQueries[index], "movie"),
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <SectionTitle>TV Shows by Genre</SectionTitle>
        <div className="flex flex-col gap-8">
          {tvGenres.map((genre, index) => renderGenreSection(genre, tvGenreQueries[index], "tv"))}
        </div>
      </div>
    </div>
  );
};

export default GenresByType;
