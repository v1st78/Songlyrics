import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLanguages, fetchLyrics, fetchSong } from "../api/songs";
import Lyrics, { LyricsSkeleton } from "../components/SongPage/Lyrics";
import SelectDisplayMode from "../components/SongPage/SelectDisplayMode";
import SelectAlign from "../components/SongPage/SelectAlign";
import ReverseButton from "../components/SongPage/ReverseButton";
import SelectLanguage from "../components/SongPage/SelectLanguage";
import Skeleton from "react-loading-skeleton";
import { Song } from "../lib/definitons";

function SongPage() {
  const { id } = useParams();

  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem("displayMode") || "1",
  );
  const [align, setAlign] = useState(localStorage.getItem("align") || "Left");
  const [isReversed, setIsReversed] = useState(
    JSON.parse(localStorage.getItem("isReversed") || "false"),
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "en",
  );

  const {
    data: song,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["song", id],
    queryFn: fetchSong,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  const { data: lyrics, isLoading: isLyricsLoading } = useQuery({
    queryKey: ["lyrics", song?.url || "", selectedLanguage],
    queryFn: fetchLyrics,
  });

  useEffect(() => {
    if (!song) return;

    const lastSongsRaw = localStorage.getItem("lastSongs");
    let lastSongs: Song[] = lastSongsRaw ? JSON.parse(lastSongsRaw) : [];

    lastSongs = lastSongs.filter((i) => i.id !== song.id);
    lastSongs = lastSongs.length > 9 ? lastSongs.slice(0, 9) : lastSongs;

    const newLastSongs = [song, ...lastSongs];

    localStorage.setItem("lastSongs", JSON.stringify(newLastSongs));
  }, [id, song]);

  if (isError) {
    return <div className="pt-4 text-center text-2xl">Song Not Found</div>;
  }

  if (isLoading)
    return (
      <div className="container py-10">
        {/* header */}
        <div className="mb-4 flex flex-col items-center gap-8 border-b-2 border-indigo-400 pb-6 md:flex-row md:items-start md:border-0 md:pb-0">
          {/* image */}
          <Skeleton height={300} width={300} />
          <div className="flex flex-col md:h-[300px]">
            <div className="flex-1">
              {/* title */}
              <Skeleton className="mb-2" height={35} width={200} />
              {/* artist */}
              <Skeleton className="mb-2" height={20} width={110} />
              {/* album */}
              <Skeleton className="mb-2" height={20} width={160} />
              {/* genius page */}
              <Skeleton className="mb-2" height={20} width={90} />
              {/* release date */}
              <Skeleton className="mb-2" height={20} width={160} />
            </div>

            {/* buttons */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Skeleton height={35} width={120} />
              <Skeleton height={35} width={110} />
              <Skeleton height={35} width={130} />
              <Skeleton height={35} width={140} />
            </div>
          </div>
        </div>

        <LyricsSkeleton displayMode={displayMode} align={align} />
      </div>
    );

  if (song && languages) {
    const albumLinkSplit =
      song.album && song.album.url.toLocaleLowerCase().split("/");
    const albumLink =
      albumLinkSplit &&
      `/album/${albumLinkSplit[albumLinkSplit.length - 2]}/${
        albumLinkSplit[albumLinkSplit.length - 1]
      }`;

    return (
      <div className="container py-10">
        {/* header */}
        <div className="mb-4 flex flex-col items-center gap-8 border-b-2 border-indigo-500 pb-5 md:flex-row md:items-start md:border-0 md:pb-0">
          <img height={300} width={300} src={song.song_art_image_url} alt="" />
          <div className="flex flex-col md:min-h-[300px]">
            <div className="flex-1">
              <div className="mb-2 text-3xl font-bold">{song.title}</div>
              <Link
                to={`/artist/${song.primary_artist.id}`}
                className="underline"
              >
                {song.primary_artist.name}
              </Link>

              <div className="my-2">
                {!!song.featured_artists.length && (
                  <>
                    <span>Featuring: &nbsp;</span>
                    {song.featured_artists.map((artist, index) => (
                      <Link
                        key={artist.id}
                        to={`/artist/${artist.id}`}
                        className="underline"
                      >
                        {artist.name +
                          (song.featured_artists.length - 1 === index
                            ? ""
                            : ", ")}
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {song.album && (
                <div className="mb-2">
                  Album:{" "}
                  <Link className="underline" to={albumLink!}>
                    {song.album.name}
                  </Link>
                </div>
              )}

              <div className="mb-2">
                <Link target="_blank" to={song.url} className="underline">
                  Genius Page
                </Link>
              </div>

              {song.release_date_for_display && (
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <div> {song.release_date_for_display} </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <SelectDisplayMode onChange={setDisplayMode} />
              <SelectAlign onChange={setAlign} />
              <ReverseButton
                isReversed={isReversed}
                setIsReversed={setIsReversed}
              />
              <SelectLanguage
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                languages={languages}
              />
            </div>
          </div>
        </div>

        {isLyricsLoading && (
          <LyricsSkeleton displayMode={displayMode} align={align} />
        )}

        {!isLyricsLoading && lyrics && (
          <Lyrics
            displayMode={displayMode}
            align={align}
            isReversed={isReversed}
            lyrics={lyrics.lyrics}
            translatedLyrics={lyrics.translatedLyrics}
          />
        )}

        {lyrics && lyrics.lyrics.length === 0 && (
          <div className="text-center text-2xl">No lyrics for this song</div>
        )}
      </div>
    );
  }
}

export default SongPage;
