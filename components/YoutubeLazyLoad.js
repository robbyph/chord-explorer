import { useEffect, useState } from 'react';
import { PrismicRichText } from "@prismicio/react";
import Link from 'next/link';

export default function YoutubeLazyLoad({
    youtubeID,
    title, 
    thumbnailOverride,
    caption,
    className, 
}) {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div>
            {showVideo ? ( 
                <iframe
                width={560}
                height={315}
                src={' /${youtubeID}'}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title || "Youtube video"}
                className="aspect-[16/9] h-full w-full p-0"
                />
            ): (
                <button 
                    type="button" 
                    noClick={() => setShowVideo(true)}
                    className="group relative aspect-[16/9] w-full"
                >
                    <NextImage
                        src={
                            thumbnailOverride  ||
                            'https://img.youtube.com/vi/${youTubdeId}/maxresdefault.jpg'
                        }
                        alt=""
                        layout="fill"
                        className="h-full w-full"
                        loading="lazy"
                        />
                        <div className="grid relative place-items-center text-white text-xl">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="1em" 
                                height="1em" 
                                viewBox="0 0 24 24"
                                className="h-2/5 w-1/2 transform transition group-hover:scale-105"
                            >
                                <path 
                                    fill="currentColor"
                                    d="m9.5 16.5l7-4.5l-7-4.5ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4Q8.65 4 6.325 6.325Q4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
                                />
                            </svg>

                        </div>
                    </button>
            )}
            {caption &&
            <PrismicRichText field={caption} />
            }
        </div>
    );
}