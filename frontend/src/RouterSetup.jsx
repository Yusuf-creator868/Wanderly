import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./MainLayout";
import Pages from "./Pages";
import LoginPage from "./authentication/login";
import RegisterPage from "./authentication/register";
import { Authenticate } from "./useAuth";
import AgencyDashboardLayout from "./agency/AgencyDashboardLayout";
import CreateTourPage from "./agency/CreateTourPage";
import MyTours from "./agency/Mytours";
import TourPreviewModal from "./agency/TourOverview/TourPreviewPage";
import DashboardPage from "./agency/Dashboard";
import SearchToursPage from "./SearchPage/SearchPage";
import FavoritesPage from "./SearchPage/Favorites";
import TourDetailsPage from "./SearchPage/CardDetail";
import AgencyProfile from "./agency/ProfilePage";
import BookingsPage from "./agency/Bookings";
import TravelerProfilePage from "./traveler/profile";
import PrivateRouter from "./privet_roter";
import VerifyEmailPage from "./authentication/VerifyEmailPage";
import Sidebar from "./admin/sidebar";
import UsersPage from "./admin/users";
import AdminLayout from "./admin/admindashlayout";
import AgenciesPage from "./admin/agencies";
import ToursPage from "./admin/tours";
import BookinAdmingsPage from "./admin/bookings";
import AdminDashboardPage from "./admin/dashboardadmin";
import AdminRoute from "./admin/admin_route";

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Authenticate>
                <MainLayout />
            </Authenticate>

        ),

        children: [
            { index: true, element: <Pages /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "/verify-email/:uid/:token", element: <VerifyEmailPage /> },
            { path: "search", element: <SearchToursPage /> },
            { path: "favorites", element: <FavoritesPage /> },
            { path: "details/:id", element: <TourDetailsPage /> },
            { path: "profile", element: <PrivateRouter allowedRoles={["traveler"]}> <TravelerProfilePage /> </PrivateRouter> },

            {
                path: 'adminlayout',
                element:<AdminRoute> <AdminLayout /> </AdminRoute>,
                children: [
                    { index: true, element: <AdminDashboardPage/>},
                    { path: 'dashboard', element: <AdminDashboardPage/>},
                    { path: 'agencies', element: <AgenciesPage/>},
                    { path: "users", element: <UsersPage /> },
                    { path: "tours", element: <ToursPage /> },
                    { path: "bookings", element: <BookinAdmingsPage /> },
                   
            ]},

            {
                path: 'overview', element:
                    <PrivateRouter allowedRoles={["agency"]}>
                        <AgencyDashboardLayout />
                    </PrivateRouter>,

                children: [
                    { index: true, element: <MyTours /> },
                    // { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'profile/:slug', element: <AgencyProfile /> },
                    { path: 'createTour/:id', element: <CreateTourPage /> },
                    { path: 'update/:id', element: <CreateTourPage /> },
                    { path: 'myTours', element: <MyTours />, },
                    { path: 'bookings', element: <BookingsPage />, },
                    { path: 'TourPreviewPage/:id', element: <TourPreviewModal /> },
                ]
            }

        ]
    }
])


export default function RouterSetup() {
    return <RouterProvider router={router} />
}