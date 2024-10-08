import { projects } from '@/content/projects'
import { Project } from '@/data/types'
import { useEffect, useState } from 'react'
import { Spinner } from './Spinner'
import { loadProject } from '@/actions/load-project'
import graph from '../../content/graph.json'
import { useJavaRuntime } from './JavaRuntime'
import { FaIcon } from './FaIcon'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { UIStore } from '@/store/UIStore'

export function Home() {
  const [local, setLocal] = useState<[string, Project][] | null>(null)
  const runtime = useJavaRuntime()
  const inAction = UIStore.useState((s) => s.inAction)

  useEffect(() => {
    if (window.location.hash == '#graph') {
      loadProject(graph as Project, runtime.getRuntime())
      return
    }
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('purplej_project_'),
    )
    const locals: [string, Project][] = keys.map((key) => {
      return [key.split('_')[2], JSON.parse(localStorage.getItem(key)!)]
    })
    locals.sort((a, b) => b[1].lastUpdated - a[1].lastUpdated)

    setLocal(locals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAction])

  return (
    <>
      <div>
        <div className="flex justify-center">
          <h1 className="mt-5 text-3xl px-4 py-3 bg-purple-700 rounded-xl text-white">
            PurpleJ
          </h1>
        </div>
        <div className="max-w-[600px] lg:max-w-[1000px] flex mx-auto mt-9 items-start justify-start flex-col lg:flex-row">
          <div className="max-w-[600px] p-3">
            <p>
              Entdecke die objekt-orientiere Programmierung mit Java anhand
              anschaulicher Projekte. Wähle eine Vorlage:
            </p>
            <div className="bg-purple-100 rounded-lg px-3 py-0.5 mt-6">
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="my-4 bg-white py-2 px-3 rounded hover:bg-gray-100 cursor-pointer"
                  tabIndex={0}
                  onClick={() => {
                    loadProject(p, runtime.getRuntime())
                  }}
                >
                  <h2 className="font-bold">{p.title}</h2>
                  <p className="mt-2 text-sm text-gray-700">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 ml-3 lg:ml-12">
            <p className="mb-12">
              <button
                className="py-0.5 px-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'

                  const reader = new FileReader()
                  reader.addEventListener('load', (e) => {
                    if (
                      e.target != null &&
                      typeof e.target.result === 'string'
                    ) {
                      try {
                        const project = JSON.parse(e.target.result) as Project
                        loadProject(project, runtime.getRuntime())
                      } catch (e) {
                        console.log(e)
                        alert('Projekt konnte nicht geladen werden')
                      }
                    }
                  })

                  input.addEventListener('change', () => {
                    if (input.files != null) {
                      const file = input.files[0]
                      reader.readAsText(file)
                    }
                  })

                  const evt = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                  })

                  input.dispatchEvent(evt)
                }}
              >
                Projekt aus Datei laden ...
              </button>
            </p>
            {local == null ? (
              <p className="">
                <Spinner />
              </p>
            ) : local.length > 0 ? (
              <>
                <p className="">Deine Projekte:</p>
                <ul className="mt-3 list-disc list-inside">
                  {local.map(([key, p]) => renderLink(p, key))}
                </ul>
              </>
            ) : (
              <p className="italic text-gray-600">
                Du hast noch keine eigenen Projekte.
              </p>
            )}
          </div>
        </div>
        <div className="max-w-[600px] p-3 mx-auto mt-9">
          <p className="mt-[200px]">
            Das Projekt wird ermöglicht durch Technologie von{' '}
            <a
              href="https://cheerpj.com/"
              target="_blank"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              CheerpJ
            </a>
            .
          </p>
          <img
            src="/CheerpJ_Horizontal_Trans.png"
            alt="CheerpJ Logo"
            className="px-3 py-3 h-[60px] mt-3"
          />
        </div>
      </div>
    </>
  )

  function renderLink(project: Project, id: string) {
    return (
      <li key={id}>
        <button
          className="text-purple-600 hover:underline cursor-pointer"
          onClick={() => {
            loadProject(project, runtime.getRuntime(), id)
          }}
        >
          {project.title} [{new Date(project.lastUpdated).toLocaleString()}]
        </button>
        <button
          onClick={() => {
            UIStore.update((s) => {
              s.inAction = true
            })
            localStorage.removeItem(`purplej_project_${id}`)
            setTimeout(() => {
              UIStore.update((s) => {
                s.inAction = false
              })
            }, 10)
          }}
        >
          <FaIcon icon={faTrash} />
        </button>
      </li>
    )
  }
}
