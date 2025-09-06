import HIW1img from '@/images/HIW1img.png'
import HIW2img from '@/images/HIW2img.png'
import HIW3img from '@/images/HIW3img.png'
import HIW4img from '@/images/HIW4img.png'
import VectorImg from '@/images/VectorHIW.svg'
import { Badge } from '@/shared/badge'
import NcImage from '@/shared/NcImage/NcImage'
import Image from 'next/image'
import { FC } from 'react'

export interface SectionHowItWorkProps {
  className?: string
  data?: (typeof DEMO_DATA)[0][]
}

const DEMO_DATA = [
  {
    id: 1,
    img: HIW1img,
    imgDark: HIW1img,
    title: 'Filter & Discover',
    desc: 'Smart filtering and suggestions make it easy to find',
  },
  {
    id: 2,
    img: HIW2img,
    imgDark: HIW2img,
    title: 'Add to bag',
    desc: 'Easily select the correct items and add them to the cart',
  },
  {
    id: 3,
    img: HIW3img,
    imgDark: HIW3img,
    title: 'Fast shipping',
    desc: 'The carrier will confirm and ship quickly to you',
  },
  {
    id: 4,
    img: HIW4img,
    imgDark: HIW4img,
    title: 'Enjoy the product',
    desc: 'Have fun and enjoy your 5-star quality products',
  },
]

const SectionHowItWork: FC<SectionHowItWorkProps> = ({ className = '', data = DEMO_DATA }) => {
  return (
    <div className={`nc-SectionHowItWork ${className}`}>
      <div className="relative grid gap-8 sm:gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16 xl:gap-20">
        <Image className="absolute inset-x-0 top-5 hidden lg:block" src={VectorImg} alt="vector" />
        {data.map((item, index) => (
          <div key={item.id} className="relative mx-auto flex w-full max-w-xs flex-col items-center gap-2">
            <NcImage
              containerClassName="mb-3 sm:mb-4 md:mb-6 lg:mb-10 max-w-[120px] sm:max-w-[140px] mx-auto"
              className="rounded-3xl"
              src={item.img}
              sizes="(max-width: 640px) 120px, 150px"
              alt="HIW"
            />
            <div className="mt-auto text-center px-2">
              <Badge
                color={!index ? 'red' : index === 1 ? 'indigo' : index === 2 ? 'yellow' : 'purple'}
                className="text-xs sm:text-sm"
              >{`Step ${index + 1}`}</Badge>
              <h3 className="mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base font-semibold">{item.title}</h3>
              <span className="mt-2 sm:mt-3 lg:mt-4 block text-xs sm:text-sm leading-5 sm:leading-6 text-neutral-600 dark:text-neutral-400">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionHowItWork
