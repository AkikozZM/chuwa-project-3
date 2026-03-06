import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import {
  ErrorPage,
  HomePage,
  LoginPage,
  SignUpPage,
  SuccessfulPage,
  ForgetPassword,
  UpdatePasswordPage,
  CreateProductPage,
  EditProductPage,
  ProductDetailPage,
  MyOrdersPage,
  OrderDetailPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/error"
          element={
            <Layout>
              <ErrorPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignUpPage />
            </Layout>
          }
        />
        <Route
          path="/forgot-password/:email/update-password/:token"
          element={
            <Layout>
              <UpdatePasswordPage />
            </Layout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <Layout>
              <UpdatePasswordPage />
            </Layout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgetPassword />
            </Layout>
          }
        />
        <Route
          path="/forgot-password-success"
          element={
            <Layout>
              <SuccessfulPage />
            </Layout>
          }
        />
        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/create-product"
            element={
              <Layout>
                <CreateProductPage />
              </Layout>
            }
          />
          <Route
            path="/edit-product"
            element={
              <Layout>
                <EditProductPage />
              </Layout>
            }
          />
        </Route>
        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetailPage />
            </Layout>
          }
        />
        <Route
          path="/orders"
          element={
            <Layout>
              <MyOrdersPage />
            </Layout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <Layout>
              <OrderDetailPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
