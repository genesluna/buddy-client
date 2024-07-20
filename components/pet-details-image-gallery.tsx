import noImg from '@/assets/noimg.webp';
import { Pet } from '@/lib/models/pet';
import { useState } from 'react';
import Image from 'next/image';

interface ImgGalleryProps {
  pet: Pet;
}

export default function PetDetailsImgageGallery({ pet }: ImgGalleryProps) {
  const [mainImg, setMainImg] = useState<string>('');

  function handleImgChange(e: EventTarget) {
    // Can't use the src attribute because of the way Next.js Image component works
    const imgAlt = (e as HTMLImageElement).getAttribute('alt') as string;

    if (imgAlt === 'pet avatar') {
      setMainImg(pet.avatar);
      return;
    }

    const imgNumber = imgAlt.split(' ')[2] as unknown as number;

    const src = pet?.images[imgNumber - 1]?.imageUrl
      ? pet.images[imgNumber - 1].imageUrl
      : noImg;

    if (src === noImg) {
      return;
    }

    setMainImg(src.toString());
  }

  return (
    <>
      <div className='h-full w-full overflow-hidden'>
        <Image
          src={mainImg || pet.avatar}
          width={480}
          height={320}
          alt='pet main image'
          className='aspect-video h-full w-full rounded-3xl object-cover object-top'
          priority
        />
      </div>
      <div className='flex w-full items-center justify-between 2xl:h-full 2xl:w-40 2xl:flex-col'>
        <Image
          src={pet?.avatar}
          width={150}
          height={150}
          onClick={({ target }) => handleImgChange(target)}
          alt='pet avatar'
          className={`2xl:w-30 2xl:h-30 aspect-square h-14 w-14 cursor-pointer rounded-full object-cover transition ease-in-out hover:-translate-y-1 hover:shadow-xl sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-3xl lg:h-36 lg:w-36 xl:h-28 xl:w-28`}
        />
        {Array.from({ length: 3 }).map((_, index) => (
          <Image
            key={index}
            src={
              pet?.images?.length > index ? pet.images[index].imageUrl : noImg
            }
            width={150}
            height={150}
            onClick={({ target }) => handleImgChange(target)}
            alt={`pet photo ${index + 1}`}
            className={`2xl:w-30 2xl:h-30 aspect-square h-14 w-14 cursor-pointer rounded-full object-cover transition ease-in-out hover:-translate-y-1 hover:shadow-xl sm:h-20 sm:w-20 md:h-24 md:w-24 md:rounded-3xl lg:h-36 lg:w-36 xl:h-28 xl:w-28`}
          />
        ))}
      </div>
    </>
  );
}
