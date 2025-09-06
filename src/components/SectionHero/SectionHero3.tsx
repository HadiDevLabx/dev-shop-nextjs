import backgroundLineSvg from '@/images/BackgroundLine.svg'
import heroImage from '@/images/hero-right-4.png'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { FC } from 'react'

interface Props {
  className?: string
}

const SectionHero3: FC<Props> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#F7F0EA] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] ${className}`}>
      <div className="relative inset-x-0 top-1/10 z-10 px-4 pt-6 sm:px-8 sm:pt-8 sm:top-1/5 lg:absolute lg:pt-0">
        <div className="flex max-w-lg flex-col items-start gap-y-4 sm:gap-y-5 xl:max-w-2xl xl:gap-y-8">
          <span className="font-semibold text-neutral-600 text-base sm:text-lg md:text-xl">In this season, find the best 🔥</span>
          <h2 className="text-2xl leading-tight font-bold text-neutral-950 sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Clothing collection.
          </h2>
          <div className="pt-2 sm:pt-5">
            <ButtonPrimary className="w-full sm:w-auto">
              <span className="me-1">Start your search</span>
              <HugeiconsIcon icon={Search01Icon} size={20} className="sm:size-6" />
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <div className="relative lg:aspect-w-16 lg:aspect-h-8 2xl:aspect-h-7">
        <div>
          <div className="end-0 top-0 bottom-0 mt-3 ml-auto w-full max-w-xs sm:mt-5 sm:max-w-md md:max-w-lg lg:absolute lg:mt-0 lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
            <Image
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 50vw"
              className="inset-0 w-full h-auto object-contain object-bottom-right sm:h-full lg:absolute"
              src={heroImage}
              width={heroImage.width}
              height={heroImage.height}
              alt="hero"
              priority
            />
          </div>
        </div>
      </div>

      {/* BG */}
      <div className="absolute inset-10">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          src={backgroundLineSvg}
          alt="hero"
        />
      </div>
    </div>
  )
}

export default SectionHero3
