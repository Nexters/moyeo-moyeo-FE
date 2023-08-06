import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import { css } from '@/styled-system/css';
import { vstack } from '@/styled-system/patterns';

const CommonLayout = () => {
  const [, rerender] = useState(0);

  // 1920 * 1080 화면비로 구현한 걸, 현재 화면비에 맞게 조정
  // 1920 : px = innerWidth : x
  const fit = (px: number) => {
    return (window.innerWidth * px) / 1920;
  };
  // 1920 * 1080 화면비에서 x, y 좌표를 받아서 현재 화면비에 맞게 조정
  // 1920 : x = innerWidth : x'
  // 1080 : y = height(= (innerWidth * 1080) / 1920) : y'
  const fitCoord = (x: number, y: number) => {
    const height = (window.innerWidth * 1080) / 1920;
    return {
      x: (window.innerWidth * x) / 1920,
      y: (height * y) / 1080,
    };
  };

  useEffect(() => {
    const handleResize = () => rerender(Date.now());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={css({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: '#290C60',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'auto',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            width: '100%',
            aspectRatio: '1.78',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          })}
        >
          <div
            style={{ width: fit(1330), height: fit(1330) }}
            className={css({
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'linear-gradient(180deg, #3B04B9 0%, rgba(59, 4, 185, 0.00) 100%)',
              filter: 'blur(15px)',
            })}
          />
          <div
            style={{ width: fit(956), height: fit(956) }}
            className={css({
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background:
                'linear-gradient(180deg, #6824EB 0%, rgba(104, 36, 235, 0.00) 100%)',
              filter: 'blur(10px)',
            })}
          />
          {Stars.map(({ size, x, y, rotate }, index) => (
            <Star
              key={index}
              size={fit(size)}
              {...fitCoord(x, y)}
              rotate={rotate}
            />
          ))}
        </div>
      </div>

      <main
        className={vstack({
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'scroll',
        })}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default CommonLayout;

type StarProps = {
  size: number;
  x: number;
  y: number;
  rotate: number;
};

const Stars: StarProps[] = [
  // 왼쪽 별들
  { size: 70, x: 250, y: 70, rotate: 15 },
  { size: 136, x: 100, y: 186, rotate: -30 },
  { size: 236, x: 430, y: 220, rotate: 15 },
  { size: 544, x: -5, y: 434, rotate: 45 },

  // 오른쪽 별들
  { size: 86, x: 1748, y: 32, rotate: 15 },
  { size: 136, x: 1470, y: 145, rotate: -30 },
  { size: 324, x: 1430, y: 521, rotate: 15 },
  { size: 174, x: 1682, y: 813, rotate: -30 },
];

const Star = ({ size, x, y, rotate }: StarProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        transform: `rotate(${rotate}deg)`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 156 151"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_387_30861)">
          <path
            d="M73.2732 23.9893C74.9811 19.8828 80.7984 19.8828 82.5064 23.9893L94.7032 53.3139C95.4232 55.0451 97.0513 56.2279 98.9202 56.3778L130.579 58.9158C135.012 59.2712 136.81 64.8038 133.432 67.6971L109.311 88.3588C107.888 89.5785 107.266 91.4924 107.701 93.3162L115.07 124.209C116.102 128.536 111.396 131.955 107.6 129.637L80.496 113.082C78.896 112.104 76.8836 112.104 75.2835 113.082L48.1795 129.637C44.384 131.955 39.6777 128.536 40.7097 124.209L48.0788 93.3162C48.5139 91.4924 47.892 89.5785 46.4681 88.3588L22.3477 67.6971C18.97 64.8038 20.7677 59.2712 25.2009 58.9158L56.8593 56.3778C58.7283 56.2279 60.3563 55.0451 61.0764 53.3139L73.2732 23.9893Z"
            fill="#7D38CA"
          />
        </g>
        <path
          d="M73.2732 36.9414C74.9812 32.835 80.7984 32.835 82.5064 36.9414L91.2772 58.0291C91.9973 59.7603 93.6253 60.9431 95.4943 61.093L118.26 62.9181C122.693 63.2735 124.491 68.806 121.113 71.6994L103.768 86.5574C102.344 87.7772 101.722 89.6911 102.157 91.5148L107.457 113.731C108.489 118.057 103.782 121.476 99.9868 119.158L80.496 107.253C78.896 106.275 76.8836 106.275 75.2835 107.253L55.7927 119.158C51.9972 121.476 47.291 118.057 48.3229 113.731L53.6221 91.5148C54.0572 89.6911 53.4353 87.7772 52.0114 86.5574L34.6662 71.6994C31.2885 68.806 33.0861 63.2735 37.5194 62.9181L60.2853 61.093C62.1542 60.9431 63.7823 59.7603 64.5023 58.0291L73.2732 36.9414Z"
          fill="url(#paint0_radial_387_30861)"
        />
        <defs>
          <filter
            id="filter0_f_387_30861"
            x="0.593384"
            y="0.90918"
            width="154.593"
            height="149.476"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="10"
              result="effect1_foregroundBlur_387_30861"
            />
          </filter>
          <radialGradient
            id="paint0_radial_387_30861"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(77.8898 80.8894) rotate(90) scale(55.0476)"
          >
            <stop stopColor="#FAFBE2" />
            <stop offset="1" stopColor="#EFD7C2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
