"use client";

import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";

interface LiveStreamProps {
  isLive?: boolean;
  streamUrl: string;
  className?: string;
}

export default function LiveStream({
  streamUrl,
  isLive = false,
  className = "",
}: LiveStreamProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const videoId = streamUrl ? getYouTubeVideoId(streamUrl) : null;

  useEffect(() => {
    const handleScroll = () => {
      if (streamRef.current) {
        const rect = streamRef.current.getBoundingClientRect();
        setIsPiP(rect.bottom < 0 || rect.top > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!streamUrl || !videoId) {
    return (
      <div
        className={`w-full h-0 pb-[56.25%] relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
          {isLive ? "Livestream will begin shortly" : "No livestream available"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={streamRef}
        className={`w-full h-0 pb-[56.25%] relative bg-black rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0">
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            className="absolute top-0 left-0 w-full h-full"
            iframeClassName="w-full h-full"
            onReady={() => setIsLoaded(true)}
          />
        </div>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            Loading {isLive ? "live stream" : "recording"}...
          </div>
        )}
      </div>
      {isPiP && (
        <div className="fixed bottom-4 right-4 w-64 h-36 bg-black rounded-lg overflow-hidden shadow-lg z-50">
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            className="w-full h-full"
          />
          <Button
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
            size="sm"
            onClick={() => setIsPiP(false)}>
            Close
          </Button>
        </div>
      )}
    </>
  );
}
