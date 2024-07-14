import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr';

export default function SocialIcons() {
  return (
    <div className='mt-4 flex gap-4'>
      <a
        href='#'
        className='transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg'
      >
        <FacebookLogo size={24} color='#fff' />
      </a>
      <a
        href='#'
        className='transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg'
      >
        <LinkedinLogo size={24} color='#fff' />
      </a>
      <a
        href='#'
        className='transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg'
      >
        <YoutubeLogo size={24} color='#fff' />
      </a>
      <a
        href='#'
        className='transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg'
      >
        <InstagramLogo size={24} color='#fff' />
      </a>
    </div>
  );
}
