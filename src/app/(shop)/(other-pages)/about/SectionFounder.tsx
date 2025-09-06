import Heading from '@/components/Heading/Heading'
import NcImage from '@/shared/NcImage/NcImage'

export interface People {
  id: string
  name: string
  job: string
  avatar: string
}

const FOUNDER_DEMO: People[] = [
  {
    id: '1',
    name: 'Hadi Dev',
    job: 'Founder &  Developer',
    avatar: 'https://images.unsplash.com/photo-1735856941104-e4854bade420?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

const SectionFounder = () => {
  return (
    <div className="nc-SectionFounder relative">
      <Heading
        description="We’re impartial and independent, and every day we create distinctive,
          world-class programmes and content"
      >
        ⛱ Founder
      </Heading>
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {FOUNDER_DEMO.map((item) => (
          <div key={item.id} className="max-w-sm">
            <NcImage
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              containerClassName="relative h-0 aspect-h-1 aspect-w-1 rounded-xl overflow-hidden"
              className="object-cover"
              src={item.avatar}
            />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 md:text-xl dark:text-neutral-200">
              {item.name}
            </h3>
            <span className="block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">{item.job}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionFounder
