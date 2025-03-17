export function Sidebar() {
    return (
      <div className="w-64 bg-white shadow-md p-4">
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Popular</h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">
              <span className="w-6 h-6 flex items-center justify-center">🏈</span>
              <span>NFL</span>
            </li>
            <li className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">
              <span className="w-6 h-6 flex items-center justify-center">🏈</span>
              <span>NCAA</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-3">Sports</h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm hover:bg-gray-100 p-2 rounded cursor-pointer">
              <span className="w-6 h-6 flex items-center justify-center">🏈</span>
              <span>American Football</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

