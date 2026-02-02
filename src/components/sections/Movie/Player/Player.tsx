import { ADS_WARNING_STORAGE_KEY, SpacingClasses } from "@/utils/constants";
import { siteConfig } from "@/config/site";
import useBreakpoints from "@/hooks/useBreakpoints";
import { cn } from "@/utils/helpers";
import { mutateMovieTitle } from "@/utils/movies";
import { getMoviePlayers } from "@/utils/players";
import { Card, Skeleton } from "@heroui/react";
import { useDisclosure, useDocumentTitle, useIdle, useLocalStorage } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useRef } from "react";
import { MovieDetails } from "tmdb-ts/dist/types/movies";
import { usePlayerEvents } from "@/hooks/usePlayerEvents";
const AdsWarning = dynamic(() => import("@/components/ui/overlay/AdsWarning"));
const MoviePlayerHeader = dynamic(() => import("./Header"));
const MoviePlayerSourceSelection = dynamic(() => import("./SourceSelection"));

interface MoviePlayerProps {
  movie: MovieDetails;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const [seen] = useLocalStorage<boolean>({
    key: ADS_WARNING_STORAGE_KEY,
    getInitialValueInEffect: false,
  });

  const players = getMoviePlayers(movie.id, startAt);
  const title = mutateMovieTitle(movie);
  const idle = useIdle(3000);
  const { mobile } = useBreakpoints();
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    "src",
    parseAsInteger.withDefault(0),
  );

  const playerFrameRef = useRef<HTMLIFrameElement>(null);
  const { currentTime, duration } = usePlayerEvents({ saveHistory: true });
  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  const handleSeekBy = (offsetSeconds: number) => {
    const rawTarget = currentTime + offsetSeconds;
    const targetTime =
      duration > 0 ? Math.min(Math.max(rawTarget, 0), duration) : Math.max(rawTarget, 0);

    // Attempt to use native HTML5 currentTime if the embedded player exposes a video element.
    try {
      const videoElement = playerFrameRef.current?.contentDocument?.querySelector("video");
      if (videoElement instanceof HTMLVideoElement) {
        videoElement.currentTime = targetTime;
        return;
      }
    } catch {
      // Cross-origin players may block direct access, so fall back to postMessage.
    }

    playerFrameRef.current?.contentWindow?.postMessage(
      { type: "PLAYER_COMMAND", data: { action: "seek", currentTime: targetTime } },
      "*",
    );
  };

  return (
    <>
      <AdsWarning />

      <div className={cn("relative", SpacingClasses.reset)}>
        <MoviePlayerHeader
          id={movie.id}
          movieName={title}
          onOpenSource={handlers.open}
          onSeekBackward={() => handleSeekBy(-10)}
          onSeekForward={() => handleSeekBy(10)}
          hidden={idle && !mobile}
        />
        <Card shadow="md" radius="none" className="relative h-screen">
          <Skeleton className="absolute h-full w-full" />
          {seen && (
            <iframe
              allowFullScreen
              key={PLAYER.title}
              src={PLAYER.source}
              ref={playerFrameRef}
              className={cn("z-10 h-full", { "pointer-events-none": idle && !mobile })}
            />
          )}
        </Card>
      </div>

      <MoviePlayerSourceSelection
        opened={opened}
        onClose={handlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
    </>
  );
};

MoviePlayer.displayName = "MoviePlayer";

export default MoviePlayer;
