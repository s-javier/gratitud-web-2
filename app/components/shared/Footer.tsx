export default function Footer(props: { children?: string }) {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <h3 className="font-semibold leading-6 text-white">{props.children}</h3>
        <div className="mb-4 mt-2 flex flex-row justify-center gap-8 text-sm leading-6 text-gray-300">
          <div className="flex flex-row items-center gap-1">
            {/* <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-5 w-5 flex-none text-yellow-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              ></path>
            </svg> */}
            <a href="mailto:hola@condimento.cl">hola@condimento.cl</a>
          </div>
          <div className="flex flex-row items-center gap-1">
            {/* <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-5 w-5 flex-none text-yellow-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              ></path>
            </svg> */}
            <a href="tel:+56985565752">+569 8556 5752</a>
          </div>
        </div>
        <p className="text-sm leading-6 text-gray-300">
          Escríbenos o llámanos si tienes consultas o comentarios.
        </p>
      </div>
    </footer>
  )
}
