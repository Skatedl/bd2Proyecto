

export function Footer() {
    return (
        <footer className="relative bg-blue-800/90  rounded-2xl shadow-xs border border-default m-4">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-body sm:text-center text-white">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
                    <li>
                        <a href="https://github.com/Skatedl" className="text-white hover:text-white focus:outline-2 focus:outline-offset-2 me-4 md:me-6" >Harold Cuesta</a>
                    </li>
                    <li>
                        <a href="https://github.com/JimenezCamiloac" className="text-white hover:text-white focus:outline-2 focus:outline-offset-2">Camilo Jimenez</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;