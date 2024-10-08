import { UIStore } from '@/store/UIStore'
import clsx from 'clsx'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { FaIcon } from './FaIcon'
import { faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'

export function Guide() {
  const project = UIStore.useState((s) => s.project)
  const exercises = UIStore.useState((s) => s.exercises)
  const [tab, setTab] = useState(0)

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="h-full flex flex-col">
          <div className="border-b border-gray-200 hidden">
            <button
              className={clsx(
                'border-r-2 border-r-gray-200 px-4 py-1',
                tab == 0 ? 'bg-pink-200' : 'hover:bg-pink-100',
              )}
              onClick={() => {
                setTab(0)
              }}
            >
              Beschreibung
            </button>
            <button
              className={clsx(
                'border-r-2 border-r-gray-200 px-4 py-1',
                tab == 1 ? 'bg-pink-200' : 'hover:bg-pink-100',
              )}
              onClick={() => {
                setTab(1)
              }}
            >
              Erkunden (0/3)
            </button>
            <button
              className={clsx(
                'px-4 border-r-2 border-r-gray-200 py-1',
                tab == 2 ? 'bg-pink-200' : 'hover:bg-pink-100',
              )}
              onClick={() => {
                setTab(2)
              }}
            >
              Challenges (0/4)
            </button>
          </div>
          <div className="overflow-auto px-2 relative">
            <div className="absolute right-2 top-2">
              <button
                className="bg-gray-100 hover:bg-gray-200 w-7 h-7 rounded"
                onClick={() => {
                  UIStore.update((s) => {
                    s.showEditMetaTab = true
                    s.editMeta = true
                  })
                }}
              >
                <FaIcon icon={faPencil} />
              </button>
            </div>
            {tab == 0 && (
              <div className="prose mt-3 prose-p:text-gray-900 prose-li:text-gray-900 prose-code:before:content-none prose-code:after:content-none max-w-none">
                <h2 className="mr-10">{project!.title}</h2>
                <Markdown>{project!.description}</Markdown>
              </div>
            )}
            <div className="mt-12">
              {exercises.map((ex) => (
                <div key={ex.className} className="border rounded p-3 mb-4">
                  <h3 className="font-bold text-xl mb-3">{ex.title}</h3>
                  <Markdown>{ex.description}</Markdown>
                  <div className="mt-3">
                    Status:{' '}
                    {ex.status === true ? (
                      <span className="text-green-600">
                        abgeschlossen <FaIcon icon={faCheck} />
                      </span>
                    ) : ex.status === null ? (
                      <span className="text-gray-400">---</span>
                    ) : (
                      <span className="text-gray-700">{ex.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
