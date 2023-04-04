import { useRef } from 'react';

// thumbnailQuality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault'

export default function YouTubeFrame({ video, width, height, playable }) {
  const divRef = useRef(null);

  const thumbnailQuality = 'sddefault';

  //if the user has given a value for playable, use that value, otherwise use true
  playable = playable != undefined ? playable : true;

  video = video
    ? video.match(/(?:\/embed\/|v=)([\w-]{11})(?:\S+)?/)[1]
    : 'ScMzIvxBSi4';

  const onClick = () => {
    if (playable) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '1');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
      iframe.style.width = width ? width : '350px';
      iframe.style.height = height ? height : '14rem';
      iframe.setAttribute(
        'src',
        `https://www.youtube.com/embed/${video}?rel=0&showinfo=1&autoplay=1`
      );
      if (divRef.current) {
        divRef.current.innerHTML = '';
        divRef.current.appendChild(iframe);
      }
    } else {
      return;
    }
  };

  return (
    <div
      ref={divRef}
      className={`relative  ${playable ? 'cursor-pointer' : ''}`}
    >
      <span
        onClick={onClick}
        className='absolute left-1/2 top-1/2'
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <svg version='1.1' viewBox='0 0 68 48' width='60' height='60'>
          <path
            d='M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z'
            fill='#f00'
          ></path>
          <path d='M 45,24 27,14 27,34' fill='#fff'></path>
        </svg>
      </span>
      <img
        onClick={onClick}
        loading='lazy'
        src={`https://img.youtube.com/vi/${video}/${thumbnailQuality}.jpg`}
        alt='YouTube Video Thumbnail'
        className='w-full object-cover object-center sm:h-[10rem] lg:h-[12rem] xl:h-[14rem]'
      />
    </div>
  );
}
