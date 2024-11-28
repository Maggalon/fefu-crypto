const BottomMenu = ({ setPage, page }) => {
    return (
        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white/10 custom-blur shadow-2xl rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
              <button data-tooltip-target="tooltip-home" 
                      type="button" 
                      onClick={() => setPage('home')}
                      className={`inline-flex flex-col items-center justify-center px-5 rounded-s-full group`}>
                  {page == 'home' ?
                    <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        className="w-6 h-6 text-white dark:text-gray-400"
                    >
                        <path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
                    </svg>
                     :
                     <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        className="w-6 h-6 text-gray-300 dark:text-gray-400"
                        strokeWidth="4"
                    >
                        <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
                    </svg>
                  }
                  <span className="sr-only">Home</span>
              </button>
              <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                  Home
                  <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
              <button data-tooltip-target="tooltip-wallet" 
                      type="button" 
                      onClick={() => setPage('tokens')}
                      className={`inline-flex flex-col items-center justify-center px-5 group`}>
                  {page == 'tokens' ?
                    <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        className="w-7 h-7 text-white dark:text-gray-400"
                    >
                        <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM704 536c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z" />
                    </svg>
                     :
                     <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        className="w-7 h-7 text-gray-300"
                        >
                        <path d="M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z" />
                        <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z" />
                    </svg>
                  }
                  
                  
                  <span className="sr-only">Tokens</span>
              </button>
              <div id="tooltip-wallet" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                  Wallet
                  <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
              <button data-tooltip-target="tooltip-settings" 
                      type="button" 
                      onClick={() => setPage('feedback')}
                      className={`inline-flex flex-col items-center justify-center px-5 group ${page == 'feedback' ? "" : ""}`}>
                  {page == 'feedback' ?
                    <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        className="w-6 h-6 text-white dark:text-gray-400"
                    >
                        <path d="M512 240c0 114.9-114.6 208-256 208-37.1 0-72.3-6.4-104.1-17.9-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9s-1.1-12.8 3.4-17.4l.3-.3c.3-.3.7-.7 1.3-1.4 1.1-1.2 2.8-3.1 4.9-5.7 4.1-5 9.6-12.4 15.2-21.6 10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240 0 125.1 114.6 32 256 32s256 93.1 256 208z" />
                    </svg>
                     :
                     <svg
                        viewBox="0 0 512 512"
                        fill="currentColor"
                        className="w-6 h-6 text-gray-300 dark:text-gray-400"
                        >
                        <path d="M256 32C114.6 32 .027 125.1.027 240c0 47.63 19.91 91.25 52.91 126.2-14.88 39.5-45.87 72.88-46.37 73.25-6.625 7-8.375 17.25-4.625 26C5.818 474.2 14.38 480 24 480c61.5 0 109.1-25.75 139.1-46.25 28 9.05 60.2 14.25 92.9 14.25 141.4 0 255.1-93.13 255.1-208S397.4 32 256 32zm.1 368c-26.75 0-53.12-4.125-78.38-12.12l-22.75-7.125-19.5 13.75c-14.25 10.12-33.88 21.38-57.5 29 7.375-12.12 14.37-25.75 19.88-40.25l10.62-28-20.62-21.87C69.82 314.1 48.07 282.2 48.07 240c0-88.25 93.25-160 208-160s208 71.75 208 160S370.8 400 256.1 400z" />
                    </svg>
                  }
                  <span className="sr-only">Feedback</span>
              </button>
              <div id="tooltip-settings" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                  Feedback
                  <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
              <button data-tooltip-target="tooltip-profile" 
                      type="button" 
                      onClick={() => setPage('profile')}
                      className={`inline-flex flex-col items-center justify-center px-5 rounded-e-full group ${page == 'profile' ? "" : ""}`}>
                  {page == 'profile' ?
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-7 h-7 text-white dark:text-gray-400"
                    >
                        <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z" />
                    </svg>
                     :
                     <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-7 h-7 text-gray-300 dark:text-gray-400"
                        >
                        <path d="M12 2A10.13 10.13 0 002 12a10 10 0 004 7.92V20h.1a9.7 9.7 0 0011.8 0h.1v-.08A10 10 0 0022 12 10.13 10.13 0 0012 2zM8.07 18.93A3 3 0 0111 16.57h2a3 3 0 012.93 2.36 7.75 7.75 0 01-7.86 0zm9.54-1.29A5 5 0 0013 14.57h-2a5 5 0 00-4.61 3.07A8 8 0 014 12a8.1 8.1 0 018-8 8.1 8.1 0 018 8 8 8 0 01-2.39 5.64z" />
                        <path d="M12 6a3.91 3.91 0 00-4 4 3.91 3.91 0 004 4 3.91 3.91 0 004-4 3.91 3.91 0 00-4-4zm0 6a1.91 1.91 0 01-2-2 1.91 1.91 0 012-2 1.91 1.91 0 012 2 1.91 1.91 0 01-2 2z" />
                    </svg>
                  }
                  <span className="sr-only">Profile</span>
              </button>
              <div id="tooltip-profile" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                  Profile
                  <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
          </div>
      </div>
    )
}

export default BottomMenu;