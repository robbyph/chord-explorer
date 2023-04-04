import React from 'react';

const YoutubeLazyLoad = ({ vidLink }) => {
  return (
    <iframe
      className='h-full'
      srcDoc={
        '<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href="https://www.youtube.com/embed/' +
        vidLink.match(/(?:\/embed\/|v=)([\w-]{11})(?:\S+)?/)[1] +
        '"><img src="https://i.ytimg.com/vi/' +
        vidLink.match(/(?:\/embed\/|v=)([\w-]{11})(?:\S+)?/)[1] +
        '/hqdefault.jpg" alt="Video Submission"><span>▶</span></a>'
      }
      frameBorder='0'
      allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
      title='Video Submission'
    />
  );
};

export default YoutubeLazyLoad;
