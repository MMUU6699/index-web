"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardFooter, Spinner, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import useLanguage from "@/hooks/useLanguage";
import Link from "next/link";
import { FaGift, FaPlay, FaStar, FaCalendar, FaClock } from "react-icons/fa6";
import { Movie } from "tmdb-ts/dist/types";

const CHRISTMAS_MOVIES = [
  508442, // Soul
  508947, // Turning Red
  568124, // Encanto
  438631, // Dune
  634649, // Spider-Man: No Way Home
  76600,  // Avatar: The Way of Water
  505642, // Black Panther: Wakanda Forever
  315162, // Puss in Boots: The Last Wish
  502356, // The Super Mario Bros. Movie
  447365, // Guardians of the Galaxy Vol. 3
  569094, // Spider-Man: Across the Spider-Verse
  346698, // Barbie
  872585, // Oppenheimer
  940551, // Migration
  1022789, // Inside Out 2
  533535, // Deadpool & Wolverine
  519182, // Despicable Me 4
  748783, // The Garfield Movie
  1011985, // Kung Fu Panda 4
  150540, // Inside Out
  585511, // Wish
  614930, // Teenage Mutant Ninja Turtles: Mutant Mayhem
  1022796, // Wonka
  787699, // Wonka
  940721, // Godzilla x Kong: The New Empire
  693134, // Dune: Part Two
  823464, // Godzilla Minus One
  1096197, // No Way Up
  1072790, // Anyone But You
  1011316, // Harold and the Purple Crayon
];

const NewYearContent: React.FC = () => {
  const { language } = useLanguage();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showGift, setShowGift] = useState(true);
  const [giftOpened, setGiftOpened] = useState(false);

  const { data: movieData, isLoading, refetch } = useQuery({
    queryKey: ["santa-gift-movie", language],
    queryFn: async () => {
      const randomId = CHRISTMAS_MOVIES[Math.floor(Math.random() * CHRISTMAS_MOVIES.length)];
      const movie = await tmdb.movies.details(randomId, undefined, language);
      return movie as unknown as Movie;
    },
    enabled: false,
  });

  useEffect(() => {
    if (movieData) {
      setSelectedMovie(movieData);
    }
  }, [movieData]);

  const handleOpenGift = async () => {
    setIsRevealing(true);
    setGiftOpened(true);
    await refetch();
    setTimeout(() => {
      setShowGift(false);
      setIsRevealing(false);
    }, 2000);
  };

  const handleNewGift = async () => {
    setShowGift(true);
    setGiftOpened(false);
    setSelectedMovie(null);
    setTimeout(async () => {
      setIsRevealing(true);
      setGiftOpened(true);
      await refetch();
      setTimeout(() => {
        setShowGift(false);
        setIsRevealing(false);
      }, 2000);
    }, 500);
  };

  const posterUrl = selectedMovie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
    : "/placeholder.png";

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center gap-8 overflow-hidden px-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      {/* Title */}
      <div className="z-10 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
          🎄 Happy New Year 2026! 🎄
        </h1>
        <p className="text-lg text-default-500 md:text-xl">
          🎅 Santa has a special movie gift for you! 🎁
        </p>
      </div>

      {/* Gift Box or Movie Card */}
      {showGift ? (
        <div className="z-10 flex flex-col items-center gap-6">
          <div
            className={`relative cursor-pointer transition-all duration-500 ${
              giftOpened ? "scale-110 animate-pulse" : "hover:scale-105"
            } ${isRevealing ? "animate-bounce" : ""}`}
            onClick={!giftOpened ? handleOpenGift : undefined}
          >
            {/* Gift Box */}
            <div className="relative">
              {/* Box body */}
              <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-red-600 to-red-700 shadow-2xl md:h-52 md:w-52">
                {/* Ribbon vertical */}
                <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-gradient-to-b from-yellow-400 to-yellow-500" />
                {/* Ribbon horizontal */}
                <div className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500" />
                {/* Bow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -left-6 -top-3 h-8 w-8 rotate-45 rounded-full bg-yellow-400" />
                    <div className="absolute -right-6 -top-3 h-8 w-8 -rotate-45 rounded-full bg-yellow-400" />
                    <div className="relative z-10 h-6 w-6 rounded-full bg-yellow-500" />
                  </div>
                </div>
              </div>
              {/* Sparkles */}
              <div className="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-4 text-xl animate-pulse delay-100">⭐</div>
              <div className="absolute -right-2 bottom-4 text-lg animate-pulse delay-200">🌟</div>
            </div>
          </div>
          
          {!giftOpened && (
            <Button
              color="danger"
              size="lg"
              variant="shadow"
              startContent={<FaGift className="text-xl" />}
              onPress={handleOpenGift}
              className="animate-pulse font-bold"
            >
              Open Santa&apos;s Gift! 🎅
            </Button>
          )}
          
          {isRevealing && (
            <div className="flex items-center gap-2">
              <Spinner color="danger" size="sm" />
              <span className="text-default-500">Santa is choosing a movie for you...</span>
            </div>
          )}
        </div>
      ) : selectedMovie ? (
        <Card className="z-10 w-full max-w-4xl bg-content1/80 backdrop-blur-md">
          <CardBody className="flex flex-col gap-6 p-6 md:flex-row">
            {/* Movie Poster */}
            <div className="relative mx-auto w-48 shrink-0 md:mx-0 md:w-64">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-red-500 via-green-500 to-red-500 opacity-75 blur-lg" />
              <Image
                src={posterUrl}
                alt={selectedMovie.title}
                className="relative z-10 rounded-lg shadow-2xl"
                width={256}
                height={384}
              />
              {/* Santa badge */}
              <div className="absolute -right-4 -top-4 z-20 rounded-full bg-red-500 p-2 text-2xl shadow-lg">
                🎅
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">{selectedMovie.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-default-500">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {selectedMovie.vote_average?.toFixed(1)} / 10
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar className="text-primary" />
                    {selectedMovie.release_date}
                  </span>
                  {(selectedMovie as unknown as { runtime?: number }).runtime && (
                    <span className="flex items-center gap-1">
                      <FaClock className="text-success" />
                      {(selectedMovie as unknown as { runtime: number }).runtime} min
                    </span>
                  )}
                </div>
              </div>

              <p className="line-clamp-4 text-default-600 md:line-clamp-6">
                {selectedMovie.overview || "No description available."}
              </p>

              <div className="mt-auto flex flex-wrap gap-3">
                <Link href={`/movie/${selectedMovie.id}`}>
                  <Button
                    color="success"
                    size="lg"
                    variant="shadow"
                    startContent={<FaPlay />}
                    className="font-bold"
                  >
                    Watch Now 🎬
                  </Button>
                </Link>
                <Button
                  color="danger"
                  size="lg"
                  variant="bordered"
                  startContent={<FaGift />}
                  onPress={handleNewGift}
                >
                  Get Another Gift 🎁
                </Button>
              </div>
            </div>
          </CardBody>
          <CardFooter className="justify-center border-t border-divider bg-content2/50 py-4">
            <p className="text-center text-sm text-default-500">
              🎄 Merry Christmas & Happy New Year from <span className="font-bold text-primary">index</span>! 🎄
            </p>
          </CardFooter>
        </Card>
      ) : (
        <div className="z-10 flex items-center gap-2">
          <Spinner color="danger" size="lg" />
          <span className="text-default-500">Loading your gift...</span>
        </div>
      )}

      {/* Decorative elements */}
      <div className="z-10 mt-8 flex flex-wrap justify-center gap-4 text-4xl">
        <span className="animate-bounce delay-100">🎄</span>
        <span className="animate-bounce delay-200">🎅</span>
        <span className="animate-bounce delay-300">🎁</span>
        <span className="animate-bounce delay-400">⛄</span>
        <span className="animate-bounce delay-500">🦌</span>
        <span className="animate-bounce delay-600">🔔</span>
        <span className="animate-bounce delay-700">🌟</span>
      </div>

      {/* New Year countdown or message */}
      <div className="z-10 mt-4 text-center">
        <p className="text-lg text-default-400">
          ✨ Wishing you joy, happiness, and great movies in 2026! ✨
        </p>
      </div>
    </div>
  );
};

export default NewYearContent;
