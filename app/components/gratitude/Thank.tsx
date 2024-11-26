import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

export default function Thank(props: { index: number; item: any; children?: ReactNode }) {
  return (
    <div
      className={twMerge(
        'w-full p-4 border-b transition-colors hover:bg-blue-50',
        props.index % 2 === 0 && 'bg-gray-50',
        props.index % 2 !== 0 && 'bg-white',
      )}
    >
      <div className="h-full flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col justify-center flex-1">
          <h3 className={twMerge('font-semibold text-gray-900', props.item.title && 'mb-2')}>
            {props.item.title}
          </h3>
          <p className="text-gray-700 mb-2">{props.item.description}</p>
          <p className="text-xs text-gray-500 text-right">
            {dayjs(props.item.createdAt).format('DD [ de] MMM [de] YY')}
          </p>
        </div>
        {props.children}
      </div>
    </div>
  )
}
