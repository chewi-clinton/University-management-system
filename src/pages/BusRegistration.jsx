import React from 'react'
import TopBar from '../components/TopBar'
import BottomAction from '../components/BottomAction'

export default function BusRegistration() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-[#101922] shadow-xl">
      <TopBar
        title="Bus Services"
        right={
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-background-light dark:bg-gray-800 text-[#111418] dark:text-white">
            <div
              className="h-10 w-10 rounded-full bg-center bg-cover"
              data-alt="Student profile picture"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBu2LHEoUWndFO1OR4qmc0bGlgLtOD4Q_DERplDUf49cb6JdmV3_unAighvKBMnlHDqDt1nIsRgRw9ETcgvyBtP8nRJwDkWT7jkGzTTo1IvTXK_-D941bChLq5KVJ-oifnahvGtDj4sJcOyU5tQKvzyODdwrvNZieVUNpu03cNSGwf4YDQM2SpGkREW2w8oOYodMDVPz6EtMaTg6KkRcyRPs6KHnynaGnn5lryLiPmVGLTpgTPL9c4MDW4kE_JVbtSexA3LXuWuVPM')",
              }}
            />
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Status Card */}
        <div className="p-4">
          <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[#617589] dark:text-gray-400 text-sm font-medium leading-normal uppercase tracking-wide">Current Status</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500" style={{ fontSize: 20 }}>warning</span>
                  <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight">Not Registered</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined">directions_bus_filled</span>
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">You have no active bus pass for the current term. Register below to secure your seat.</p>
          </div>
        </div>

        {/* Registration Section Header */}
        <div className="px-4 pb-2 pt-2">
          <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Registration Details</h3>
        </div>

        {/* Term Selection */}
        <div className="px-4 py-2">
          <label className="flex flex-col w-full">
            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2">Academic Term</p>
            <div className="relative">
              <select defaultValue="fall2023" className="appearance-none flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#1a2632] h-12 px-4 pr-10 text-base font-normal leading-normal">
                <option disabled value="">Select Term</option>
                <option value="fall2023">Fall Semester 2023</option>
                <option value="spring2024">Spring Semester 2024</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]"><span className="material-symbols-outlined">expand_more</span></div>
            </div>
          </label>
        </div>

        {/* Route Selection */}
        <div className="px-4 py-2">
          <label className="flex flex-col w-full">
            <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2">Preferred Route</p>
            <div className="relative">
              <select defaultValue="routeA" className="appearance-none flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-[#1a2632] h-12 px-4 pr-10 text-base font-normal leading-normal">
                <option disabled value="">Select Route</option>
                <option value="routeA">Route 42: North Campus - Downtown</option>
                <option value="routeB">Route 15: West Dorms - Science Block</option>
                <option value="routeC">Route 09: Central Station - Library</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]"><span className="material-symbols-outlined">expand_more</span></div>
            </div>
          </label>
        </div>

        {/* Selected Route Details */}
        <div className="px-4 py-4">
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632]">
            <div className="h-32 w-full bg-cover bg-center relative" data-alt="Map showing bus route path through city streets" data-location="New York" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQhCt9jm8KW2D_fn-tISOIj7mb4pQfx91vTXqzbf2KnNlIYRd1WqUa-8iF0_tXf-jQsfeX_kGTDzxaRHf93EHLzN-ToOFP6Pj0uEMSZzWfCezQcta8wSOC5aOcmGrcc9NR1SgbX0PRMlWJJe0zM582gI4D13FWPCUmA6aEekuZQcwP5y47YyxD21TVTrAnxVJURZutz5hUBVvccS9b_pon06SpIxd4QQV6PvWkuO_d_gIkn1VPLEzlMqR1mZncQPmmMBPsMco4DcA')" }}>
              <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">Live Preview</div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-[#111418] dark:text-white">Route 42 - North Campus</h4>
                  <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">Operates Mon-Fri</p>
                </div>
                <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Available</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#111418] dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#617589]" style={{ fontSize: 18 }}>schedule</span>
                  <span>Pickup: <span className="font-semibold">07:45 AM</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#617589]" style={{ fontSize: 18 }}>flag</span>
                  <span>Drop: <span className="font-semibold">08:15 AM</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBukJ6MgbC0q91MEa2Us8K_HQe67g57tiC829DUTyI-zENh0zVInrCX_byLazq3piMnyZwr4zCVl9xODCRUVZ5AZjuxnJarZN8gaMwK4grLLxOu7ZkUTNy82XXBa4ZrIWO31TGQOAF5yz42xeZ9S689LPNesFdVpuTpfz_ueyIlS1n6d0WkaDPH7V5_dWZZHlKfebPyePX2g2q5K52aQDd17cZXoFdi1BkZeTeCXoTwD64fSJIaFcB3jg9SptKW8GekMSOnOWC1XFM')" }} />
                  <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUUGTQniFozRSSZFQYGUjruMrUSuU3BPRlayA3tCl882l6EwLOMPx2qBZl2BsqV3Y-0o51CGqV34YUUtokhYA5_z9q0i14mYm6WlFPBjTj21hYHw-OHOLRSLW3zlBocWOgvr3DyYhz0wWN9BcM1_tBbktPv9oBuFVL_l93Xr7hcGTF8u4_kehDrYwqxloZrZwLkcCe4Qw2xhPOAlkOykLLOM1gCp_0pIKtwFxIZ3g5U3lBj4Djbf3My4jKIAjg3H8uOf4j8FuQ9dM')" }} />
                  <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 3" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAuBpLzJDzIiWM1O3UOMv0tEs85GwTx27H2xqkVclz_d0m7sVOe8RZLonGs_Hmh7gQlckCEFJoiGi_cSkc--PK11YWjGubVL01VeYa5qPy__rsKk4Xas4dsHE6ngfYnkyng6k2ydDbRZkwx9ILVS0gD8lczT_egKOYLuo-Byr9t-CVpdQqKSPYJ_jHAojcJiXQUGvYIlwuwyT0AFV9ZwoGx7H7ipPfBUQ2hx2RryqXwlfGRkx4ALZ5sR253bgKtLL0qP3cQ6fHBGmw')" }} />
                </div>
                <p className="text-xs text-[#617589] dark:text-gray-400">+124 students on this route</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="px-4 pt-2 pb-6">
          <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3">Payment Summary</h3>
          <div className="rounded-xl bg-background-light dark:bg-[#1a2632] p-4 border border-transparent dark:border-gray-700">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-[#617589] dark:text-gray-400">Semester Base Fare</span>
              <span className="text-[#111418] dark:text-white font-medium">$150.00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-[#617589] dark:text-gray-400">Service Tax (3.3%)</span>
              <span className="text-[#111418] dark:text-white font-medium">$5.00</span>
            </div>
            <div className="flex justify-between py-3 mt-1">
              <span className="text-[#111418] dark:text-white font-bold text-lg">Total Due</span>
              <span className="text-primary font-bold text-lg">$155.00</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="px-4 pb-20">
          <h3 className="text-[#111418] dark:text-white text-sm font-medium leading-normal mb-3">Payment Method</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between p-3 border border-primary bg-primary/5 rounded-lg cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <input defaultChecked className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                <div className="flex flex-col">
                  <span className="text-[#111418] dark:text-white font-medium text-sm">Student Account</span>
                  <span className="text-[#617589] dark:text-gray-400 text-xs">Balance: $450.00</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            </label>
            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <div className="flex items-center gap-3">
                <input className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                <div className="flex flex-col">
                  <span className="text-[#111418] dark:text-white font-medium text-sm">Apple Pay</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#111418] dark:text-white">contactless</span>
            </label>
            <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <div className="flex items-center gap-3">
                <input className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                <div className="flex flex-col">
                  <span className="text-[#111418] dark:text-white font-medium text-sm">Credit / Debit Card</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#111418] dark:text-white">credit_card</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Action Button */}
      <BottomAction text={"Register & Pay - $155.00"} icon="account_balance_wallet" />
    </div>
  );
}
